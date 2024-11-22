"use client";
import React from "react";
import { useWorkspaceStore } from "./store";
import { getRoles } from "../actions";
import CreateWorkspaceDialog from "./components/create-workspace-dialog";

export default function WorkspaceManager() {
	const { setRoles } = useWorkspaceStore();

	React.useEffect(() => {
		const loadRoles = async () => {
			const roles = await getRoles();
			setRoles(roles);
		};
		loadRoles();
	}, [setRoles]);

	return (
		<div className="flex items-center min-h-[100dvh] justify-center">
			<CreateWorkspaceDialog />
		</div>
	);
}
