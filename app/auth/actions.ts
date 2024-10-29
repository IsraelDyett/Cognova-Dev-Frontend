"use server";
import ms from 'ms';
import { z } from "zod";
import { User } from "@prisma/client";
import { exclude } from "@/lib/utils";
import { prisma } from "@/lib/services/prisma";
import { cookies, headers } from "next/headers";
import { SignInSchema, SignUpSchema } from "@/lib/zod";
import { NextRequest, NextResponse, userAgent } from "next/server";
import { comparePassword, hashPassword } from "@/utils/transactions";
import { redirect } from 'next/navigation';

export async function signInAction(data: z.infer<typeof SignInSchema>) {
    const user = await prisma?.user.findUnique({
        where: {
            email: data.email,
        },
    });

    if (!user) {
        return { success: false, message: 'USER_NOT_FOUND' };
    }
    const { matched } = await comparePassword(data.password, user.password)
    if (!matched) {
        return { success: false, message: 'INVALID_PASSWORD' };
    }
    return await authenticate("USER_SIGNED_IN", user);
}


export async function signUpAction(data: z.infer<typeof SignUpSchema>) {
    const existingUser = await prisma?.user.findUnique({
        where: {
            email: data.email,
        },
    });

    if (existingUser) {
        return { success: false, message: 'USER_ALREADY_EXISTS' };
    }

    const cleanData = await hashPassword(data);
    const user = await prisma?.user.create({
        data: cleanData,
    });
    return await authenticate("USER_SIGNED_UP", user);
}

export async function SignUpOrInAction(data: z.infer<typeof SignUpSchema> & { id?: string }) {
    const existingUser = await prisma?.user.findUnique({
        where: {
            email: data.email,
        },
    });
    if (existingUser) {
        const { matched } = await comparePassword(data.password, existingUser.password)
        if (!matched) {
            return { success: false, message: 'INVALID_PASSWORD' };
        }
        return await authenticate("USER_SIGNED_UP", existingUser);
    } else {
        const cleanData = await hashPassword(data);
        const user = await prisma?.user.create({
            data: cleanData,
        });
        return await authenticate("USER_SIGNED_UP", user);
    }
}

const authenticate = async (action: "USER_SIGNED_UP" | "USER_SIGNED_IN", user: User) => {
    try {
        const sessionToken = await createSession(user);
        cookies().set("auth.session.token", sessionToken.sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
            expires: sessionToken.expiresAt,
        });
        return { success: true, message: action, user: exclude(user, 'password') as User, data: sessionToken };
    } catch (error) {
        return { success: false, message: 'SESSION_CREATION_FAILED' };
    }
}

async function createSession(user: User) {
    const headersList = headers();
    const agent = userAgent({ headers: headersList });
    const sessionToken = await hashToken(crypto.randomUUID());
    await prisma?.$transaction(async (tx) => {
        const activeSessions = await tx.session.findMany({
            where: {
                userId: user.id,
                status: 'ACTIVE',
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        });

        if (activeSessions.length >= 5) {
            await tx.session.update({
                where: {
                    id: activeSessions[activeSessions.length - 1].id
                },
                data: {
                    status: 'INACTIVE'
                }
            });
        }

        await tx.session.create({
            data: {
                userId: user.id,
                sessionToken: sessionToken,
                ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'Unknown',
                device: agent.device.type,
                os: agent.os.name,
                browser: agent.browser.name,
                status: 'ACTIVE',
                expiresAt: new Date(Date.now() + ms(process.env.SESSION_EXPIRATION ?? '5d')),
            },
        });
    });

    return {
        sessionToken,
        expiresAt: new Date(Date.now() + ms(process.env.SESSION_EXPIRATION ?? '5d')),
    };
}

export async function validateSession(request: NextRequest) {
    const response = NextResponse.next();
    const sessionToken = request.cookies.get("auth.session.token")?.value;

    if (!sessionToken) {
        return {
            data: response,
            status: 401,
            statusText: 'Unauthorized',
            action: "REDIRECT_TO_LOGIN",
        };
    }

    try {
        const session = await prisma?.$transaction(async (tx) => {
            const foundSession = await tx.session.findFirst({
                where: {
                    AND: [
                        { sessionToken },
                        { status: 'ACTIVE' }
                    ],
                },
                select: {
                    id: true,
                    user: true,
                    expiresAt: true
                }
            });

            if (!foundSession) return null;

            // Update session expiration if needed
            if (foundSession.expiresAt < new Date()) {
                await tx.session.update({
                    where: { id: foundSession.id },
                    data: {
                        expiresAt: new Date(Date.now() + ms(process.env.SESSION_EXPIRATION ?? '5d'))
                    }
                });
            }

            return foundSession;
        });

        if (!session) {
            return {
                data: response,
                status: 401,
                statusText: 'Unauthorized',
                action: "REDIRECT_TO_LOGIN",
            };
        }

        return {
            data: session.user,
            status: 200,
            statusText: 'OK',
            action: "CONTINUE",
        };

    } catch (error) {
        return {
            data: response,
            status: 401,
            statusText: 'Unauthorized',
            action: "REDIRECT_TO_LOGIN",
        };
    }
}

export async function authUser() {
    try {
        const sessionToken = cookies().get("auth.session.token")?.value;
        if (sessionToken) {
            const user = await prisma?.session.findFirst({
                where: {
                    sessionToken,
                },
                include: {
                    user: true,
                },
            });
            if (user) {
                return user.user;
            }
            throw new Error("Unauthorized", { cause: "INVALID_SESSION" });
        }
        throw new Error("Unauthorized", { cause: "NO_SESSION_TOKEN" });
    } catch (error) {
        console.error(error);
        const er = error as Error;
        customRedirect(`/auth/sign-in?error=AUTH_FAILED&reason=${er.cause}`);
    }
}
export const hashToken = async (token: string) => {
    const encoder = new TextEncoder();

    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};
const customRedirect =(url: string) => {
    try { } catch (error) { }
    finally {
        redirect(url)
    }
};