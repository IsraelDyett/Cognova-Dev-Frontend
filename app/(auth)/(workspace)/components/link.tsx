import { useWorkspace } from "@/app/(auth)/(workspace)/contexts/workspace-context";
import NextLink, { LinkProps } from "next/link";
import { PropsWithChildren } from "react";

interface WorkspaceLinkProps extends Omit<LinkProps, "href"> {
	href: string;
}

export function WorkspaceLink({ href, children, ...props }: PropsWithChildren<WorkspaceLinkProps>) {
	const { workspace } = useWorkspace();
	const cleanedHref = href.startsWith("/") ? href.slice(1) : href;
	return (
		<NextLink href={`/${workspace?.name}/${cleanedHref}`} {...props}>
			{children}
		</NextLink>
	);
}
