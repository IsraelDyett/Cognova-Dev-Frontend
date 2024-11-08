import { debug } from "@/lib/utils";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  debug("[API] AUTH/AUTHENTICATE");
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return new Response("Invalid request body", { status: 400 });
    }
    const { session } = body;

    if (!session || !session.sessionToken) {
      return new Response("Authentication failed", { status: 401 });
    }
    cookies().set("auth.session.token", session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      expires: session.expiresAt,
    });
    return new Response(
      JSON.stringify({
        success: true,
        expiresAt: session.expiresAt,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Authentication error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Authentication failed",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
