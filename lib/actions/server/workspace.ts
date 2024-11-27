"use server";
import { Prisma } from "@prisma/client";
import BaseServerActionActions from "./base";

class WorkspaceServerActions extends BaseServerActionActions {
    public static async getWorkspaces({ userId, select = { workspace: true } }: { userId: string, select?: Prisma.WorkspaceUserSelect }) {
        return this.executeAction(
            async () => {
                const workspaces = await this.prisma.workspaceUser.findMany({
                    where: {
                        userId: userId,
                    },
                    select
                });
                return workspaces.map((ws) => ws.workspace);
            },
            "Failed to get workspaces"
        );
    }

    public static async retrieveWorkspace({ workspaceId, include = {
        bots: true,
        businesses: true,
        payments: true,
        subscription: {
            include: {
                plan: true
            }
        },
        vectors: true,
        users: true,
        invitations: true,
        owner: true,
    } }: {
        workspaceId: string, include: Prisma.WorkspaceInclude
    }) {
        return this.executeAction(
            async () => this.prisma.workspace.findFirst({
                where: {
                    OR: [
                        { name: workspaceId },
                        { id: workspaceId }
                    ],
                },
                include,

            }),
            "Failed to retrieve workspace"
        );
    }

    public static async createWorkspace({ data }: { data: Prisma.WorkspaceUncheckedCreateInput }) {
        return this.executeAction(
            () => this.prisma.workspace.create({ data }),
            "Failed to create workspace"
        );
    }

    public static async updateWorkspace({ id, data }: {
        id: string,
        data: Prisma.WorkspaceUncheckedUpdateInput
    }) {
        return this.executeAction(
            () => this.prisma.workspace.update({
                where: { id },
                data
            }),
            "Failed to update workspace"
        );
    }

    // EXTRA
    public static async checkWorkspaceMembership({ userId, workspaceId, select = { workspace: true } }: { userId: string, workspaceId: string, select?: Prisma.WorkspaceUserSelect }) {
        return this.executeAction(
            async () => {
                const membership = await this.prisma.workspaceUser.findFirst({
                    where: {
                        userId: userId,
                        workspace: {
                            OR: [
                                { name: workspaceId },
                                { id: workspaceId }
                            ],
                        },
                    },
                    select
                });
                return {
                    status: !!membership,
                    workspace: membership?.workspace,
                };
            },
            "Failed to check workspace membership"
        );
    }

    public static async getDefaultWorkspace({ userId, select = { workspace: true } }: { userId: string, select?: Prisma.WorkspaceUserSelect }) {
        return this.executeAction(
            async () => {
                const workspaceUser = await this.prisma.workspaceUser.findFirst({
                    where: {
                        userId: userId,
                    },
                    select
                });
                return workspaceUser?.workspace;
            },
            "Failed to get default workspace"
        );
    }
}


export default WorkspaceServerActions;