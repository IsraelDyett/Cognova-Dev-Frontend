import PlaygroundPage from "@/app/(workspace)/[workspaceId]/bots/[botId]/playground/page";
import { WorkspacePageProps } from "@/types";

export default function EmbedPage(defaultProps: WorkspacePageProps) {
  const props = { fullScreen: true, ...defaultProps };
  return <PlaygroundPage {...props} />;
}
