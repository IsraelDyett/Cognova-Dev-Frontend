"use client";
import { cn } from "@/lib/utils";
import { useChatStore } from "./store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useRef, useEffect } from "react";
import LoadingDots from "@/components/ui/loading-dots";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { handlePrompt, streamChat } from "./actions";
import { Send, AlertCircle, Bot, Loader2, ExternalLink, Phone } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WorkspacePageProps } from "@/types";
import { MemoizedReactMarkdown } from "@/components/ui/markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import ShareButton from "@/components/share-button";
import { siteConfig } from "@/lib/site";
import Logo from "@/components/logo";

const processMessageContent = (content: string) => {
	// Split content into segments that preserve order
	const segments: Array<{
		type: "text" | "phone" | "image";
		content: string;
		data?: { text?: string; number?: string };
	}> = [];

	let lastIndex = 0;

	// Find all special content (images and phone numbers) while preserving order
	const regex = /(!?\[([^\]]+)\]\((?:tel:)?([^)]+)\))/g;
	let match;

	while ((match = regex.exec(content)) !== null) {
		// Add any text before this match
		const textBefore = content.slice(lastIndex, match.index);
		if (textBefore) {
			segments.push({ type: "text", content: textBefore });
		}

		// Determine if this is an image or phone number
		if (match[0].startsWith("!")) {
			segments.push({
				type: "image",
				content: match[3], // the URL
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

	// Add any remaining text
	const textAfter = content.slice(lastIndex);
	if (textAfter) {
		segments.push({ type: "text", content: textAfter });
	}

	return segments;
};

const ChatMessage = ({
	content,
	role,
	isLatestAssistantMessage,
	isLoading,
}: {
	content: string;
	role: string;
	isLatestAssistantMessage: boolean;
	isLoading: boolean;
}) => {
	const segments = processMessageContent(content);

	return (
		<div
			className={cn(
				"flex gap-3",
				role === "assistant"
					? "justify-start max-w-[80%]"
					: "justify-end ml-auto max-w-[80%]",
			)}
		>
			{role === "assistant" && (
				<Avatar>
					<AvatarImage src={siteConfig.r2.logoUrl} />
					<AvatarFallback>
						<Bot className="w-5 h-5" />
					</AvatarFallback>
				</Avatar>
			)}

			<div className="flex flex-col">
				<div
					className={cn(
						"rounded-lg px-4 py-2 text-sm h-fit",
						role === "assistant"
							? "bg-secondary"
							: "bg-primary text-primary-foreground",
					)}
				>
					{segments.map((segment, index) => (
						<React.Fragment key={index}>
							{segment.type === "text" && (
								<MemoizedReactMarkdown
									className="prose break-words prose-p:leading-relaxed prose-pre:p-0 [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1 [&_a]:rounded-md [&_a]:bg-secondary [&_a]:px-2 [&_a]:py-1 [&_a]:text-xs [&_a]:no-underline hover:[&_a]:bg-secondary/80"
									remarkPlugins={[remarkGfm, remarkMath]}
									components={{
										p({ children }) {
											return <p className="mb-2 last:mb-0">{children}</p>;
										},
										a(props) {
											if (props.href?.startsWith("tel:")) return null;
											return (
												<a
													href={props.href}
													className="truncate"
													target="_blank"
													rel="noopener noreferrer"
												>
													{props.children}
													<ExternalLink className="h-3 w-3" />
												</a>
											);
										},
										img() {
											return null;
										},
									}}
								>
									{segment.content.replace(/- \*\*Phone:\*\*/, "")}
								</MemoizedReactMarkdown>
							)}
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
								<div className="w-full my-2 flex flex-col gap-2">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={segment.content}
										alt="Inline image"
										className="w-full aspect-[16/9] rounded-md shadow-md object-cover"
									/>
									<a
										href={segment.content}
										className="truncate flex items-center gap-1 text-primary w-fit"
										target="_blank"
										rel="noopener noreferrer"
									>
										View image
										<ExternalLink className="h-3 w-3" />
									</a>
								</div>
							)}
						</React.Fragment>
					))}

					{/* Loading indicator */}
					{role === "assistant" && isLoading && isLatestAssistantMessage && (
						<LoadingDots />
					)}
				</div>
			</div>
		</div>
	);
};

export default function PlaygroundPage(
	props: WorkspacePageProps & { share?: boolean; isolate?: boolean },
) {
	const botId = props.params.botId;
	const inputRef = useRef<HTMLInputElement>(null);
	const chatsEndRef = useRef<HTMLDivElement>(null);

	const {
		bot,
		chats,
		isLoading,
		error,
		addChat,
		updateChat,
		removeChat,
		setError,
		setIsLoading,
		currentConversationId,
		initializeConversation,
	} = useChatStore();

	useEffect(() => {
		chatsEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chats]);

	const initialChatRetrieved = React.useRef(false);
	useEffect(() => {
		if (!initialChatRetrieved.current) {
			initializeConversation(botId);
			initialChatRetrieved.current = true;
		}
	}, [botId, initializeConversation]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputRef.current?.value.trim() || isLoading) return;

		const userChat = inputRef.current.value;
		inputRef.current.value = "";

		addChat({
			content: userChat,
			role: "user",
		});

		const botChatId = addChat({
			content: "",
			role: "assistant",
		});

		setIsLoading(true);
		setError(null);

		try {
			if (currentConversationId) {
				const response = await handlePrompt({
					botId,
					chat: userChat,
					conversationId: currentConversationId,
				});
				const reader = response.body?.getReader();

				if (!reader) {
					throw new Error("No response body");
				}
				await streamChat({
					reader: reader,
					botChatId: botChatId,
					updateChat: updateChat,
					onFinish: () => {
						setIsLoading(false);
					},
				});
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to get response");
			removeChat(botChatId);
		}
	};

	return (
		<div
			className={`flex-1 flex ${props.searchParams["embed"] || props.isolate ? "pb-0" : "md:[&_div]:max-h-[calc(100dvh-80px)]"} h-[100dvh] md:items-center md:justify-center`}
		>
			<Card className="max-w-3xl w-full overflow-hidden mx-auto h-full">
				<CardContent className="flex flex-col h-full p-0 w-full">
					<ScrollArea className="px-3 pb-4 sm:px-2">
						{error && (
							<Alert variant="destructive" className="my-4">
								<AlertCircle className="w-4 h-4" />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="py-2 space-y-4">
							{chats.map((chat) => (
								<ChatMessage
									key={chat.id}
									content={chat.content}
									role={chat.role}
									isLatestAssistantMessage={
										chats[chats.length - 1].id === chat.id
									}
									isLoading={isLoading}
								/>
							))}
							<div ref={chatsEndRef} />
						</div>
					</ScrollArea>

					{/* Input form */}
					<div className="px-3 pt-3 pb-2 mt-auto border-t">
						<form onSubmit={handleSubmit} className="flex gap-2">
							<Input
								ref={inputRef}
								disabled={isLoading || !currentConversationId}
								className="flex-grow"
								placeholder="Ask me anything..."
							/>
							<Button type="submit" disabled={isLoading || !currentConversationId}>
								{isLoading ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Send className="w-4 h-4" />
								)}
							</Button>
						</form>
					</div>
					{props.share && (
						<div className="px-3 pt-3 pb-2">
							{/* @ts-ignore */}
							<ShareButton bot={bot} disabled={isLoading || !currentConversationId} />
						</div>
					)}
					{/* Footer components */}
					{props.searchParams["embed"] && (
						<div className="w-full py-2 text-muted-foreground flex justify-center items-center text-center text-sm font-normal">
							Powered by
							<div className="pl-1 flex items-center">
								<Logo size="xxs" />
								<a
									className="underline text-foreground font-medium pl-1 underline-offset-2"
									href={siteConfig.domains.root}
								>
									{siteConfig.applicationName}
								</a>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
