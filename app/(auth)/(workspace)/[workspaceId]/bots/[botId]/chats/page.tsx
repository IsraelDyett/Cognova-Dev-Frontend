"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useStore } from "./store";
import { getConversations } from "./actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getChats } from "@/app/(auth)/(workspace)/actions";
import ChatBubbleCard from "./components/chat-bubble-card";
import ConversationCard from "./components/conversation-card";


export default function ChatsPage() {
	const searchParams = useSearchParams();
	const convId = searchParams.get("convId");
	const { botId } = useParams();
	const {
		conversations,
		selectedConversation,
		chats,
		setConversations,
		setSelectedConversation,
		setChats,
	} = useStore();

	useEffect(() => {
		const fetchConversations = async () => {
			const fetchedConversations = await getConversations({ botId: `${botId}` });
			setConversations(fetchedConversations);
		};
		fetchConversations();
	}, [setConversations]);

	useEffect(() => {
		if (convId) {
			setSelectedConversation(convId);
		}
	}, [convId, setSelectedConversation]);

	useEffect(() => {
		const fetchChats = async () => {
			if (selectedConversation) {
				const fetchedChats = await getChats(selectedConversation);
				setChats(fetchedChats);
			}
		};
		fetchChats();
	}, [selectedConversation, setChats]);

	const handleConversationClick = (id: string) => {
		setSelectedConversation(id);
		window.history.pushState({}, "", `?convId=${id}`);
	};
	return (
		<div className="flex flex-col md:flex-row h-[calc(100dvh-100px)]">
			<div className="w-full md:w-[27%] border-r">
				<ScrollArea className="h-full pr-3">
					{conversations.map((conversation) => (
						<ConversationCard key={conversation.id} conversation={conversation} handleConversationClick={handleConversationClick} selectedConversation={selectedConversation} />
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
