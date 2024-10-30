import React, { cache, use } from 'react'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { authUser } from '../auth/actions';
import { AuthProvider } from './auth-context';
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"

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
    return (
        <AuthProvider user={user}>
            {children}
        </AuthProvider>
    );
}

export default function layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthWrapper>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            Cognova AI
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Bots</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col p-4 pt-0">
                        <div className="flex-1 rounded-xl px-8 py-4">
                            {children}
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </AuthWrapper>
    )
}
