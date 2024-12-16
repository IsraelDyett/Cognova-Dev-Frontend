"use client";
import { debug } from "@/lib/utils";
import { useParams } from "next/navigation";
import { retrieveWorkspace } from "@/lib/actions/server/workspace";
import { Workspace, Plan, Bot, Business, Subscription } from "@prisma/client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface ExtendedWorkspace extends Workspace {
	subscription: Subscription & { plan?: Plan | null };
	businesses: (Business & { bots: Bot[] })[] | null;
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

export const WorkspaceProvider: React.FC<{
	children: React.ReactNode;
	overrideWorkspaceId?: string;
}> = ({ children, overrideWorkspaceId }) => {
	const { workspaceId } = useParams();
	const alreadyMounted = React.useRef(false);
	const [isLoading, setIsLoading] = useState(true);
	const [workspace, setWorkspace] = useState<ExtendedWorkspace | null>(null);

	const fetchWorkspace = useCallback(async () => {
		const idToUse = overrideWorkspaceId || workspaceId;
		if (idToUse) {
			debug("CLIENT", "fetchWorkspace", "CONTEXT");
			const { data: retrievedWorkspace } = await retrieveWorkspace({
				workspaceId: `${idToUse}`,
				include: {
					businesses: {
						include: {
							bots: true,
						},
					},
					subscription: {
						include: {
							plan: true,
						},
					},
				},
			});
			if (retrievedWorkspace) {
				// @ts-ignore
				setWorkspace(retrievedWorkspace);
				setIsLoading(false);
			}
		}
	}, [workspaceId, overrideWorkspaceId]);

	useEffect(() => {
		if (!alreadyMounted.current && (workspaceId || overrideWorkspaceId)) {
			fetchWorkspace().catch((err) => {
				console.error("Error fetching workspace:", err);
				alreadyMounted.current = false;
			});
			alreadyMounted.current = true;
		}
	}, [fetchWorkspace, workspaceId, overrideWorkspaceId]);

	return (
		<WorkspaceContext.Provider
			value={{ workspace, isLoading, refreshCurrentWorkspace: fetchWorkspace }}
		>
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
