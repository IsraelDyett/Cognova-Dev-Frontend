import { validateSession } from '@/app/auth/actions';
import { NextRequest, NextResponse } from 'next/server';
import { getDefaultWorkspace, isUserInWorkspace } from '@/app/(workspace)/actions';
import { debug } from '@/lib/utils';

export async function GET(request: NextRequest) {
    debug("[API] WORKSPACE")
    const url = new URL(request.url);
    const workspaceName = url.searchParams.get('name');
    const sessionToken = url.searchParams.get('sessionToken');
    if (sessionToken) {
        const session = await validateSession(sessionToken);
        if (!session) {
            return NextResponse.json({
                success: false,
                redirect: `/auth/sign-in?redirect=/${workspaceName}`
            });
        }
        if (workspaceName) {
            try {
                if (workspaceName == "workspaces") {
                    return NextResponse.json({
                        success: true,
                        cache: false,
                        redirect: `/${workspaceName}`
                    });
                }
                const workspace = await isUserInWorkspace(session.user.id, workspaceName);
                if (!workspace.success) {
                    const defaultWorkspace = await getDefaultWorkspace(session.user.id);
                    if (defaultWorkspace) {
                        return NextResponse.json({
                            success: true,
                            cache: true,
                            redirect: `/${defaultWorkspace.name}`
                        });
                    }
                    return NextResponse.json({
                        success: false,
                        cache: false,
                        redirect: '/workspaces'
                    });
                }
                return NextResponse.json({ 
                    success: true, 
                    cache: true,
                    redirect: `/${workspace.workspace?.name}` 
                });
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
