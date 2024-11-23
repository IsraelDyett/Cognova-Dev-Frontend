"use client";
import React from "react";
import CreateWorkspaceDialog from "./components/create-workspace-dialog";

export default function WorkspaceManager() {
	return (
		<div className="flex items-center min-h-[100dvh] justify-center">
			<CreateWorkspaceDialog />
		</div>
	);
}
