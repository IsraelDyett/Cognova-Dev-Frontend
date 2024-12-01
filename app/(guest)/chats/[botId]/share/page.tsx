import { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { notFound } from "next/navigation";
import { WorkspacePageProps } from "@/types";
import BotServerActions from "@/lib/actions/server/bot";
import PlaygroundPage from "@/app/(workspace)/[workspaceId]/bots/[botId]/playground/page";

export async function generateMetadata({
	params,
}: {
	params: { botId: string };
}): Promise<Metadata> {
	const { data: bot, success } = await BotServerActions.retrieveBot({ botId: params.botId });

	if (!success) return notFound();

	return {
		title: bot
			? `Try ${bot.name} - ${siteConfig.applicationName}`
			: `${siteConfig.applicationName}`,
		description: bot?.description ? `${bot?.description}` : siteConfig.description,
	};
}

export default function ChatsSharePage(defaultProps: WorkspacePageProps) {
	const props = { share: true, ...defaultProps };
	return <PlaygroundPage {...props} />;
}
