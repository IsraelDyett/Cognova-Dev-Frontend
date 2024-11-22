import React from "react";
import { notFound } from "next/navigation";
import { WorkspacePageProps } from "@/types";
import ShareButton from "@/components/share-button";
import { retrieveBot } from "@/app/(auth)/(workspace)/actions";
import { Bot } from "@prisma/client";

export const revalidate = 10;
export default async function BotPreviewPage(props: WorkspacePageProps) {
	let bot: Bot | null = null;
	try {
		bot = await retrieveBot(props.params.botId);
		if (!bot) {
			notFound();
		}
	} catch (error) {
		notFound();
	}
	return (
		<div className="flex flex-col items-center justify-center flex-1 h-full">
			<h2>BOT: {bot.name}</h2>
			<ShareButton bot={bot} />
		</div>
	);
}
