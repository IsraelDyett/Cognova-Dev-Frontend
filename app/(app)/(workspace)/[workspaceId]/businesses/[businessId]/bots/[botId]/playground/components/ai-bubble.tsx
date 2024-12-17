"use client";
import React from "react";
import { siteConfig } from "@/lib/site";
import { MdContent } from "./md-content";
import { Button } from "@/components/ui/button";
import { ChatFeedback } from "@prisma/client";
import { ExternalLink, Phone } from "lucide-react";
import LoadingDots from "@/components/ui/loading-dots";
import { FeedbackSection } from "./chat-feedback-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "../store";
import { Skeleton } from "@/components/ui/skeleton";
import { toKebabCase } from "@/lib/utils";

const processMessageContent = (content: string) => {
	const segments: Array<{
		type: "text" | "phone" | "image";
		content: string;
		data?: { text?: string; number?: string };
	}> = [];

	let lastIndex = 0;

	const formatText = (text: string) => {
		return text
			.replace(/(.*)- ([^-]*)$/, "$1$2")
			.replace("[Call Now]", "")
			.trim();
	};

	const regex = /(!?\[([^\]]+)\]\((?:tel:)?([^)]+)\))/g;
	let match;

	while ((match = regex.exec(content)) !== null) {
		const textBefore = content.slice(lastIndex, match.index);
		if (textBefore) {
			// Replace last hyphen with empty string
			const processedText = formatText(textBefore);
			segments.push({ type: "text", content: processedText });
		}

		// Determine if this is an image or phone number
		if (match[0].startsWith("!")) {
			segments.push({
				type: "image",
				content: match[3],
			});
		} else {
			segments.push({
				type: "phone",
				content: match[0],
				data: {
					text: match[2],
					number: match[3],
				},
			});
		}

		lastIndex = match.index + match[0].length;
	}
	const textAfter = content.slice(lastIndex);
	if (textAfter) {
		// Replace last hyphen with empty string
		const processedText = formatText(textAfter);
		segments.push({ type: "text", content: processedText });
	}

	return segments;
};

export const AssistantBubble = ({
	chatId,
	content,
	isLastMessage,
	currentFeedback,
	addToChat,
}: {
	chatId: string;
	content: string;
	isLastMessage: boolean;
	currentFeedback: ChatFeedback;
	addToChat: (userChat: string) => Promise<void>;
}) => {
	const { isLoading, action, suggestions } = useChatStore();
	const segments = processMessageContent(content);
	return (
		<>
			<li className="flex gap-x-2 sm:gap-x-4">
				<Avatar>
					<AvatarImage src={siteConfig.r2.logoUrl} />
					<AvatarFallback>Co</AvatarFallback>
				</Avatar>
				<div className="space-y-3">
					{action && isLastMessage && content.length < 1 && (
						<div className="p-2 bg-transparent animate-pulse">
							<span className="text-sm capitalize bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-black/80 to-black/20">
								{toKebabCase(action).replaceAll("-", " ")}
							</span>
						</div>
					)}
					{isLoading && !action && isLastMessage && content.length < 1 && <LoadingDots />}
					{segments.map((segment, index) => (
						<React.Fragment key={index}>
							{segment.type === "text" && <MdContent content={segment.content} />}
							{segment.type === "phone" && segment.data && (
								<Button
									variant="outline"
									size="sm"
									className="gap-2 my-1"
									onClick={() => window.open(`tel:${segment.data?.number}`)}
								>
									<Phone className="h-3 w-3" />
									{segment.data.text}
								</Button>
							)}
							{segment.type === "image" && (
								<div className="w-full my-2 flex flex-col gap-2 ">
									<div className="aspect-w-16 aspect-h-9 max-w-[500px]">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={segment.content}
											alt="Inline image"
											className="w-full object-cover shadow-md ring-muted ring-2 rounded-xl"
										/>
									</div>
									<a
										href={segment.content}
										className="truncate flex items-center gap-1 text-muted-foreground text-sm w-fit"
										target="_blank"
										rel="noopener noreferrer"
									>
										View whole image
										<ExternalLink className="h-3 w-3" />
									</a>
								</div>
							)}
						</React.Fragment>
					))}
					<FeedbackSection currentFeedback={currentFeedback} chatId={chatId} />
				</div>
			</li>
			{suggestions && suggestions.length > 0 && isLastMessage && !isLoading &&  (
				<li className="gap-2 grid grid-cols-1 sm:grid-cols-3">
					{suggestions.map((q, i) => (
						<button
							key={i}
							onClick={() => {
								addToChat(
									q.replaceAll('"', "").split(".")[1].trim() ||
										q.replaceAll('"', "").trim(),
								);
							}}
							type="button"
							className="p-1 text-start inline-flex justify-center items-center rounded-md border border-primary/40 bg-background text-primary hover:bg-blue-50 focus:outline-none focus:bg-blue-50 text-xs"
						>
							{q.replaceAll('"', "")}
						</button>
					))}
				</li>
			)}
		</>
	);
};
