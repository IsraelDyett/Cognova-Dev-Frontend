import PlaygroundPage from "@/app/(app)/(workspace)/[workspaceId]/bots/[botId]/playground/page";
import { WorkspacePageProps } from "@/types";

export default function ChatsPage(defaultProps: WorkspacePageProps) {
	return <PlaygroundPage {...defaultProps} />;
}
