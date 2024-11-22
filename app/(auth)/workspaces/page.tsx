"use client";
import React from "react";
import { debug } from "@/lib/utils";
import { getRoles } from "../../actions";
import { useWorkspaceStore } from "./store";
import CreateWorkspaceDialog from "./components/create-workspace-dialog";

export default function WorkspaceManager() {
	const { setRoles } = useWorkspaceStore();

	React.useEffect(() => {
		const loadRoles = async () => {
			debug("CLIENT", "loadRoles", "PAGE");
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
