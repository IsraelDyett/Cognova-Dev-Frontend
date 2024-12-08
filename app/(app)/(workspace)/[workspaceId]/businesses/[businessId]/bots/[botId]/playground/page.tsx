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
import { Send, AlertCircle, Bot, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { WorkspacePageProps } from "@/types";
import { MemoizedReactMarkdown } from "@/components/ui/markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import ShareButton from "@/components/share-button";
import { siteConfig } from "@/lib/site";
import Logo from "@/components/logo";

export default function PlaygroundPage(props: WorkspacePageProps & { share?: boolean }) {
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
				});
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to get response");
			removeChat(botChatId);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div
			className={`flex-1 flex ${props.searchParams["embed"] || props.searchParams["chat"] || props.share ? "h-[100dvh]" : "h-[calc(100dvh-100px)]"} md:items-center  md:justify-center`}
		>
			<Card className={`max-w-2xl w-full overflow-hidden mx-auto h-full`}>
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
							{chats.filter((chat) => chat.content.length > 0).map((chat) => (
								<div
									key={chat.id}
									className={cn(
										"flex gap-3",
										chat.role === "assistant"
											? "justify-start max-w-[80%]"
											: "justify-end ml-auto max-w-[80%]",
									)}
								>
									{chat.role === "assistant" && (
										<Avatar>
											<AvatarFallback>
												<Bot className="w-5 h-5" />
											</AvatarFallback>
										</Avatar>
									)}

									<div className="flex flex-col">
										<div
											className={cn(
												"rounded-lg px-4 py-2 text-sm h-fit",
												chat.role === "assistant"
													? "bg-secondary"
													: "bg-primary text-primary-foreground",
											)}
										>
											{(chat.content && (
												<MemoizedReactMarkdown
													className="prose break-words prose-p:leading-relaxed prose-pre:p-0"
													remarkPlugins={[remarkGfm, remarkMath]}
													components={{
														p({ children }) {
															return (
																<p className="mb-2 last:mb-0">
																	{children}
																</p>
															);
														},
													}}
												>
													{chat.content}
												</MemoizedReactMarkdown>
											)) ||
												(chat.role === "assistant" && isLoading && (
													<LoadingDots />
												))}
										</div>
									</div>
								</div>
							))}
							<div ref={chatsEndRef} />
						</div>
					</ScrollArea>
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
					{props.share && (
						<div className="px-3 pt-3 pb-2">
							{/* @ts-ignore */}
							<ShareButton bot={bot} disabled={isLoading || !currentConversationId} />
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
