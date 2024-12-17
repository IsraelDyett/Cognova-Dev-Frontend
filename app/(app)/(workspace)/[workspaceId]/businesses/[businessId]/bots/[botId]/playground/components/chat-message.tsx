"use client";
import React, { useState } from "react";
import { UserBubble } from "./user-bubble";
import { ChatFeedback } from "@prisma/client";
import { AssistantBubble } from "./ai-bubble";
import { motion } from "framer-motion";

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
		<motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} data-role={role}>
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
		</motion.div>
	);
};
