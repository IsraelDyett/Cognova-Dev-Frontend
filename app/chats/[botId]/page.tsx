import { WorkspacePageProps } from "@/types";
import PlaygroundPage from "@/businessId/bots/[botId]/playground/page";

export default function ChatsPage(defaultProps: WorkspacePageProps) {
	return <PlaygroundPage {...defaultProps} />;
}
