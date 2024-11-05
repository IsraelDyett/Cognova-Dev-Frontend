import { create } from 'zustand'
import { Source, Sync, Technique } from '@prisma/client'
import { getSourcesByBot } from '../actions'

type SourceWithExtra = Source & {
    syncs?: Sync[]
    technique?: Technique
}

interface SourcesStore {
    sources: SourceWithExtra[]
    isLoading: boolean
    error: string | null
    fetchSources: (botId: string, quiet?: boolean) => Promise<void>
}

export const useSourcesStore = create<SourcesStore>((set) => ({
    sources: [],
    isLoading: true,
    error: null,
    fetchSources: async (botId, quiet) => {
        let state: any = {
            isLoading: true,
            error: null
        }
        if (quiet) {
            state = {
                error: null
            }
        }
        set(state)
        try {
            const sources = await getSourcesByBot(botId)
            // @ts-ignore
            set({ sources, isLoading: false })
        } catch (error) {
            set({
                error: 'Failed to load sources. Please try again.',
                isLoading: false
            })
        }
    }
}))