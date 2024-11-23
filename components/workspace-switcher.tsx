"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSidebarStore } from "./sidebar-store";
import { useAuth } from "@/app/(auth)/(workspace)/contexts/auth-context";
import { useWorkspace } from "@/app/(auth)/(workspace)/contexts/workspace-context";
import { Skeleton } from "./ui/skeleton";
import dynamic from "next/dynamic";

export function WorkspaceSwitcher() {
	const router = useRouter();
	const { user } = useAuth();
	const { isMobile } = useSidebar();
	const { workspace, isLoading } = useWorkspace();
	const { workspaces, fetchWorkspaces } = useSidebarStore();

	const alreadyMounted = React.useRef(false);
	React.useEffect(() => {
		if (!alreadyMounted.current) {
			fetchWorkspaces(user.id);
			alreadyMounted.current = true;
		}
	}, []);
	const CreateWorkspaceDialog = dynamic(
		() => import("@/app/(auth)/onboarding/components/create-workspace-dialog"),
		{ ssr: false },
	);
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="flex aspect-square overflow-hidden size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
								{isLoading ? (
									<Skeleton className="h-8 w-8" />
								) : (
									<Image
										alt="Workspace Logo"
										src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURI(workspace?.name || "loading")}&backgroundType=gradientLinear,solid&backgroundRotation=-310,-240&fontFamily=Courier%20New&fontWeight=600`}
										width={32}
										height={32}
										className="size-8"
									/>
								)}
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								{isLoading ? (
									<>
										<Skeleton className="w-5/6 h-4" />
										<Skeleton className="w-3/5 h-3 mt-1" />
									</>
								) : (
									<>
										<span className="truncate font-semibold">
											{workspace?.displayName}
										</span>
										<span className="truncate text-xs">
											{workspace?.plan?.displayName}
										</span>
									</>
								)}
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-xs text-muted-foreground">
							Workspaces
						</DropdownMenuLabel>
						{workspaces.map((ws) => (
							<DropdownMenuItem
								key={ws.name}
								onClick={() => router.push(`/${ws.name}`)}
								className="gap-2 p-2"
							>
								<div className="flex size-6 items-center justify-center rounded-sm overflow-hidden border">
									<Image
										alt="Workspace Logo"
										src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURI(ws?.name || "loading")}&backgroundType=gradientLinear,solid&backgroundRotation=-310,-240&fontFamily=Courier%20New&fontWeight=600`}
										width={24}
										height={24}
										className="size-6"
									/>
								</div>
								{ws.displayName}
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<React.Suspense
							fallback={<DropdownMenuItem disabled>Loading...</DropdownMenuItem>}
						>
							<CreateWorkspaceDialog
								customTrigger={
									<DropdownMenuItem
										onSelect={(e) => e.preventDefault()}
										className="gap-2 p-2"
									>
										<div className="flex size-6 items-center justify-center rounded-md border bg-background">
											<Plus className="size-4" />
										</div>
										<div className="font-medium text-muted-foreground">
											Create new workspace
										</div>
									</DropdownMenuItem>
								}
							/>
						</React.Suspense>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
