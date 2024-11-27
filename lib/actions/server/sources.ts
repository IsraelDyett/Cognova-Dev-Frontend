import { Prisma } from "@prisma/client";
import BaseServerActionActions from "./base";

class SourcesServerActions extends BaseServerActionActions {
    public static async getSources(workspaceId: string, include: Prisma.SourceInclude = {}) {
        return this.executeAction(
            () => this.prisma.source.findMany({
                where: {
                    workspace: {
                        OR: [
                            { id: workspaceId },
                            { name: workspaceId },
                        ],
                    },
                },
                include: include,
            }),
            "Failed to get sources"
        );
    }

}
export default SourcesServerActions;
