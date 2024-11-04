"use server";
import { prisma } from "@/lib/services/prisma";


export const getSourcesByBot  = async (botId: string) => {
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