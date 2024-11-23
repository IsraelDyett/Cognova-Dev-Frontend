import { debug } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/app/(guest)/auth/actions";
import { getDefaultWorkspace } from "@/app/(auth)/(workspace)/actions";

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

	const session = await validateSession(sessionToken, "/");

	if (!session) {
		return NextResponse.json({
			success: false,
			redirect: `/auth/sign-in?redirect=/`,
		});
	}
	const defaultWorkspace = await getDefaultWorkspace(session.user.id);
	if (defaultWorkspace) {
		return NextResponse.json({
			success: true,
			cache: true,
			redirect: `/${defaultWorkspace.name}`,
		});
	}
	return NextResponse.json({
		success: false,
		cache: false,
		redirect: "/onboarding",
	});
}
