import { create } from 'zustand'
import { Bot, BotConfiguration } from "@prisma/client"
import { getBot } from '@/app/(workspace)/actions'

export interface cBot extends Bot {
    configurations?: BotConfiguration
}
interface CustomizeStore {
    bot: cBot | null,
    isLoading: boolean
    fetchBot: (botId: string) => Promise<void>
}

export const useCustomizeStore = create<CustomizeStore>((set) => ({
    bot: null,
    isLoading: true,
    fetchBot: async (botId) => {
        set({ isLoading: true})
        try {
            const bot = await getBot(botId)
            // @ts-ignore
            set({ bot, isLoading: false })
        } catch (error) {
            set({ 
                isLoading: false 
            })
        }
    }
}))