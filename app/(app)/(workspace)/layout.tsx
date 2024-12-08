import React from "react";
import Breadcrumbs from "@/components/breadcrumbs";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { AuthProvider } from "../contexts/auth-context";
import AuthServerActions, { signOut } from "@/lib/actions/server/auth";
import { WorkspaceProvider } from "../contexts/workspace-context";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { siteConfig } from "@/lib/site";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
	const { data: user, success } = await AuthServerActions.authUser();
	if (!success) return redirect(siteConfig.domains.app + "/auth/sign-out");
	return (
		<AuthProvider user={user}>
			<WorkspaceProvider>
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset className="flex flex-col h-[100dvh] overflow-hidden">
						<header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
							<div className="flex items-center gap-2 px-4">
								<SidebarTrigger className="-ml-1" />
								<Separator orientation="vertical" className="h-4 mr-2" />
								<Breadcrumbs />
							</div>
						</header>
						<main
							style={{ WebkitOverflowScrolling: "touch" }}
							className="flex-1 overflow-y-auto"
						>
							<div className="container p-4">{children}</div>
						</main>
					</SidebarInset>
				</SidebarProvider>
			</WorkspaceProvider>
		</AuthProvider>
	);
}
