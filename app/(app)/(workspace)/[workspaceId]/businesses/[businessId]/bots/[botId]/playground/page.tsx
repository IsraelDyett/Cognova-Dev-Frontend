"use client";
import autosize from "autosize";
import { useChatStore } from "./store";
import { WorkspacePageProps } from "@/types";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { handlePrompt, streamChat } from "./actions";
import { ChatMessage } from "./components/chat-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Chat } from "@prisma/client";

export default function PlaygroundScreen(props: WorkspacePageProps & { isolate?: boolean }) {
	const botId = props.params.botId;
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const chatsEndRef = useRef<HTMLLIElement>(null);

	const {
		chats,
		isLoading,
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
		if (!textareaRef.current?.value.trim() || isLoading) return;

		const userChat = textareaRef.current.value;
		textareaRef.current.value = "";

		addChat({ content: userChat, role: "user" } as Chat);

		const botChatId = addChat({ content: "", role: "assistant" } as Chat);

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
	useEffect(() => {
		if (textareaRef.current) {
			autosize(textareaRef.current);
		}
	}, []);
	return (
		<div className="flex-1 font-geist-sans  h-[100dvh]">
			<div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
				<ScrollArea>
					<ul className="space-y-5 pr-4 h-[calc(100dvh-150px)] pt-4">
						{chats.map((chat) => (
							<ChatMessage
								chatId={chat.id}
								key={chat.id}
								currentFeedback={chat.feedback}
								content={chat.content}
								role={chat.role}
								isLatestAssistantMessage={chats[chats.length - 1].id === chat.id}
								isLoading={isLoading}
							/>
						))}
						<li ref={chatsEndRef} />
					</ul>
				</ScrollArea>
				<div className="w-full bg-background pt-2 pb-4">
					<div className="flex justify-end items-center mb-3">
						{isLoading && (
							<button
								type="button"
								className="py-1.5 px-2 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
							>
								<svg
									className="size-3"
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 16 16"
								>
									<path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z" />
								</svg>
								Stop generating
							</button>
						)}
					</div>
					<form onSubmit={handleSubmit} className="flex  relative">
						<Textarea
							ref={textareaRef}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									handleSubmit(e);
								}
							}}
							placeholder="Ask me anything..."
							disabled={isLoading || !currentConversationId}
							className="p-4 block w-full max-h-[300px] overflow-hidden resize-none"
						/>
						<div className="flex justify-end items-center absolute bottom-px inset-x-px p-1">
							<Button
								type="submit"
								disabled={isLoading || !currentConversationId}
								size={"icon"}
							>
								{isLoading ? <Loader2 className="animate-spin" /> : <ArrowUp />}
							</Button>
						</div>
					</form>
				</div>
			</div>
			<footer className="w-full py-2 text-muted-foreground flex justify-center items-center text-center text-xs font-normal">
				Cognova AI can make mistakes. Check important info.
			</footer>
		</div>
	);
}
