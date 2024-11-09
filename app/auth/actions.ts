"use server";
import ms from "ms";
import { z } from "zod";
import { User } from "@prisma/client";
import { debug, exclude } from "@/lib/utils";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/services/prisma";
import { cookies, headers } from "next/headers";
import { userAgent } from "next/server";
import { SignInSchema, SignUpSchema } from "@/lib/zod";
import { comparePassword, hashPassword } from "@/utils/transactions";
import { redis } from "@/lib/services/redis";

export async function signInAction(data: z.infer<typeof SignInSchema>) {
  debug("SIGN IN");
  const user = await prisma?.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    return { success: false, message: "USER_NOT_FOUND" };
  }
  const { matched } = await comparePassword(data.password, user.password);
  if (!matched) {
    return { success: false, message: "INVALID_PASSWORD" };
  }
  return await authenticate("USER_SIGNED_IN", user);
}

export async function signUpAction(data: z.infer<typeof SignUpSchema>) {
  debug("SIGN UP");
  const existingUser = await prisma?.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    return { success: false, message: "USER_ALREADY_EXISTS" };
  }

  const cleanData = await hashPassword(data);
  const user = await prisma?.user.create({
    data: cleanData,
  });
  return await authenticate("USER_SIGNED_UP", user);
}

export async function SignUpOrInAction(
  data: z.infer<typeof SignUpSchema> & { id?: string },
  provider?: string,
) {
  debug("SIGN UP OR IN");
  const existingUser = await prisma?.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (existingUser) {
    if (provider != "google") {
      const { matched } = await comparePassword(data.password, existingUser.password);
      if (!matched) {
        return { success: false, message: "INVALID_PASSWORD" };
      }
      return await authenticate("USER_SIGNED_IN", existingUser);
    }
    return await authenticate("USER_SIGNED_IN", existingUser);
  } else {
    const cleanData = await hashPassword(data);
    const user = await prisma?.user.create({
      data: cleanData,
    });
    return await authenticate("USER_SIGNED_UP", user);
  }
}

const authenticate = async (action: "USER_SIGNED_UP" | "USER_SIGNED_IN", user: User) => {
  debug("AUTHENTICATE");
  try {
    const sessionToken = await createSession(user);
    cookies().set("auth.session.token", sessionToken.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      expires: sessionToken.expiresAt,
    });
    return {
      success: true,
      message: action,
      user: exclude(user, "password") as User,
      data: sessionToken,
    };
  } catch (error) {
    return { success: false, message: "SESSION_CREATION_FAILED" };
  }
};

async function createSession(user: User) {
  debug("CREATE_SESSION");
  const headersList = headers();
  const agent = userAgent({ headers: headersList });
  const sessionToken = await hashToken(crypto.randomUUID());
  await prisma?.$transaction(async (tx) => {
    const activeSessions = await tx.session.findMany({
      where: {
        userId: user.id,
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    if (activeSessions.length >= 5) {
      await tx.session.update({
        where: {
          id: activeSessions[activeSessions.length - 1].id,
        },
        data: {
          status: "INACTIVE",
        },
      });
    }

    await tx.session.create({
      data: {
        userId: user.id,
        sessionToken: sessionToken,
        ipAddress: headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "Unknown",
        device: agent.device.type,
        os: agent.os.name,
        browser: agent.browser.name,
        status: "ACTIVE",
        expiresAt: new Date(Date.now() + ms(process.env.SESSION_EXPIRATION ?? "5d")),
      },
    });
  });
  if (process.env.USE_REDIS == "1") {
    redis.set(`user:${sessionToken}`, JSON.stringify(user), {
      EX: ms(process.env.SESSION_EXPIRATION ?? "5d") / 1000,
    });
  }
  return {
    sessionToken,
    expiresAt: new Date(Date.now() + ms(process.env.SESSION_EXPIRATION ?? "5d")),
  };
}

export async function validateSession(defaultSessionToken?: string) {
  debug("VALIDATE_SESSION");
  let sessionToken = "";
  if (defaultSessionToken) {
    sessionToken = defaultSessionToken;
  } else {
    sessionToken = cookies().get("auth.session.token")?.value ?? "";
  }

  if (process.env.USE_REDIS == "1") {
    const cachedUser = await redis.get(`user:${sessionToken}`);
    if (cachedUser) {
      console.log("User found in cache {VALIDATE_SESSION}");
      return {
        user: JSON.parse(cachedUser) as User,
      };
    }
  }

  try {
    if (!sessionToken) {
      throw new Error("Unauthorized", { cause: "NO_SESSION_TOKEN" });
    }
    const session = await prisma?.$transaction(async (tx) => {
      const foundSession = await tx.session.findFirst({
        where: {
          AND: [{ sessionToken }, { status: "ACTIVE" }],
        },
        select: {
          id: true,
          user: true,
          expiresAt: true,
        },
      });

      if (!foundSession) {
        return null;
      }

      if (foundSession.expiresAt < new Date()) {
        await tx.session.update({
          where: { id: foundSession.id },
          data: {
            expiresAt: new Date(Date.now() + ms(process.env.SESSION_EXPIRATION ?? "5d")),
          },
        });
        cookies().set("auth.session.token", sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "lax",
          expires: new Date(Date.now() + ms(process.env.SESSION_EXPIRATION ?? "5d")),
        });
      }

      return foundSession;
    });

    if (!session) {
      throw new Error("Unauthorized", { cause: "SESSION_NOT_FOUND" });
    }

    return {
      user: session.user,
    };
  } catch (error) {
    const er = error as Error;
    console.error(er);
    customRedirect(`/auth/sign-in?error=AUTH_FAILED&reason=${er.cause}`);
  }
}

export async function authUser() {
  debug("AUTH_USER");
  try {
    const sessionToken = cookies().get("auth.session.token")?.value;
    if (sessionToken) {
      if (process.env.USE_REDIS == "1") {
        const cachedUser = await redis.get(`user:${sessionToken}`);
        if (cachedUser) {
          console.log("User found in cache {AUTH_USER}");
          return JSON.parse(cachedUser) as User;
        }
      }
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
    const er = error as Error;
    console.error(er.cause);
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
const customRedirect = (url: string) => {
  try {
  } catch (error) {
  } finally {
    redirect(url);
  }
};
