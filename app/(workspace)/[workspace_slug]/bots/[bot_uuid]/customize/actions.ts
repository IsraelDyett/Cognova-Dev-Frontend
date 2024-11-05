"use server";
import { prisma } from "@/lib/services/prisma";
import { BotConfig, botConfigurationBaseSchema } from "@/lib/zod/schemas/bot";


export const updateBotConfig = async (botId: string, data: BotConfig) => {
    const validated = botConfigurationBaseSchema.parse(data);

    const config = await prisma.botConfiguration.upsert({
        where: { botId },
        update: {
            ...validated,
        },
        // @ts-ignore
        create: {
            botId,
            ...validated,
        },
    });

    return config;
}