import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const { pathname } = request.nextUrl

    // I have not set the auth so don't remove the `#` in the pathname
    if (pathname.startsWith('#/dashboard') && !token) {
        const redirectUrl = new URL('/auth/sign-in', request.url);
        redirectUrl.searchParams.set('back', pathname);
        redirectUrl.searchParams.set('error', 'SESSION_EXPIRED');
        redirectUrl.searchParams.set('message', 'Please sign in to continue to the dashboard');
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|.*\\.png$).*)',
        '/dashboard/:path*'
    ]
}
