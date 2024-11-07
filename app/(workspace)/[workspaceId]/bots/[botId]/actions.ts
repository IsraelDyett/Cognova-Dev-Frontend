"use server";
import { prisma } from "@/lib/services/prisma";
import { debug } from "@/lib/utils";


export const getSourcesByBot  = async (botId: string) => {
    debug("GET SOURCES BY BOT")
    const sources = await prisma.botSources.findMany({
        where: {
            botId: botId,
        },
        include: {
            source: {
                include: {
                    technique: true,
                    syncs: true
                }
            },
        }
    })
    return sources.map((src) => src.source)
}