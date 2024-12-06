"use client";
import posthog from "posthog-js";
import React, { useEffect } from "react";
import LoadingDots from "@/components/ui/loading-dots";
import { removeCookie } from "@/lib/actions/client/cookies";
import AuthServerActions from "@/lib/actions/server/auth";

export default function SignOutPage() {
	const cookieKey = AuthServerActions.authCookieKey;
	useEffect(() => {
		posthog.capture("Signed Out");
		if (typeof window !== "undefined") {
			removeCookie(cookieKey);
		}
	}, [cookieKey]);
	return (
		<div className="flex fixed flex-col items-center justify-center h-screen bg-white inset-0">
			<div className="flex items-end space-x-2">
				<p className="text-base font-medium pr-2 translate-y-1.5">Logging out</p>
				<LoadingDots />
			</div>
		</div>
	);
}
