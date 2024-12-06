import { toast } from "sonner";
import { create } from "zustand";
import { debug } from "@/lib/utils";
import type { Chat, Conversation } from "@prisma/client";
import { getChats, getConversations } from "@/lib/actions/server/chat";

interface ChatState {
	chats: Chat[];
	error: string | null;
	loading: "chats" | "conversations" | "none" | "initial";
	conversations: (Conversation & { chats: { id: string }[] })[];
	fetchChats: (conversationId: string) => Promise<void>;
	fetchConversations: (chatId: string, silently?: boolean) => Promise<void>;
	set: {
		(
			partial:
				| ChatState
				| Partial<ChatState>
				| ((state: ChatState) => ChatState | Partial<ChatState>),
			replace?: false,
		): void;
		(state: ChatState | ((state: ChatState) => ChatState), replace: true): void;
	};
}

export const useChatStore = create<ChatState>((set) => ({
	chats: [],
	conversations: [],
	loading: "initial",
	error: null,

	fetchChats: async (conversationId: string) => {
		debug("CLIENT", "fetchChats", "STORE");
		set({ loading: "chats", error: null });
		const { data: chats, success, error } = await getChats({ conversationId });
		if (success) {
			set({ chats: chats });
		} else {
			set({ error: error });
			toast.error("Failed to load Chats");
		}
		set({ loading: "none" });
	},

	fetchConversations: async (botId: string, silently?: boolean) => {
		set({ loading: silently ? "none" : "conversations", error: null });
		debug("CLIENT", "fetchConversations", "STORE");
		const { data: conversations, success, error } = await getConversations({ botId });
		if (success) {
			set({ conversations: conversations });
		} else {
			toast.error(error);
		}
		set({ loading: "none" });
	},
	set,
}));
