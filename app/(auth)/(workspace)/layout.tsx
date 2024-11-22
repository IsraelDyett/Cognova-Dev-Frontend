import React, { cache, use } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { authUser } from "../../(guest)/auth/actions";
import { AuthProvider } from "./contexts/auth-context";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { WorkspaceProvider } from "./contexts/workspace-context";
import Breadcrumbs from "@/components/breadcrumbs";

const cachedUser = cache(async () => {
	const user = await authUser();
	if (user) {
		return user;
	}
	return null;
});

function AuthWrapper({ children }: { children: React.ReactNode }): React.ReactElement {
	const user = use(cachedUser());
	if (!user) {
		return <div>Not authenticated</div>;
	}
	return <AuthProvider user={user}>{children}</AuthProvider>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AuthWrapper>
			<WorkspaceProvider>
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset className="flex flex-col h-[100dvh] overflow-hidden">
						<header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
							<div className="flex items-center gap-2 px-4">
								<SidebarTrigger className="-ml-1" />
								<Separator orientation="vertical" className="h-4 mr-2" />
								<Breadcrumbs/>
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
		</AuthWrapper>
	);
}
