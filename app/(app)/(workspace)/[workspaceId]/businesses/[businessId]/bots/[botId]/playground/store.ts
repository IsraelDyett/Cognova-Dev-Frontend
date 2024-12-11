import { debug } from "@/lib/utils";
import { createCuid } from "@/lib/actions/server/session";
import { Bot, Chat, ChatFeedback } from "@prisma/client";
import { toast } from "sonner";
import { create } from "zustand";
import { getChats, retrieveOrCreateConversation } from "@/lib/actions/server/chat";

interface ChatStore {
	chats: Chat[];
	isLoading: boolean;
	error: string | null;
	bot: Bot | null;
	currentConversationId: string | null;
	initializeConversation: (botId: string) => Promise<void>;
	addChat: (chat: Omit<Chat, "id" | "timestamp">) => string; // returns id
	updateChat: (id: string, content: string, questionSuggestions?: string[]) => void;
	setError: (error: string | null) => void;
	setIsLoading: (isLoading: boolean) => void;
	removeChat: (id: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
	chats: [],
	isLoading: false,
	error: null,
	currentConversationId: null,
	bot: null,
	initializeConversation: async (botId: string) => {
		debug("CLIENT", "initializeConversation", "STORE");
		const { data: conversation } = await retrieveOrCreateConversation({ botId });
		if (!conversation) {
			toast.error("You're accessing the invalid bot");
			return;
		}
		set({ currentConversationId: conversation.id });
		const { data: chats } = await getChats({ conversationId: conversation.id });
		set({ chats: chats, bot: conversation.bot });
	},
	addChat: (chat) => {
		debug("CLIENT", "addChat", "STORE");
		const id = createCuid();
		set((state) => ({
			chats: [
				...state.chats,
				{
					...chat,
					id,
					timestamp: new Date(),
				},
			],
		}));
		return id;
	},
	updateChat: (id, content, questionSuggestions) =>
		set((state) => ({
			chats: state.chats.map((chat) =>
				chat.id === id ? { ...chat, content, questionSuggestions } : chat,
			),
		})),
	removeChat: (id) =>
		set((state) => ({
			chats: state.chats.filter((chat) => chat.id !== id),
		})),
	setError: (error) => set({ error }),
	setIsLoading: (isLoading) => set({ isLoading }),
}));
