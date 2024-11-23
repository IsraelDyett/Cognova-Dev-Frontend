"use server";

import { prisma } from "@/services/prisma";

export async function getConversations({ botId }: { botId: string }) {
	return await prisma.conversation.findMany({
		where: {
			botId: botId,
		},
		orderBy: { updatedAt: "desc" },
		include: {
			chats: {
				select: { id: true },
			},
		},
	});
}
