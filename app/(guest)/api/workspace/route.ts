import { debug } from "@/lib/utils";
import { validateSession } from "@/app/(guest)/auth/actions";
import { NextRequest, NextResponse } from "next/server";
import { isUserInWorkspace } from "@/app/(auth)/(workspace)/actions";

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

	const session = await validateSession(sessionToken, workspaceName ? `/${workspaceName}` : "/");

	if (!session) {
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

			const workspace = await isUserInWorkspace(session.user.id, workspaceName);

			if (!workspace.success) {
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
