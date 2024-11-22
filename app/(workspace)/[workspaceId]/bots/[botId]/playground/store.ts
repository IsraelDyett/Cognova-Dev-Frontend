import { getChats, getOrCreateConversation } from "@/app/(workspace)/actions";
import { debug } from "@/lib/utils";
import { createCuid } from "@/lib/actions/server/session";
import { Bot, ChatFeedback } from "@prisma/client";
import { toast } from "sonner";
import { create } from "zustand";

interface Chat {
  id: string;
  conversationId?: string;
  role: "user" | "assistant";
  content: string;
  tokens?: number;
  feedback?: ChatFeedback;
  sourceURLs?: string[];
  questionSuggestions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
interface ChatStore {
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
  bot: Bot | null;
  currentConversationId: string | null;
  initializeConversation: (botId: string) => Promise<void>;
  addChat: (chat: Omit<Chat, "id" | "timestamp">) => string; // returns id
  updateChat: (
    id: string,
    content: string,
    sourceUrls?: string[],
    questionSuggestions?: string[],
  ) => void;
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
    debug("[STORE] {USE-CHAT-STORE} INITIALIZE CONVERSATION");
    const conversation = await getOrCreateConversation(botId);
    console.log("Conv", conversation);
    if (!conversation) {
      toast.error("You're accessing the invalid chatbot");
      return;
    }
    set({ currentConversationId: conversation.id });
    const dbChats = await getChats(conversation.id);
    // @ts-ignore
    set({ chats: dbChats, bot: conversation.bot });
  },
  addChat: (chat) => {
    debug("[STORE] {USE-CHAT-STORE} ADD-MESSAGE");
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
  updateChat: (id, content, sourceURLs, questionSuggestions) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === id ? { ...chat, content, sourceURLs, questionSuggestions } : chat,
      ),
    })),
  removeChat: (id) =>
    set((state) => ({
      chats: state.chats.filter((chat) => chat.id !== id),
    })),
  setError: (error) => set({ error }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
