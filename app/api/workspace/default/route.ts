import { debug } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import SessionServerActions from "@/lib/actions/server/session";
import WorkspaceServerActions from "@/lib/actions/server/workspace";

export async function GET(request: NextRequest) {
	debug("API", "GET", "PRISMA ACTIONS", "app/(guest)/api/workspace/route.ts");

	const url = new URL(request.url);
	const sessionToken = url.searchParams.get("sessionToken");

	if (!sessionToken) {
		return NextResponse.json({
			success: false,
			redirect: "/auth/sign-in",
		});
	}

	const { data: session, success } = await SessionServerActions.checkSession({
		defaultSessionToken: sessionToken,
	});

	if (!success) {
		return NextResponse.json({
			success: false,
			redirect: `/auth/sign-in?redirect=/`,
		});
	}
	const { data: defaultWorkspace } = await WorkspaceServerActions.getDefaultWorkspace({
		userId: session.user.id,
	});
	if (defaultWorkspace) {
		return NextResponse.json({
			success: true,
			cache: true,
			redirect: `/${defaultWorkspace?.name}`,
		});
	}
	return NextResponse.json({
		success: false,
		cache: false,
		redirect: "/onboarding",
	});
}
