import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
const publicPaths = ['/auth/sign-in', '/auth/sign-up', "/", "/favicon.ico"];
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    if (pathname.startsWith('/_next') || publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    const match = pathname.match(/^\/([^/]+)/);
    const sessionToken = request.cookies.get('auth.session.token')?.value;
    if (match && request.method == "GET" && sessionToken) {
        const workspaceSlug = match[1];
        try {
            const workspaceResponse = await fetch(
                `${request.nextUrl.origin}/api/workspace?slug=${workspaceSlug}&sessionToken=${sessionToken}`,
            );
            const workspaceData: { success: boolean, redirect: string } = await workspaceResponse.json();
            if (workspaceData.redirect !== `/${workspaceSlug}`) {
                return NextResponse.redirect(new URL(workspaceData.redirect, request.url));
            }
        } catch (error) {
            console.log(error);
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|favicon.ico|_next/static|_next/image|.*\\.png$).*)',
        '/:workspace_slug/:path*'
    ],
};
