import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Conversation } from "@prisma/client";
import { showBrowserIcon, showDeviceIcon, showOsIcon } from "@/components/ui/icons";
import Image from "next/image";

export default function ConversationCard({
	conversation,
	handleConversationClick,
	selectedConversation,
}: {
	handleConversationClick: (id: string) => void;
	selectedConversation: string | null;
	conversation: Conversation & { chats: { id: string }[] };
}) {
	return (
		<Card
			key={conversation.id}
			className={`my-2 cursor-pointer ${selectedConversation === conversation.id ? "bg-secondary" : ""}`}
			onClick={() => handleConversationClick(conversation.id)}
		>
			<CardHeader>
				<CardTitle className="text-sm">
					{new Date(conversation.createdAt).toLocaleString()}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center space-x-2 text-sm text-muted-foreground">
					{conversation.countryCode && (
						<span>
							<Image
								height={16}
								width={16}
								alt="Flag"
								src={`https://flagsapi.com/${conversation.countryCode}/flat/64.png`}
								className="h-4 w-4"
							/>
						</span>
					)}
				</div>
				<div className="mt-2 text-sm">Chats: {conversation.chats.length}</div>
			</CardContent>
		</Card>
	);
}
