"use server";

import { prisma } from "@/services/prisma";

export async function getConversations() {
  return await prisma.conversation.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      chats: {
        select: { id: true },
      },
    },
  });
}

export async function getChats(conversationId: string) {
  return await prisma.chat.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}
