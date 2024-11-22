import { Metadata } from "next";
import PlaygroundPage from "@/app/(auth)/(workspace)/[workspaceId]/bots/[botId]/playground/page";
import { WorkspacePageProps } from "@/types";
import { retrieveBot } from "@/app/(auth)/(workspace)/actions";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
	params,
}: {
	params: { botId: string };
}): Promise<Metadata> {
	const bot = await retrieveBot(params.botId);

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
