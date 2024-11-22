import PlaygroundPage from "@/app/(auth)/(workspace)/[workspaceId]/bots/[botId]/playground/page";
import { WorkspacePageProps } from "@/types";

export default function ChatsPage(defaultProps: WorkspacePageProps) {
	return <PlaygroundPage {...defaultProps} />;
}
