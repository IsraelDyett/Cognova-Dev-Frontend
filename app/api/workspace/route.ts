import { debug } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import SessionServerActions from "@/lib/actions/server/session";
import WorkspaceServerActions from "@/lib/actions/server/workspace";

export async function GET(request: NextRequest) {
	debug("API", "GET", "PRISMA ACTIONS", "app/(guest)/api/workspace/route.ts");

	const url = new URL(request.url);
	const workspaceName = url.searchParams.get("name");
	const sessionToken = url.searchParams.get("sessionToken");

	if (!sessionToken) {
		return NextResponse.json({
			success: false,
			redirect: "/auth/sign-in",
		});
	}

	const session = await SessionServerActions.checkSession({ defaultSessionToken: sessionToken });

	if (!session.success) {
		return NextResponse.json({
			success: false,
			redirect: `/auth/sign-in?redirect=/${workspaceName || ""}`,
		});
	}

	if (workspaceName) {
		try {
			if (workspaceName === "onboarding") {
				return NextResponse.json({
					success: true,
					cache: false,
					redirect: `/${workspaceName}`,
				});
			}

			const {
				data: workspace,
				success: success,
				error,
			} = await WorkspaceServerActions.checkWorkspaceMembership({
				workspaceId: workspaceName,
				userId: session.data.user.id,
			});

			if (!success || !workspace.status) {
				return NextResponse.json({
					success: false,
					cache: false,
					redirect: "/not-found",
				});
			}

			return NextResponse.json({
				success: true,
				cache: true,
				redirect: `/${workspace.workspace?.name}`,
			});
		} catch (error) {
			return NextResponse.json({
				success: false,
				redirect: "/error",
			});
		}
	}

	return NextResponse.json({ success: true });
}
