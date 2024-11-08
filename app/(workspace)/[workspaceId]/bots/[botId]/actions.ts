"use server";
import { prisma } from "@/lib/services/prisma";
import { debug } from "@/lib/utils";

export async function getBotSources(botId: string) {
  debug("GET BOT SOURCES");
  try {
    const sources = await prisma.botSources.findMany({
      where: {
        botId,
      },
      include: {
        source: {
          include: {
            technique: true,
            syncs: true,
          },
        },
      },
    });
    return { success: true, data: sources };
  } catch (error) {
    return { success: false, error: "Failed to fetch bot sources" };
  }
}

export async function associateSourceWithBot(sourceId: string, botId: string) {
  try {
    const botSource = await prisma.botSources.create({
      data: {
        sourceId,
        botId,
      },
    });
    return { success: true, data: botSource };
  } catch (error) {
    return { success: false, error: "Failed to associate source with bot" };
  }
}

export async function deassociateSourceFromBot(sourceId: string, botId: string) {
  try {
    await prisma.botSources.deleteMany({
      where: {
        sourceId,
        botId,
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to deassociate source from bot" };
  }
}
