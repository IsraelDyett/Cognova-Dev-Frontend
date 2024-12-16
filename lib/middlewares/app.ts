import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/auth/sign-in", "/auth/sign-out", "/auth/sign-up", "/not-found"];

export async function AppMiddleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (publicPaths.includes(pathname)) {
		return NextResponse.next();
	}

	const match = pathname.match(/^\/([^/]+)/);
	const sessionToken = request.cookies.get("auth.session.token")?.value;

	if (!sessionToken) {
		return NextResponse.redirect(new URL("/auth/sign-in", request.url));
	}
	if (request.method === "GET") {
		// For root path without workspace
		if (!match || match[1] === "") {
			try {
				const response = await fetch(
					`${process.env.AUTH_TRUST_HOST || "http://localhost:3000"}/api/workspace/default?sessionToken=${sessionToken}`,
					{ cache: "force-cache" },
				);
				const data = await response.json();

				if (data.success && data.redirect) {
					return NextResponse.redirect(new URL(data.redirect, request.url));
				}
				return NextResponse.redirect(new URL("/onboarding", request.url));
			} catch (error) {
				console.error("Default workspace redirect error:", error);
				return NextResponse.next();
			}
		}

		// Handle workspace-specific routes
		if (match) {
			const workspaceName = match[1];
			const cachedWorkspace = request.cookies.get(`workspace.${workspaceName}`)?.value;

			// Check cache first
			if (cachedWorkspace) {
				const [cachedToken, cachedRedirect] = cachedWorkspace.split("|");
				if (cachedToken === sessionToken) {
					if (cachedRedirect !== `/${workspaceName}`) {
						return NextResponse.redirect(new URL(cachedRedirect, request.url));
					}
					return NextResponse.next();
				}
			}

			try {
				const workspaceResponse = await fetch(
					`${process.env.AUTH_TRUST_HOST || "http://localhost:3000"}/api/workspace?name=${workspaceName}&sessionToken=${sessionToken}&checkDomain=true`,
					{ cache: "force-cache" },
				);
				const workspaceData: {
					success: boolean;
					cache: boolean;
					redirect: string;
				} = await workspaceResponse.json();

				const response =
					workspaceData.redirect !== `/${workspaceName}`
						? NextResponse.redirect(new URL(workspaceData.redirect, request.url))
						: NextResponse.next();

				if (workspaceData.cache) {
					response.cookies.set(
						`workspace.${workspaceName}`,
						`${sessionToken}|${workspaceData.redirect}`,
						{
							maxAge: 900, // 15 minutes
							path: "/",
							httpOnly: true,
							secure: process.env.NODE_ENV === "production",
						},
					);
				}
				return response;
			} catch (error) {
				console.error("WORKSPACE MIDDLEWARE ERROR", error);
				return NextResponse.redirect(new URL("/error", request.url));
			}
		}
	}

	return NextResponse.next();
}
