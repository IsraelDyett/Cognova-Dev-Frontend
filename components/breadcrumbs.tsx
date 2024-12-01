"use client";
import React from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams, usePathname } from "next/navigation";
import { useWorkspace } from "@/app/(app)/contexts/workspace-context";

export default function Breadcrumbs() {
	const pathName = usePathname();
	const { workspaceId } = useParams();
	const { workspace } = useWorkspace();
	const paths = pathName.split("/").filter((path) => path !== "");

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem className="md:block">
					<BreadcrumbLink href={"/" + workspaceId} className="capitalize">
						{workspace?.displayName || workspaceId}
					</BreadcrumbLink>
				</BreadcrumbItem>
				{paths.length === 1 ? (
					<>
						<BreadcrumbSeparator className="md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage className="capitalize">Home</BreadcrumbPage>
						</BreadcrumbItem>
					</>
				) : (
					paths.slice(1).map((path, index) => (
						<React.Fragment key={index}>
							<BreadcrumbSeparator className="md:block" />
							<BreadcrumbItem className="md:block">
								{index !== paths.length - 2 ? (
									<BreadcrumbLink
										href={`/${paths.slice(0, index + 2).join("/")}`}
										className="capitalize"
									>
										{path}
									</BreadcrumbLink>
								) : (
									<BreadcrumbPage className="capitalize">{path}</BreadcrumbPage>
								)}
							</BreadcrumbItem>
						</React.Fragment>
					))
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
