import { toast } from "sonner";
import { create } from "zustand";
import { Bot, Chat } from "@prisma/client";
import { debug, createCuid } from "@/lib/utils";
import { getChats, retrieveOrCreateConversation } from "@/lib/actions/server/chat";

interface ChatStore {
	chats: Chat[];
	bot: Bot | null;
	action: "checking-inventory" | null;
	suggestions: string[] | null;
	isLoading: boolean;
	currentConversationId: string | null;
	initializeConversation: (botId: string) => Promise<void>;
	addChat: (chat: Omit<Chat, "id" | "timestamp">) => string; // returns id
	updateChat: (id: string, content: string) => void;
	setSuggestions: (suggestions: string[]) => void;
	setIsLoading: (isLoading: boolean) => void;
	setAction: (action: any) => void;
	removeChat: (id: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
	chats: [],
	isLoading: false,
	currentConversationId: null,
	bot: null,
	action: null,
	suggestions: null,
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
	updateChat: (id, content) =>
		set((state) => ({
			chats: state.chats.map((chat) => (chat.id === id ? { ...chat, content } : chat)),
		})),
	removeChat: (id) =>
		set((state) => ({
			chats: state.chats.filter((chat) => chat.id !== id),
		})),
	setIsLoading: (isLoading) => set({ isLoading }),
	setAction: (action) => set({ action }),
	setSuggestions: (suggestions) => set({ suggestions }),
}));
