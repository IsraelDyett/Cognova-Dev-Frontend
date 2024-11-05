"use server";
import { z } from "zod";
import { authUser } from "../auth/actions";
import { prisma } from "@/lib/services/prisma";
import { BotConfig, createBotSchema } from "@/lib/zod/schemas/bot";

export const getWorkspaces = async (userId: string) => {
    const workspaces = await prisma.workspaceUser.findMany({
        where: {
            userId: userId,
        },
        select: {
            workspace: true,
        }
    });
    return workspaces;
}
export const getModels = async () => {
    const models = await prisma.model.findMany();
    return models;
}
export const getBots = async (workspaceSlug: string) => {
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
export const updateBot=  async (botId: string, data: Pick<BotConfig, "name" | "description" | "systemMessage" | "welcomeMessage" | "starterQuestions">) => {
    const bot = await prisma.bot.update({
        where: { id: botId },
        data,
    });

    return bot;
}

export const isUserInWorkspace = async (userId: string, workspaceSlug: string) => {
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