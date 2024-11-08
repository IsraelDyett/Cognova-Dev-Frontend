import { Bot, BotSources, Source } from '@prisma/client'
import { create } from 'zustand'

type BotSourceWithBots = BotSources & {
    bot: Bot
}
interface SourceWithBots extends Source {
    bots: BotSourceWithBots[]
}

interface SourceBotsState {
    sources: SourceWithBots[]
    workspaceBots: Bot[]
    isLoading: boolean
    error: string | null
    setSources: (sources?: SourceWithBots[]) => void
    setWorkspaceBots: (workspaceBots?: Bot[]) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

export const useSourceBots = create<SourceBotsState>((set) => ({
    sources: [],
    workspaceBots: [],
    isLoading: false,
    error: null,
    setSources: (sources) => set({ sources }),
    setWorkspaceBots: (workspaceBots) => set({ workspaceBots }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
}))