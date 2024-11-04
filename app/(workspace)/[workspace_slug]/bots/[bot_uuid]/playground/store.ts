import { create } from 'zustand'

interface Message {
    id: string
    content: string
    role: 'user' | 'bot'
    timestamp: Date
}

interface ChatStore {
    messages: Message[]
    isLoading: boolean
    error: string | null
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => string // returns id
    updateMessage: (id: string, content: string) => void
    setError: (error: string | null) => void
    setIsLoading: (isLoading: boolean) => void
    removeMessage: (id: string) => void
}

export const useChatStore = create<ChatStore>((set) => ({
    messages: [],
    isLoading: false,
    error: null,
    addMessage: (message) => {
        const id = crypto.randomUUID()
        set((state) => ({
            messages: [...state.messages, {
                ...message,
                id,
                timestamp: new Date()
            }]
        }))
        return id
    },
    updateMessage: (id, content) =>
        set((state) => ({
            messages: state.messages.map(message =>
                message.id === id ? { ...message, content } : message
            )
        })),
    removeMessage: (id) =>
        set((state) => ({
            messages: state.messages.filter(message => message.id !== id)
        })),
    setError: (error) => set({ error }),
    setIsLoading: (isLoading) => set({ isLoading }),
}))