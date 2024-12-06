"use client";
import posthog from "posthog-js";
import { siteConfig } from "@/lib/site";
import React, { useEffect } from "react";
import LoadingDots from "@/components/ui/loading-dots";

export default function SignOutPage() {
	useEffect(() => {
		posthog.capture("Signed Out");
		if (typeof window !== "undefined") {
			document.cookie = `auth.session.token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
			window.location.replace(siteConfig.domains.root);
		}
	}, []);
	return (
		<div className="flex fixed flex-col items-center justify-center h-screen bg-white inset-0">
			<div className="flex items-end space-x-2">
				<p className="text-base font-medium pr-2 translate-y-1.5">Logging out</p>
				<LoadingDots />
			</div>
		</div>
	);
}
