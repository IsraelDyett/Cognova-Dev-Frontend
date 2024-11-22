"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "./store";
import { getConversations } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FiMonitor, FiSmartphone, FiTablet } from "react-icons/fi";
import { FaWindows, FaApple, FaLinux, FaAndroid } from "react-icons/fa";
import {
	SiGooglechrome,
	SiFirefox,
	SiSafari,
	SiOpera,
	SiMicrosoftedge,
	SiApple,
	SiInstagram,
} from "react-icons/si";
import { ThumbsUp, ThumbsDown, Globe } from "lucide-react";
import { getChats } from "@/app/(auth)/(workspace)/actions";
import { MemoizedReactMarkdown } from "@/components/ui/markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export default function ChatsPage() {
	const searchParams = useSearchParams();
	const convId = searchParams.get("convId");
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
			const fetchedConversations = await getConversations();
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
	const showBrowserIcon = (browser?: string | null) => {
		let icon;
		if (browser?.toLowerCase().includes("chrome")) {
			icon = <SiGooglechrome className="inline mr-2" />;
		} else if (browser?.toLowerCase().includes("firefox")) {
			icon = <SiFirefox className="inline mr-2" />;
		} else if (browser?.toLowerCase().includes("safari")) {
			icon = <SiSafari className="inline mr-2" />;
		} else if (browser?.toLowerCase().includes("opera")) {
			icon = <SiOpera className="inline mr-2" />;
		} else if (browser?.toLowerCase().includes("instagram")) {
			icon = <SiInstagram className="inline mr-2" />;
		} else if (browser?.toLowerCase().includes("edge")) {
			icon = <SiMicrosoftedge className="inline mr-2" />;
		}
		return (
			<div>
				{icon}
				{browser}
			</div>
		);
	};
	const showOsIcon = (os?: string | null) => {
		let icon;
		if (os?.toLowerCase().includes("windows")) {
			icon = <FaWindows className="inline mr-2" />;
		} else if (os?.toLowerCase().includes("mac")) {
			icon = <FaApple className="inline mr-2" />;
		} else if (os?.toLowerCase().includes("linux")) {
			icon = <FaLinux className="inline mr-2" />;
		} else if (os?.toLowerCase().includes("ios")) {
			icon = <SiApple className="inline mr-2" />;
		} else if (os?.toLowerCase().includes("android")) {
			icon = <FaAndroid className="inline mr-2" />;
		}
		return (
			<div>
				{icon}
				{os}
			</div>
		);
	};
	const showDeviceIcon = (device?: string | null) => {
		let icon;
		if (device?.toLowerCase().includes("mobile")) {
			icon = <FiSmartphone className="inline mr-2" />;
		} else if (device?.toLowerCase().includes("tablet")) {
			icon = <FiTablet className="inline mr-2" />;
		} else {
			icon = <FiMonitor className="inline mr-2" />;
		}
		return (
			<div>
				{icon}
				{device}
			</div>
		);
	};

	return (
		<div className="flex flex-col md:flex-row h-[calc(100dvh-100px)]">
			<div className="w-full md:w-[27%] border-r">
				<ScrollArea className="h-full pr-3">
					{conversations.map((conversation) => (
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
									{conversation.browser && (
										<span>{showBrowserIcon(conversation.browser)}</span>
									)}
									{conversation.os && <span>{showOsIcon(conversation.os)}</span>}
									{conversation.device && (
										<span>{showDeviceIcon(conversation.device)}</span>
									)}
									{conversation.countryCode && (
										<span>
											<img
												src={`https://flagsapi.com/${conversation.countryCode}/flat/64.png`}
												className="h-4 w-4"
											/>
										</span>
									)}
								</div>
								<div className="mt-2 text-sm">
									Chats: {conversation.chats.length}
								</div>
							</CardContent>
						</Card>
					))}
				</ScrollArea>
			</div>
			<div className="w-full md:w-[73%]">
				<ScrollArea className="h-full pl-2 pr-4">
					{chats.map((chat) => (
						<Card
							key={chat.id}
							className={`${chat.role === "assistant" ? "bg-secondary justify-start" : "bg-primary text-primary-foreground justify-end ml-auto"} my-2 max-w-[80%]`}
						>
							<CardHeader>
								<CardTitle className="text-sm flex justify-between">
									<span className="font-medium capitalize">{chat.role}</span>
									<span>{new Date(chat.createdAt).toLocaleString()}</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<MemoizedReactMarkdown
									className="prose break-words prose-p:leading-relaxed prose-pre:p-0"
									remarkPlugins={[remarkGfm, remarkMath]}
									components={{
										p({ children }) {
											return <p className="mb-2 last:mb-0">{children}</p>;
										},
									}}
								>
									{chat.content}
								</MemoizedReactMarkdown>
								{chat.role == "assistant" && (
									<div className="mt-2 flex items-center space-x-2">
										<ThumbsUp
											className={`h-4 w-4 ${chat.feedback === "UPVOTED" ? "text-green-500" : "text-gray-500"}`}
										/>
										<ThumbsDown
											className={`h-4 w-4 ${chat.feedback === "DOWNVOTED" ? "text-red-500" : "text-gray-500"}`}
										/>
									</div>
								)}
								{chat.sourceURLs.length > 0 && (
									<div className="mt-2">
										<strong>Sources:</strong>
										<ul className="list-disc list-inside">
											{chat.sourceURLs.map((url, index) => (
												<li
													key={index}
													className="text-sm text-blue-500 hover:underline"
												>
													<a
														href={url}
														target="_blank"
														rel="noopener noreferrer"
													>
														{url}
													</a>
												</li>
											))}
										</ul>
									</div>
								)}
							</CardContent>
						</Card>
					))}
				</ScrollArea>
			</div>
		</div>
	);
}
