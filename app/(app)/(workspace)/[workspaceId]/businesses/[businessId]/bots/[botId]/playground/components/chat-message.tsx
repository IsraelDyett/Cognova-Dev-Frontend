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
	isLoading,
}: {
	content: string;
	role: string;
	currentFeedback: ChatFeedback;
	chatId: string;
	isLatestAssistantMessage: boolean;
	isLoading: boolean;
}) => {
	return (
		<>
			{role === "assistant" ? (
				<AssistantBubble
					content={content}
					isLoading={isLoading}
					isLastMessage={isLatestAssistantMessage}
					chatId={chatId}
					currentFeedback={currentFeedback}
				/>
			) : (
				<UserBubble content={content} />
			)}
		</>
	);
};
