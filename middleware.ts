import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/auth/sign-in", "/auth/sign-up", "/", "/favicon.ico"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/_next") || publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const match = pathname.match(/^\/([^/]+)/);
  const sessionToken = request.cookies.get("auth.session.token")?.value;

  if (match && request.method == "GET" && sessionToken) {
    const workspaceName = match[1];
    const cachedWorkspace = request.cookies.get(`workspace.${workspaceName}`)?.value;
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
        `${request.nextUrl.origin}/api/workspace?name=${workspaceName}&sessionToken=${sessionToken}`,
        {
          cache: "force-cache",
        },
      );
      const workspaceData: { success: boolean; cache: boolean; redirect: string } =
        await workspaceResponse.json();

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
      console.log(error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|favicon.ico|_next/static|_next/image|.*\\.png$).*)", "/:workspaceId/:path*"],
};
