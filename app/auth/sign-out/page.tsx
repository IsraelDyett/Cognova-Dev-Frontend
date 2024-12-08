"use client";
import { toast } from "sonner";
import posthog from "posthog-js";
import { siteConfig } from "@/lib/site";
import React, { useEffect } from "react";
import LoadingDots from "@/components/ui/loading-dots";
import { signOut } from "@/lib/actions/server/auth";

export default function SignOutPage() {
	useEffect(() => {
		if (typeof window !== "undefined") {
			try {
				signOut(siteConfig.domains.root);
			} catch (error) {
				console.error(error, "signOut", "SignOutPage");
				toast.error("Something goes wrong");
			} finally {
				posthog.capture("Signed Out");
			}
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
