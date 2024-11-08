"use client";

import * as React from "react";
import { ChevronLeft, Stars } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavBots } from "@/components/nav-bots";
import { NavUser } from "@/components/nav-user";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import Link from "next/link";
import { sidebarData } from "./sidebar-store";
import { useParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { botId, workspaceId } = useParams();
  const [currentNavbar, setCurrentNavbar] = React.useState<"default" | "bot">("default");
  const [mainNavigationMenus, setNavigationMenus] = React.useState<any[]>(
    sidebarData.mainNavigationMenus,
  );

  const alreadyMounted = React.useRef(false);
  React.useEffect(() => {
    if (!alreadyMounted.current && workspaceId) {
      setNavigationMenus((remainedMenus) => {
        return [
          {
            title: "Overview",
            url: `/${workspaceId}/`,
            icon: Stars,
            isActive: true,
          },
          ...remainedMenus,
        ];
      });
      alreadyMounted.current = true;
    }
  }, []);

  React.useEffect(() => {
    if (botId) {
      setCurrentNavbar("bot");
    } else {
      setCurrentNavbar("default");
    }
  }, [pathname]);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher />
        {currentNavbar == "bot" && (
          <Link
            href={`/${workspaceId}/`}
            className="space-x-4 group hover:text-muted-foreground flex py-2 text-sm w-full  items-center"
          >
            <ChevronLeft
              className="h-4 w-4 transition-transform duration-100 hover:-translate-x-0.5"
              strokeWidth={2}
            />
            Bot
          </Link>
        )}
      </SidebarHeader>
      <SidebarContent>
        <AnimatePresence mode="wait">
          {currentNavbar == "default" && (
            <motion.div
              key="default"
              initial="enter"
              animate="center"
              exit="exit"
              variants={sidebarData.baseSlideVariants}
              transition={{ duration: 0.1, type: "tween" }}
            >
              <NavMain items={mainNavigationMenus} />
              <NavBots workspaceId={`${workspaceId}`} />
            </motion.div>
          )}
          {currentNavbar == "bot" && (
            <motion.div
              key="bot"
              initial="enter"
              animate="center"
              exit="exit"
              variants={sidebarData.slideVariants}
              transition={{ duration: 0.1, type: "tween" }}
            >
              <NavMain items={sidebarData.botNavigationMenus} />
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
