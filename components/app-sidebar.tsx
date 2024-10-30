"use client"

import * as React from "react"
import {
  Bot as BotIcon,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
  Stars,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavBots } from "@/components/nav-bots"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/app/(organization)/auth-context"
import { getBots } from "@/app/(organization)/actions"
import { Bot } from "@prisma/client"
import { getOrgSlug } from "@/lib/utils"

const data = {
  teams: [
    {
      name: "Cognova AI",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: `/${getOrgSlug()}/`,
      icon: Stars,
      isActive: true
    },
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Organization",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const [bots, setBots] = React.useState<{ name: string, url: string, icon: any }[]>([])
  React.useEffect(() => {
    const orgSlug = getOrgSlug()
    getBots(orgSlug).then((bots) => {
      setBots(bots.map((bot) => {
        return {
          name: bot.name,
          url: `/${orgSlug}/bots/${bot.id}`,
          icon: BotIcon,
        }
      }))
    })
  }, [])
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavBots bots={bots} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
