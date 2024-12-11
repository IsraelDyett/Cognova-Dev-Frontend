"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChatFeedback } from "@prisma/client";
import { addFeedback } from "@/lib/actions/server/chat";
import { ThumbsDown, ThumbsUp } from "lucide-react";

export const FeedbackSection = ({
	chatId,
	currentFeedback,
}: {
	chatId: string;
	currentFeedback: ChatFeedback;
}) => {
	const [inlineCurrentFeedback, setCurrentFeedback] = useState(currentFeedback);
	const addChatFeedback = async (feedback: ChatFeedback) => {
		setCurrentFeedback(feedback);
		const { data, success } = await addFeedback({
			feedback,
			chatId,
		});
	};
	return (
		<div className="sm:flex sm:justify-between">
			<div className="inline-flex border border-gray-200 rounded-full p-0.5">
				<button
					type="button"
					onClick={() => {
						["NONE", "DOWNVOTED"].includes(inlineCurrentFeedback)
							? addChatFeedback("UPVOTED")
							: addChatFeedback("NONE");
					}}
					className={cn(
						inlineCurrentFeedback == "UPVOTED"
							? "text-blue-800 bg-blue-100"
							: "text-gray-500",
						"inline-flex shrink-0 justify-center items-center size-8 rounded-full hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-none",
					)}
				>
					<ThumbsUp className="shrink-0 size-4" />
				</button>
				<button
					type="button"
					onClick={() => {
						["UPVOTED", "NONE"].includes(inlineCurrentFeedback)
							? addChatFeedback("DOWNVOTED")
							: addChatFeedback("NONE");
					}}
					className={cn(
						inlineCurrentFeedback == "DOWNVOTED"
							? "text-blue-800 bg-blue-100"
							: "text-gray-500",
						"inline-flex shrink-0 justify-center items-center size-8 rounded-full hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-none",
					)}
				>
					<ThumbsDown className="shrink-0 size-4" />
				</button>
			</div>
		</div>
	);
};
