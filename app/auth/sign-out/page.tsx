import React from "react";
import { siteConfig } from "@/lib/site";
import { signOut } from "@/lib/actions/server/auth";

export default async function SignOutPage() {
	await signOut(siteConfig.domains.root);
	return (
		<div className="flex fixed flex-col items-center justify-center h-screen bg-white inset-0">
			<div className="flex items-end space-x-2">
				<p className="text-base font-medium pr-2 translate-y-1.5">Logging out</p>
			</div>
		</div>
	);
}
