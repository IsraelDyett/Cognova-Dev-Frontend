import { Prisma } from "@prisma/client";
import BaseServerActionActions from "./base";
import { headers } from "next/headers";
import SessionServerActions from "./session";

class ChatServerActions extends BaseServerActionActions {

    public static async getChats({ conversationId }: { conversationId: string }) {
        return this.executeAction(
            () => this.prisma.chat.findMany({
                where: {
                    conversationId: conversationId,
                },
                orderBy: { createdAt: "asc" },
            }),
            "Failed to get chats"
        );
    }
    public static async getConversations({ botId, include = {
        chats: {
            select: { id: true },
        },
    } }: { botId: string, include?: Prisma.ConversationInclude }) {
        return this.executeAction(
            () => this.prisma.conversation.findMany({
                where: {
                    botId: botId,
                },
                orderBy: { updatedAt: "desc" },
                include,
            }),
            "Failed to get chats"
        );
    }

    public static async createConversation({ botId }: { botId: string }) {
        const metadata = SessionServerActions.getUserAgentMetadata();
        const sessionId = await SessionServerActions.getOrCreateHeadlessSessionId();
        return this.executeAction(
            async () => {
                const bot = await this.prisma.bot.findUnique({
                    where: { id: botId },
                });
                if (!bot) {
                    return null;
                }
                return this.prisma.conversation.create({
                    data: {
                        botId,
                        sessionId,
                        ...metadata,
                        countryCode: headers().get("CF-IPCountry") || null,
                    },
                    include: { bot: true },
                })
            },
            "Failed creating conversation"
        )
    }
    public static async retrieveOrCreateConversation({ botId }: { botId: string, }) {
        const sessionId = await SessionServerActions.getOrCreateHeadlessSessionId();
        return this.executeAction(
            async () => {
                const existingConversation = await this.prisma.conversation.findFirst({
                    where: {
                        botId,
                        sessionId,
                    },
                    orderBy: { createdAt: "desc" },
                    include: { bot: true },
                });
                if (existingConversation) {
                    return existingConversation;
                }

                const { data: conversation, success, error } = await this.createConversation({ botId });
                if(!success){
                    throw new Error(error)
                }
                return conversation;
            },
            "Failed retrieving or creating conversation"
        )
    }

}
export default ChatServerActions;
