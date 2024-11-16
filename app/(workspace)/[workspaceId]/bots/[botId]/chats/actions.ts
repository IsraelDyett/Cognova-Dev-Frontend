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
