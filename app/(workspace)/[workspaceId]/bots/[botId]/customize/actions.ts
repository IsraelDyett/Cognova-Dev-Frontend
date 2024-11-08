"use server";
import { prisma } from "@/lib/services/prisma";
import { debug } from "@/lib/utils";
import { BotConfig, botConfigurationBaseSchema } from "@/lib/zod/schemas/bot";

export const updateBotConfig = async (botId: string, data: BotConfig) => {
  debug("UPDATE BOT CONFIG");
  const validated = botConfigurationBaseSchema.parse(data);

  const config = await prisma.botConfiguration.upsert({
    where: { botId },
    update: {
      ...validated,
    },
    // @ts-expect-error
    create: {
      botId,
      ...validated,
    },
  });

  return config;
};
