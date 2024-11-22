"use client";

import { Folder, Forward, MoreHorizontal, Trash2, Bot as BotIcon } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import React from "react";
import { useSidebarStore } from "./sidebar-store";
import { Skeleton } from "./ui/skeleton";
import { shareBot } from "./share-button";

export function NavBots({ workspaceId }: { workspaceId: string }) {
	const { isMobile } = useSidebar();
	const alreadyMounted = React.useRef(false);
	const { bots, fetchBots, loadingStates } = useSidebarStore();

	React.useEffect(() => {
		if (!alreadyMounted.current && bots.length === 0) {
			fetchBots(workspaceId);
			alreadyMounted.current = true;
		}
	}, []);
	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Bots</SidebarGroupLabel>
			<SidebarMenu>
				{loadingStates.bots !== "success" ? (
					<>
						{Array.from({ length: 3 }).map((_, index) => (
							<SidebarMenuItem key={index}>
								<SidebarMenuButton asChild>
									<div className="flex">
										<Skeleton className="h-6 w-8" />
										<Skeleton className="w-full h-6" />
									</div>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</>
				) : (
					<>
						{bots.slice(0, 3).map((bot) => (
							<SidebarMenuItem key={bot.name}>
								<SidebarMenuButton asChild>
									<Link
										href={`/${workspaceId}/bots/${bot.id}`}
										className="w-full"
									>
										<BotIcon />
										<span>{bot.name}</span>
									</Link>
								</SidebarMenuButton>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<SidebarMenuAction showOnHover>
											<MoreHorizontal />
											<span className="sr-only">More</span>
										</SidebarMenuAction>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-48 rounded-lg"
										side={isMobile ? "bottom" : "right"}
										align={isMobile ? "end" : "start"}
									>
										<DropdownMenuItem onClick={() => shareBot(bot)}>
											<Forward className="text-muted-foreground" />
											<span>Share Bot</span>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem>
											<Trash2 className="text-muted-foreground" />
											<span>Delete Bot</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</SidebarMenuItem>
						))}
					</>
				)}
				{bots.length > 3 && (
					<SidebarMenuItem>
						<SidebarMenuButton className="text-sidebar-foreground/70">
							<MoreHorizontal className="text-sidebar-foreground/70" />
							<span>More</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				)}
			</SidebarMenu>
		</SidebarGroup>
	);
}
