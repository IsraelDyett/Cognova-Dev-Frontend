import { validateSession } from '@/app/auth/actions';
import { NextRequest, NextResponse } from 'next/server';
import { getDefaultWorkspace, isUserInWorkspace } from '@/app/(workspace)/actions';
import { debug } from '@/lib/utils';

export async function GET(request: NextRequest) {
    debug("[API] WORKSPACE")
    const url = new URL(request.url);
    const workspaceSlug = url.searchParams.get('slug');
    const sessionToken = url.searchParams.get('sessionToken');
    if (sessionToken) {
        const session = await validateSession(sessionToken);
        if (!session) {
            return NextResponse.json({
                success: false,
                redirect: `/auth/sign-in?redirect=/${workspaceSlug}`
            });
        }
        if (workspaceSlug) {
            try {
                if (workspaceSlug == "workspaces") {
                    return NextResponse.json({
                        success: true,
                        redirect: `/${workspaceSlug}`
                    });
                }
                const workspace = await isUserInWorkspace(session.user.id, workspaceSlug);
                if (!workspace.success) {
                    const defaultWorkspace = await getDefaultWorkspace(session.user.id);
                    if (defaultWorkspace) {
                        return NextResponse.json({
                            success: true,
                            redirect: `/${defaultWorkspace.slugName}`
                        });
                    }
                    return NextResponse.json({
                        success: false,
                        redirect: '/workspaces'
                    });
                }
                return NextResponse.json({ success: true, redirect: `/${workspace.workspace?.slugName}` });
            } catch (error) {
                return NextResponse.json({
                    success: false,
                    redirect: '/error'
                });
            }
        }
    }
    return NextResponse.json({ success: true });
}
