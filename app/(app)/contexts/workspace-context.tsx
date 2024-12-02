"use client";
import { debug } from "@/lib/utils";
import { useParams } from "next/navigation";
import { retrieveWorkspace } from "@/lib/actions/server/workspace";
import { Workspace, Plan, Bot, Business, Subscription, BusinessProductsCategory } from "@prisma/client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface ExtendedWorkspace extends Workspace {
	subscription: Subscription & { plan?: Plan | null };
	businesses: (Business & { bots: Bot[], categories: BusinessProductsCategory[] })[] | null;
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
	const [isLoading, setIsLoading] = useState(true);
	const [workspace, setWorkspace] = useState<ExtendedWorkspace | null>(null);

	const fetchWorkspace = useCallback(async () => {
		if (workspaceId) {
			debug("CLIENT", "fetchWorkspace", "CONTEXT");
			const { data: retrievedWorkspace } = await retrieveWorkspace({
				workspaceId: `${workspaceId}`,
				include: {
					businesses: {
						include: {
							bots: true,
							categories: true
						}
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
	}, [workspaceId]);

	useEffect(() => {
		if (!alreadyMounted.current && workspaceId) {
			fetchWorkspace().catch((err) => {
				console.error("Error fetching workspace:", err);
				alreadyMounted.current = false;
			});
			alreadyMounted.current = true;
		}
	}, [fetchWorkspace, workspaceId]);

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
