import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authUser, validateSession } from './app/auth/actions';
import { notFound } from 'next/navigation';
import { isUserInOrganization } from './app/(organization)/actions';

export async function middleware(request: NextRequest) {
    const session = await validateSession(request)
    const { pathname } = request.nextUrl
    if (session) {
        const defaultWorkspace = await getDefaultWorkspace(session.user.id);
        if (defaultWorkspace) {
            try {
                const organization = await isUserInOrganization(user?.id, orgSlug)
                if (!organization.success) {
                    notFound();
                }

            } catch (error) {
                return NextResponse.redirect(new URL('/error', request.url));
            }
        }
        else {
            return NextResponse.redirect(new URL("/workspaces", req.url));
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|.*\\.png$).*)',
        '/:org_slug/:path*'
    ]
}
