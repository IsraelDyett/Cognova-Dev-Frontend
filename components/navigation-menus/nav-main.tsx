"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { WorkspaceLink } from "@/app/(app)/(workspace)/components/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/app/(app)/contexts/workspace-context";

export function NavMain({
	items,
	title = "Platform",
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
	title?: string;
}) {
	const { workspace } = useWorkspace();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>{title}</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					return (
						<Collapsible
							key={item.title}
							asChild
							defaultOpen={item.isActive}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								{item.items ? (
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={item.title}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
								) : (
									<SidebarMenuButton tooltip={item.title} asChild>
										<WorkspaceLink href={item.url}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											{item.items && (
												<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											)}
										</WorkspaceLink>
									</SidebarMenuButton>
								)}
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((subItem) => (
											<SidebarMenuSubItem key={subItem.title}>
												<SidebarMenuSubButton asChild>
													<WorkspaceLink href={subItem.url}>
														<span>{subItem.title}</span>
													</WorkspaceLink>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
