"use client";
import { Workspace, Plan, Bot, Business } from "@prisma/client";
import { useParams } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { retrieveWorkspace } from "../actions";
import { debug } from "@/lib/utils";

interface ExtendedWorkspace extends Workspace {
	plan?: Plan | null;
	bots: Bot[] | null;
	businesses: Business[] | null;
}

const DefaultProps = {
	workspace: null as ExtendedWorkspace | null,
	isLoading: false,
	refreshCurrentWorkspace: () => Promise.resolve(),
};

export interface WorkspaceContextType {
	workspace: ExtendedWorkspace | null;
	isLoading: boolean;
	refreshCurrentWorkspace: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType>(DefaultProps);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { workspaceId } = useParams();
	const alreadyMounted = React.useRef(false);
	const [workspace, setWorkspace] = useState<ExtendedWorkspace | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchWorkspace = async () => {
		if (workspaceId) {
			debug("CLIENT", "fetchWorkspace", "CONTEXT");
			const retrievedWorkspace = await retrieveWorkspace(`${workspaceId}`, true);
			if (retrievedWorkspace) {
				setWorkspace(retrievedWorkspace);
				setIsLoading(false);
			}
		}
	};
	useEffect(() => {
		if (!alreadyMounted.current && workspaceId) {
			fetchWorkspace().catch((err) => {
				console.error("Error fetching workspace:", err);
				alreadyMounted.current = false;
			});
			alreadyMounted.current = true;
		}
	}, [workspaceId]);

	return (
		<WorkspaceContext.Provider value={{ workspace, isLoading, refreshCurrentWorkspace: fetchWorkspace }}>
			{children}
		</WorkspaceContext.Provider>
	);
};

export const useWorkspace = (): WorkspaceContextType => {
	const context = useContext(WorkspaceContext);
	if (!context) {
		throw new Error("useWorkspace must be used within an WorkspaceProvider");
	}
	return context;
};
