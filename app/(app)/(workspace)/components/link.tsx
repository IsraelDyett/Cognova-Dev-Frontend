"use client";
import { cn } from "@/lib/utils";
import NextLink, { LinkProps } from "next/link";
import { useParams, usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

interface WorkspaceLinkProps extends Omit<LinkProps, "href"> {
	href?: string;
	className?: string;
}

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

export function WorkspaceLink({
	href = "/",
	children,
	className,
	...props
}: PropsWithChildren<WorkspaceLinkProps>) {
	const currentPath = usePathname();
	const { botId, workspaceId, businessId } = useParams();
	const cleanedHref = href.startsWith("/") ? href.slice(1) : href;
	const formattedHref = cleanedHref
		.replaceAll("{botId}", `${botId}`)
		.replaceAll("{businessId}", `${businessId}`);

	const normalizedCurrentPath = normalizeUrl(currentPath, workspaceId as string);

	const normalizedItemUrl = normalizeUrl(formattedHref, workspaceId as string);
	const isActive = normalizedCurrentPath === normalizedItemUrl;

	return (
		<NextLink
			className={cn(isActive && "text-primary", className)}
			href={href == "#" ? "#" : `/${workspaceId}/${formattedHref}`}
			{...props}
		>
			{children}
		</NextLink>
	);
}
