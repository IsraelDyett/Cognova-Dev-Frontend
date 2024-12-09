import { WorkspacePageProps } from "@/types";
import PlaygroundPage from "@/businessId/bots/[botId]/playground/page";

export default function ChatsPage(defaultProps: WorkspacePageProps) {
	const props = { isolate: false, ...defaultProps };
	return <PlaygroundPage {...props} />;
}
