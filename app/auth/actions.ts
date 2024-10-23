"use server";
import { z } from "zod";
import ms from 'ms';
import { User } from "@prisma/client";
import { exclude } from "@/lib/utils";
import { headers } from "next/headers";
import { signInSchema, signUpSchema } from "@/lib/zod";
import { NextRequest, NextResponse, userAgent } from "next/server";
import { comparePassword, hashPassword } from "@/utils/transactions";

export async function signInAction(data: z.infer<typeof signInSchema>) {
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
    try {
        const sessionToken = await createSession(user);
        return { success: true, message: 'USER_SIGNED_IN', user: exclude(user, 'password'), data: sessionToken };
    } catch (error) {
        return { success: false, message: 'SESSION_CREATION_FAILED' };
    }
}

export async function signUpAction(data: z.infer<typeof signUpSchema>) {
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

    try {
        const sessionToken = await createSession(user as User);
        return { success: true, message: 'USER_SIGNED_UP', user: exclude(user, 'password') as User, data: sessionToken };
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
                expiresAt: new Date(Date.now() + (ms(process.env.SESSION_EXPIRATION ?? '5d') * 1.2)),
            },
        });
    });

    return {
        sessionToken,
        expiresAt: new Date(Date.now() + (ms(process.env.SESSION_EXPIRATION ?? '5d') * 1.2)),
    };
}

async function validateSession(request: NextRequest) {
    const response = NextResponse.next();
    const sessionToken = request.cookies.get("session.token")?.value;
    if (!sessionToken) {
        return {
            data: response,
            statusText: 'Unauthorized',
            action: "REDIRECT_TO_LOGIN",
        };
    }
    try {
        const sessionFound = await prisma?.$transaction(async (tx) => {
            const foundSession = await tx.session.findFirst({
                where: {
                    AND: [
                        { sessionToken },
                        { status: 'ACTIVE' },
                        { expiresAt: { gt: new Date() } }
                    ]
                },
            });
            if (!foundSession) {
                return "SESSION_ALREADY_ACTIVE";
            }
            await tx.session.update({
                where: {
                    id: foundSession?.id,
                },
                data: {
                    expiresAt: new Date(Date.now() + ms('5d'))
                }
            });
            return "UPDATED";

        });
        if (sessionFound) {
            return {
                data: response,
                statusText: 'OK',
                action: "CONTINUE",
            };
        }
    } catch (error) {
        return {
            status: 401,
            statusText: 'Unauthorized',
            action: "REDIRECT_TO_LOGIN",
        };
    }
} 
export const hashToken = async (token: string) => {
    const encoder = new TextEncoder();

    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};