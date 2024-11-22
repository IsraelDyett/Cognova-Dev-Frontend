"use client";
import NextLink, { LinkProps } from "next/link";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

interface WorkspaceLinkProps extends Omit<LinkProps, "href"> {
	href?: string;
	className?: string
}

export function WorkspaceLink({ href = "/", children, className, ...props }: PropsWithChildren<WorkspaceLinkProps>) {
	const { botId, workspaceId, businessId } = useParams();
	const cleanedHref = href.startsWith("/") ? href.slice(1) : href;
	const origin = typeof window !== "undefined" ? window.location.origin : "";
	const formattedHref = cleanedHref
		.replaceAll("{botId}", `${botId}`)
		.replaceAll("{businessId}", `${businessId}`);
		
	return (
		<NextLink 
			className={className} 
			href={`${origin}/${workspaceId}/${formattedHref}`} 
			{...props}
		>
			{children}
		</NextLink>
	);
}
