"use server";
import { z } from "zod";
import { prisma } from "@/lib/services/prisma";
import { BotConfig, createBotSchema } from "@/lib/zod/schemas/bot";
import { debug } from "@/lib/utils";
import { getBrowserMetadata, getOrCreateSessionId } from "@/lib/actions/server/session";
import { headers } from "next/headers";
import { Bot, Conversation } from "@prisma/client";

export const getWorkspaces = async (userId: string, withPlan = true) => {
	debug("GET WORKSPACES");
	const workspaces = await prisma.workspaceUser.findMany({
		where: {
			userId: userId,
		},
		select: {
			workspace: {
				include: {
					subscription: {
						select: {
							plan: withPlan,
						},
					},
				},
			},
		},
	});
	return workspaces.map((ws) => ws.workspace);
};

export const getModels = async () => {
	debug("GET MODELS");
	const models = await prisma.model.findMany();
	return models;
};

export const getWorkspaceBots = async (workspaceId: string) => {
	debug("GET BOTS");
	try {
		const bots = await prisma.bot.findMany({
			where: {
				workspace: {
					OR: [{ name: workspaceId }, { id: workspaceId }],
				},
			},
		});
		return { success: true, data: bots };
	} catch (error) {
		return { success: false, error: "Failed to fetch bots" };
	}
};

export async function getWorkspaceSources(workspaceId: string, withBots = false) {
	debug("GET WORKSPACE SOURCES");
	try {
		const sources = await prisma.source.findMany({
			where: {
				workspace: {
					OR: [{ name: workspaceId }, { id: workspaceId }],
				},
			},
			include: {
				bots: {
					include: {
						bot: withBots,
					},
				},
			},
		});
		return { success: true, data: sources };
	} catch (error) {
		return { success: false, error: "Failed to fetch workspace sources" };
	}
}
export const getBot = async (botId: string) => {
	debug("GET BOT");
	const bots = await prisma.bot.findUnique({
		where: {
			id: botId,
		},
		include: {
			configurations: true,
		},
	});
	return bots;
};

export const createBot = async (data: z.infer<typeof createBotSchema>) => {
	debug("CREATE BOT");
	const bot = await prisma.bot.create({
		data: {
			name: data.name,
			modelId: data.modelId,
			workspaceId: data.workspaceId,
		},
		select: {
			workspace: true,
			id: true,
		},
	});
	return {
		bot: bot,
		message: "Bot created successfully",
		redirect: `/${bot.workspace.name}/bots/${bot.id}`,
	};
};

export const updateBot = async (
	botId: string,
	data: Pick<
		BotConfig,
		"name" | "description" | "systemMessage" | "welcomeMessage" | "starterQuestions"
	>,
) => {
	debug("UPDATE BOT");
	const bot = await prisma.bot.update({
		where: { id: botId },
		data,
	});

	return bot;
};

export const isUserInWorkspace = async (userId: string, workspaceSlug: string) => {
	debug("IS USER IN WORKSPACE");
	const workspaceUser = await prisma.workspaceUser.findFirst({
		where: {
			userId: userId,
			workspace: {
				name: workspaceSlug,
			},
		},
		select: {
			workspace: true,
		},
	});
	return {
		success: !!workspaceUser,
		workspace: workspaceUser?.workspace,
	};
};

export const getDefaultWorkspace = async (userId: string) => {
	debug("GET DEFAULT WORKSPACE");
	const workspaceUser = await prisma.workspaceUser.findFirst({
		where: {
			userId: userId,
		},
		select: {
			workspace: true,
		},
	});
	return workspaceUser?.workspace;
};
export const getWorkspace = async (workspaceId: string, withPlan = false) => {
	debug("GET WORKSPACE");
	const workspace = await prisma.workspace.findFirst({
		where: {
			OR: [{ name: workspaceId }, { id: workspaceId }],
		},
		include: {
			subscription: {
				select: {
					plan: withPlan,
				},
			},
		},
	});

	if (workspace && "subscription" in workspace) {
		const { subscription, ...restWorkspace } = workspace;
		return {
			...restWorkspace,
			plan: subscription?.plan,
		};
	}
	return workspace;
};

export const getChats = async (conversationId: string) => {
	debug("GET CHATS");
	const chats = await prisma.chat.findMany({
		where: {
			conversationId: conversationId,
		},
		orderBy: { createdAt: "asc" },
	});
	return chats;
};

export const createConversation = async (botId: string) => {
	const sessionId = await getOrCreateSessionId();
	const metadata = await getBrowserMetadata();
	const bot = await prisma.bot.findUnique({
		where: {
			id: botId,
		},
	});
	if (!bot) {
		return null;
	}
	const conversation = await prisma.conversation.create({
		data: {
			botId,
			sessionId,
			...metadata,
			countryCode: headers().get("CF-IPCountry") || null,
		},
		include: {
			bot: true,
		},
	});

	return conversation;
};
export const getOrCreateConversation = async (
	botId: string,
): Promise<((Conversation & { bot: Bot }) | null) | null> => {
	const sessionId = await getOrCreateSessionId();
	const existingConversation = await prisma.conversation.findFirst({
		where: {
			botId,
			sessionId,
		},
		orderBy: {
			createdAt: "desc",
		},
		include: {
			bot: true,
		},
	});

	if (existingConversation) {
		return existingConversation;
	}

	return createConversation(botId);
};
