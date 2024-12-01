import React from "react";
import { notFound } from "next/navigation";
import { WorkspacePageProps } from "@/types";
import ShareButton from "@/components/share-button";
import BotServerActions from "@/lib/actions/server/bot";

export const revalidate = 10;
export default async function BotPreviewPage(props: WorkspacePageProps) {
	const { data: bot, success } = await BotServerActions.retrieveBot({
		botId: props.params.botId,
	});
	if (!bot || !success) {
		notFound();
	}
	return (
		<div className="flex flex-col items-center justify-center flex-1 h-full">
			<h2>BOT: {bot.name}</h2>
			<ShareButton bot={bot} />
		</div>
	);
}
