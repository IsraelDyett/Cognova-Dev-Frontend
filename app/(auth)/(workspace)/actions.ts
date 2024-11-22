"use server";
import { z } from "zod";
import { prisma } from "@/lib/services/prisma";
import { BotConfig, createBotSchema } from "@/lib/zod/schemas/bot";
import { debug } from "@/lib/utils";
import { getBrowserMetadata, getOrCreateSessionId } from "@/lib/actions/server/session";
import { headers } from "next/headers";
import { Bot, Conversation } from "@prisma/client";

export const getWorkspaces = async (userId: string, withPlan = true) => {
	debug("SERVER", "getWorkspaces", "PRISMA ACTIONS");
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
	debug("SERVER", "getModels", "PRISMA ACTIONS");
	const models = await prisma.model.findMany();
	return models;
};

export const getWorkspaceBots = async (workspaceId: string) => {
	debug("SERVER", "getWorkspaceBots", "PRISMA ACTIONS");
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

export const getWorkspaceSources = async (workspaceId: string, withBots = false) => {
	debug("SERVER", "getWorkspaceSources", "PRISMA ACTIONS");
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
};
export const retrieveBot = async (botId: string) => {
	debug("SERVER", "retrieveBot", "PRISMA ACTIONS");
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
	debug("SERVER", "createBot", "PRISMA ACTIONS");
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
	debug("SERVER", "updateBot", "PRISMA ACTIONS");
	const bot = await prisma.bot.update({
		where: { id: botId },
		data,
	});

	return bot;
};

export const isUserInWorkspace = async (userId: string, workspaceSlug: string) => {
	debug("SERVER", "isUserInWorkspace", "PRISMA ACTIONS");
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
	debug("SERVER", "getDefaultWorkspace", "PRISMA ACTIONS");
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
export const retrieveWorkspace = async (workspaceId: string, withPlan = false) => {
	debug("SERVER", "retrieveWorkspace", "PRISMA ACTIONS");
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
			bots: true,
			businesses: true
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
	debug("SERVER", "getChats", "PRISMA ACTIONS");
	const chats = await prisma.chat.findMany({
		where: {
			conversationId: conversationId,
		},
		orderBy: { createdAt: "asc" },
	});
	return chats;
};

export const createConversation = async (botId: string) => {
	debug("SERVER", "createConversation", "PRISMA ACTIONS");
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
	debug("SERVER", "getOrCreateConversation", "PRISMA ACTIONS");
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
