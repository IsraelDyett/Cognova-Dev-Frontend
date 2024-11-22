"use server";
import { debug } from "@/lib/utils";
import { prisma } from "@/lib/services/prisma";

export async function getBotSources(botId: string) {
	debug("SERVER", "getBotSources", "PRISMA ACTIONS");
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
	debug("SERVER", "associateSourceWithBot", "PRISMA ACTIONS");
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
	debug("SERVER", "deassociateSourceFromBot", "PRISMA ACTIONS");
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
