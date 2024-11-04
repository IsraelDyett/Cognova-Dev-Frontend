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
    isAddDialogOpen: boolean
    setIsAddDialogOpen: (isOpen: boolean) => void
    fetchSources: (botId: string) => Promise<void>
}

export const useSourcesStore = create<SourcesStore>((set) => ({
    sources: [],
    isLoading: true,
    error: null,
    isAddDialogOpen: false,
    setIsAddDialogOpen: (isOpen) => set({ isAddDialogOpen: isOpen }),
    fetchSources: async (botId) => {
        set({ isLoading: true, error: null })
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