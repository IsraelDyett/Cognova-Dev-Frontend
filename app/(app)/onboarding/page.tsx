import React from "react";
import { Metadata } from "next";
import CreateWorkspaceDialog from "./components/create-workspace-dialog";

export const metadata: Metadata = {
	title: "Onboarding",
	description: "Get started by creating the workspace",
};
export default function OnBoardingPage() {
	return (
		<div className="flex items-center min-h-[100dvh] justify-center">
			<CreateWorkspaceDialog />
		</div>
	);
}
