import { NextResponse } from "next/server";
import { APP_HOSTNAMES } from "./lib/config";
import type { NextRequest } from "next/server";
import { parse } from "./lib/middlewares/utils";
import { AppMiddleware } from "@/lib/middlewares/app";

export async function middleware(request: NextRequest) {
	const { domain } = parse(request);

	if (APP_HOSTNAMES.has(domain)) {
		return AppMiddleware(request);
	}
	const allowedRootUris = ["/", "/not-found"];
	const { pathname } = request.nextUrl;
	if (!allowedRootUris.includes(pathname) && !pathname.startsWith("/chats")) {
		return NextResponse.rewrite(new URL("/not-found", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all paths except for:
		 * 1. /api/ routes
		 * 2. /_next/ (Next.js internals)
		 * 3. /_proxy/ (proxies for third-party services)
		 * 4. Metadata files: favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest, .well-known
		 * 5. embed.js for web chat support
		 */
		"/((?!api/|_next/|_proxy/|images/*|favicon.ico|embed.js|sitemap.xml|robots.txt|manifest.webmanifest|.well-known/).*)",
	],
};
