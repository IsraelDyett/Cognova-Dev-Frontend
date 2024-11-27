import React from "react";
import { useForm } from "react-hook-form";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { WorkspacePageProps } from "@/types";
import { FormProvider } from "react-hook-form";
import { ChatPreview } from "./components/chat-preview";
import BotServerActions from "@/lib/actions/server/bot";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomizeForm } from "./components/customize-form";

interface CustomizeFormValues {
	name: string;
	description: string;
	systemMessage: string;
	placeholderMessage: string;
	welcomeMessage: string;
	starterQuestions: string[];
	avatarURL: string;
	botChatAvatarURL: string;
	uMessageColor: string;
	aMessageColor: string;
	showSources: boolean;
	sendButtonText: string;
	customCSS: string;
	embedAngle: string;
	embedWidgetSize: string;
	embedWidgetIconURL: string;
	embedAutoOpen: boolean;
	embedPingMessage: string;
}

const CustomizePage = async ({ params }: WorkspacePageProps) => {
	const { data: bot, success } = await BotServerActions.retrieveBot({ botId: params.botId });
	if (!bot || !success) {
		notFound()
	}
	const methods = useForm<CustomizeFormValues>({
		defaultValues: {
			name: bot?.name || "",
			description: bot?.description || "",
			systemMessage: bot?.systemMessage || "",
			placeholderMessage: bot?.placeholderMessage || "Type your message...",
			welcomeMessage: bot?.welcomeMessage || "",
			starterQuestions: bot?.starterQuestions || [],
			avatarURL: bot?.configurations?.avatarURL || "",
			botChatAvatarURL: bot?.configurations?.botChatAvatarURL || "",
			uMessageColor: bot?.configurations?.uMessageColor || "#2563eb",
			aMessageColor: bot?.configurations?.aMessageColor || "#f1f5f9",
			showSources: bot?.configurations?.showSources ?? true,
			sendButtonText: bot?.configurations?.sendButtonText || "",
			customCSS: bot?.configurations?.customCSS || "",
			embedAngle: bot?.configurations?.embedAngle || "right",
			embedWidgetSize: bot?.configurations?.embedWidgetSize || "medium",
			embedWidgetIconURL: bot?.configurations?.embedWidgetIconURL || "",
			embedAutoOpen: bot?.configurations?.embedAutoOpen ?? false,
			embedPingMessage: bot?.configurations?.embedPingMessage || "",
		},
	});

	return (
		<div className="container mx-auto p-4">
			<FormProvider {...methods}>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
					<ChatPreview />
					<Card className="h-[78dvh] !p-2">
						<ScrollArea className="pr-4">
							<div className="max-h-[76dvh]">
								<CustomizeForm form={methods} />
							</div>
						</ScrollArea>
					</Card>
				</div>
			</FormProvider>
		</div>
	);
};

export default CustomizePage;
