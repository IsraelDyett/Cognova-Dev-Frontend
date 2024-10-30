"use server";
import { z } from "zod";
import { authUser } from "../auth/actions";
import { prisma } from "@/lib/services/prisma";
import { createBotSchema } from "@/lib/zod/schemas/bot";

export const getOrganizations = async (userId: string) => {
    const organizations = await prisma.organizationUser.findMany({
        where: {
            userId: userId,
        },
        select: {
            organization: true,
        }
    });
    return organizations;
}
export const getModels = async () => {
    const models = await prisma.model.findMany();
    return models;
}
export const getBots = async (orgSlug: string) => {
    const bots = await prisma.bot.findMany({
        where: {
            organization: {
                slugName: orgSlug
            },
        }
    })
    return bots;
}
export const createBot = async (data: z.infer<typeof createBotSchema>) => {
    const user = await authUser();
    const bot = await prisma.bot.create({
        data: {
            name: data.name,
            modelId: data.modelId,
            organizationId: data.organizationId,
        }
    })
    return {
        bot: bot,
        message: "Bot created successfully",
        redirect: `/${data.organizationId}/bots/${bot.id}`
    }
}
export const isUserInOrganization = async (userId: string, orgSlug: string) => {
    const organizationUser = await prisma.organizationUser.findFirst({
        where: {
            userId: userId,
            organization: {
                slugName: orgSlug
            }
        },
        select: {
            organization: true,
        }
    })
    return {
        success: !!organizationUser,
        organization: organizationUser?.organization
    };
}
export const getDefaultWorkspace = async (userId: string) => {
    const organizationUser = await prisma.organizationUser.findFirst({
        where: {
            userId: userId,
        },
        select: {
            organization: true,
        }
    })
    return organizationUser?.organization;
}