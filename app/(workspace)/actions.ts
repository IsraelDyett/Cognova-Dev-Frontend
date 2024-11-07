"use server";
import { z } from "zod";
import { prisma } from "@/lib/services/prisma";
import { BotConfig, createBotSchema } from "@/lib/zod/schemas/bot";
import { debug } from "@/lib/utils";

export const getWorkspaces = async (userId: string, withPlan = true) => {
    debug("GET WORKSPACES")
    const workspaces = await prisma.workspaceUser.findMany({
        where: {
            userId: userId,
        },
        select: {
            workspace: {
                include: {
                    plan: withPlan
                }
            }
        }
    });
    return workspaces.map((ws) => ws.workspace);
}

export const getWorkspacePlan = async (workspaceId: string) => {
    debug("GET WORKSPACE PLAN")
    const workspace = await prisma.workspace.findFirst({
        where: {
            OR: [
                { slugName: workspaceId },
                { id: workspaceId }
            ]
        },
        select: {
            plan: true
        }
    })
    return workspace?.plan
}

export const getModels = async () => {
    debug("GET MODELS")
    const models = await prisma.model.findMany();
    return models;
}

export const getBots = async (workspaceSlug: string) => {
    debug("GET BOTS")
    const bots = await prisma.bot.findMany({
        where: {
            workspace: {
                slugName: workspaceSlug
            },
        }
    })
    return bots;
}

export const getBot = async (botId: string) => {
    debug("GET BOT")
    const bots = await prisma.bot.findUnique({
        where: {
            id: botId
        },
        include: {
            configurations: true
        }
    })
    return bots;
}

export const createBot = async (data: z.infer<typeof createBotSchema>) => {
    debug("CREATE BOT")
    const bot = await prisma.bot.create({
        data: {
            name: data.name,
            modelId: data.modelId,
            workspaceId: data.workspaceId,
        }
    })
    return {
        bot: bot,
        message: "Bot created successfully",
        redirect: `/${data.workspaceId}/bots/${bot.id}`
    }
}

export const updateBot = async (botId: string, data: Pick<BotConfig, "name" | "description" | "systemMessage" | "welcomeMessage" | "starterQuestions">) => {
    debug("UPDATE BOT")
    const bot = await prisma.bot.update({
        where: { id: botId },
        data,
    });

    return bot;
}

export const isUserInWorkspace = async (userId: string, workspaceSlug: string) => {
    debug("IS USER IN WORKSPACE")
    const workspaceUser = await prisma.workspaceUser.findFirst({
        where: {
            userId: userId,
            workspace: {
                slugName: workspaceSlug
            }
        },
        select: {
            workspace: true,
        }
    })
    return {
        success: !!workspaceUser,
        workspace: workspaceUser?.workspace
    };
}

export const getDefaultWorkspace = async (userId: string) => {
    debug("GET DEFAULT WORKSPACE")
    const workspaceUser = await prisma.workspaceUser.findFirst({
        where: {
            userId: userId,
        },
        select: {
            workspace: true,
        }
    })
    return workspaceUser?.workspace;
}
export const getWorkspace = async (workspaceId: string, withPlan = false) => {
    debug("GET WORKSPACE")
    const workspace = await prisma.workspace.findFirst({
        where: {
            OR: [
                { slugName: workspaceId },
                { id: workspaceId }
            ]
        },
        include: {
            plan: withPlan
        }
    })
    return workspace;
}