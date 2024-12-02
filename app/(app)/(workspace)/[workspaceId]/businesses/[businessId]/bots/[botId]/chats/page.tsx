"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "@/lib/stores/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatBubbleCard from "./components/chat-bubble-card";
import { useParams, useSearchParams } from "next/navigation";
import ConversationCard from "./components/conversation-card";

export default function ChatsPage() {
	const { botId } = useParams();
	const searchParams = useSearchParams();
	const conversationIdParam = searchParams.get("conversationId");
	const { fetchChats, fetchConversations, conversations, chats } = useChatStore();
	const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

	useEffect(() => {
		fetchConversations(`${botId}`);
	}, [botId, fetchConversations]);

	useEffect(() => {
		if (conversationIdParam) {
			setCurrentConversationId(conversationIdParam);
		}
	}, [conversationIdParam, setCurrentConversationId]);

	useEffect(() => {
		if (currentConversationId) {
			fetchChats(currentConversationId);
		}
	}, [currentConversationId, fetchChats]);

	const handleConversationClick = (id: string) => {
		setCurrentConversationId(id);
		window.history.pushState({}, "", `?conversationId=${id}`);
	};
	return (
		<div className="flex flex-col md:flex-row h-[calc(100dvh-100px)]">
			<div className="w-full md:w-[27%] border-r">
				<ScrollArea className="h-full pr-3">
					{conversations.map((conversation) => (
						<ConversationCard
							key={conversation.id}
							conversation={conversation}
							handleConversationClick={handleConversationClick}
							selectedConversation={currentConversationId}
						/>
					))}
				</ScrollArea>
			</div>
			<div className="w-full md:w-[73%]">
				<ScrollArea className="h-full pl-2 pr-4">
					{chats.map((chat) => (
						<ChatBubbleCard key={chat.id} chat={chat} />
					))}
				</ScrollArea>
			</div>
		</div>
	);
}
