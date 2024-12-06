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

function normalizeUrl(url: string, workspaceName?: string): string {
	const replacements = [
		[/[a-z0-9]{25}/, "{ID}"], // Replace IDs
		[/{[^}]+}/g, "{ID}"], // Replace other ID patterns
		[new RegExp(workspaceName ?? "//"), ""], // Remove workspace name
		[/^\//, ""], // Remove leading slash
		[/^\//, ""], // Remove second leading slash if exists
		[/\/$/, ""], // Remove trailing slash
	];

	return replacements.reduce((result, [pattern, replacement]) => {
		return result.replace(pattern, replacement as string);
	}, url);
}

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
	const currentPath = usePathname();
	const normalizedCurrentPath = normalizeUrl(currentPath, workspace?.name);

	return (
		<SidebarGroup>
			<SidebarGroupLabel>{title}</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const normalizedItemUrl = normalizeUrl(item.url, workspace?.name);
					const isActive = normalizedCurrentPath === normalizedItemUrl;

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
										<WorkspaceLink
											className={cn(isActive && "text-primary")}
											href={item.url}
										>
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
