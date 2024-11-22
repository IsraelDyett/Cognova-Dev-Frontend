import { create } from "zustand";
import { Chat, Conversation } from "@prisma/client";

type State = {
	conversations: (Conversation & { chats: { id: string }[] })[];
	selectedConversation: string | null;
	chats: Chat[];
	setConversations: (conversations: (Conversation & { chats: { id: string }[] })[]) => void;
	setSelectedConversation: (id: string | null) => void;
	setChats: (chats: Chat[]) => void;
};

export const useStore = create<State>((set) => ({
	conversations: [],
	selectedConversation: null,
	chats: [],
	setConversations: (conversations) => set({ conversations }),
	setSelectedConversation: (id) => set({ selectedConversation: id }),
	setChats: (chats) => set({ chats }),
}));
