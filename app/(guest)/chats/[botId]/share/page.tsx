import { Metadata } from "next";
import PlaygroundPage from "@/app/(auth)/(workspace)/[workspaceId]/bots/[botId]/playground/page";
import { WorkspacePageProps } from "@/types";
import { getBot } from "@/app/(auth)/(workspace)/actions";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
	params,
}: {
	params: { botId: string };
}): Promise<Metadata> {
	const bot = await getBot(params.botId);

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
