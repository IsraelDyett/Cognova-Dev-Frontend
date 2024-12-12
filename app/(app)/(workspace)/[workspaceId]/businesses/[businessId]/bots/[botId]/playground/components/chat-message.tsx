"use client";
import React, { useState } from "react";
import { UserBubble } from "./user-bubble";
import { ChatFeedback } from "@prisma/client";
import { AssistantBubble } from "./ai-bubble";

export const ChatMessage = ({
	content,
	role,
	chatId,
	currentFeedback,
	isLatestAssistantMessage,
	addToChat,
}: {
	content: string;
	role: string;
	currentFeedback: ChatFeedback;
	chatId: string;
	addToChat: (userChat: string) => Promise<void>;
	isLatestAssistantMessage: boolean;
}) => {
	return (
		<>
			{role === "assistant" ? (
				<AssistantBubble
					content={content}
					isLastMessage={isLatestAssistantMessage}
					chatId={chatId}
					addToChat={addToChat}
					currentFeedback={currentFeedback}
				/>
			) : (
				<UserBubble content={content} />
			)}
		</>
	);
};
