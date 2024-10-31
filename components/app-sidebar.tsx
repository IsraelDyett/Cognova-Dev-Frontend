"use client"

import * as React from "react"
import {
  Bot as BotIcon,
  Brain,
  ChartArea,
  ChevronLeft,
  Cog,
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
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getCurrentWorkspace } from "@/lib/utils"
import { getBots } from "@/app/(workspace)/actions"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/app/(workspace)/auth-context"


const data = {
  teams: [
    {
      name: "Cognova AI",
      logo: `https://api.dicebear.com/9.x/initials/svg?seed=${'Cognova+AI'}&backgroundType=gradientLinear,solid&backgroundRotation=-310,-240&fontFamily=Courier%20New&fontWeight=600`,
      plan: "Enterprise",
    },
  ],
  navMain: [
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
          title: "Workspace",
          url: "#",
        },
      ],
    },
  ],
  botMain: [
    {
      title: "Sources",
      url: "{after.uuid}/sources",
      icon: Brain,
    },
    {
      title: "Analytics",
      url: "{after.uuid}/analytics",
      icon: ChartArea,
    },
    {
      title: "Playground",
      url: "{after.uuid}/playground",
      icon: SquareTerminal,
    },
    {
      title: "Customize",
      url: "{after.uuid}/customize",
      icon: Cog,
    }
  ]
}
const slideVariants = {
  enter: {
    x: 50,
    opacity: 0
  },
  center: {
    x: 0,
    opacity: 1
  },
  exit: {
    x: 100,
    opacity: 0
  }
}
const baseSlideVariants = {
  enter: {
    x: -100,
    opacity: 0
  },
  center: {
    x: 0,
    opacity: 1
  },
  exit: {
    x: -100,
    opacity: 0
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const pathname = usePathname()
  const alreadyMounted = React.useRef(false)
  const [navMain, setNavMain] = React.useState<any[]>(data.navMain)
  const [bots, setBots] = React.useState<{ name: string, url: string, icon: any }[]>([])
  const [currentNavbar, setCurrentNavbar] = React.useState<"default" | "bot">("default")

  React.useEffect(() => {
    if (!alreadyMounted.current) {
      const currentWorkspace = getCurrentWorkspace()
      getBots(currentWorkspace).then((bots) => {
        setBots(bots.map((bot) => {
          return {
            name: bot.name,
            url: `/${currentWorkspace}/bots/${bot.id}`,
            icon: BotIcon,
          }
        }))
      })
      setNavMain((c) => {
        return [
          {
            title: "Overview",
            url: `/${currentWorkspace}/`,
            icon: Stars,
            isActive: true
          },
          ...c]
      })
      alreadyMounted.current = true
    }
  }, [])

  React.useEffect(() => {
    const pathParts = pathname.split('/')
    const isBotRoute = pathParts.includes('bots') && pathParts.length > 3

    if (isBotRoute) {
      setCurrentNavbar('bot')
    } else {
      setCurrentNavbar('default')
    }
  }, [pathname])
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        {currentNavbar == "bot" && (
          <Link href={`/${getCurrentWorkspace()}/`} className="space-x-4 group hover:text-muted-foreground flex py-2 text-sm w-full  items-center">
            <ChevronLeft className="h-4 w-4 transition-transform duration-100 hover:-translate-x-0.5" strokeWidth={2} />
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
              variants={baseSlideVariants}
              transition={{ duration: 0.1, type: "tween" }}
            >
              <NavMain items={navMain} />
              <NavBots bots={bots} />
            </motion.div>
          )}
          {currentNavbar == "bot" && (
            <motion.div
              key="bot"
              initial="enter"
              animate="center"
              exit="exit"
              variants={slideVariants}
              transition={{ duration: 0.1, type: "tween" }}
            >
              <NavMain items={data.botMain} />
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  )
}
