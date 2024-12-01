"use server";
import { prisma } from "@/lib/services/prisma";
import {
	AnalyticsResponse,
	PrismaQueryPerDay,
	PrismaCountryDistribution,
	PrismaDeviceDistribution,
	PrismaBrowserDistribution,
	PrismaOsDistribution,
} from "./types";

const bigIntToNumber = (value: bigint): number => {
	try {
		return Number(value);
	} catch (error) {
		console.error("Error converting BigInt to number:", error);
		return 0;
	}
};

export async function getAnalytics(botId: string): Promise<AnalyticsResponse> {
	const [
		conversationData,
		chatData,
		queriesPerDay,
		countryDistribution,
		deviceDistribution,
		browserDistribution,
		osDistribution,
	] = await Promise.all([
		// Conversation metrics
		prisma.$transaction(async (tx) => {
			const totalConversations = await tx.conversation.count({
				where: {
					botId,
				},
			});

			const conversationsWithChatCount = await tx.conversation.findMany({
				where: {
					botId,
				},
				include: {
					_count: {
						select: { chats: true },
					},
				},
			});

			const uniqueUsers = await tx.conversation.groupBy({
				by: ["sessionId"],
				where: {
					botId,
				},
			});

			const totalChats = conversationsWithChatCount.reduce(
				(acc, conv) => acc + conv._count.chats,
				0,
			);

			return {
				totalConversations,
				averageChatsPerConversation: totalChats / totalConversations || 0,
				uniqueUsers: uniqueUsers.length,
			};
		}),

		// Chat metrics
		prisma.$transaction(async (tx) => {
			const totalChats = await tx.chat.count({
				where: {
					conversation: {
						botId,
					},
				},
			});

			const downvotedChats = await tx.chat.count({
				where: {
					conversation: {
						botId,
					},
					feedback: "DOWNVOTED",
				},
			});

			return {
				totalChats,
				downvotedChats,
				downvotePercentage: (downvotedChats / totalChats) * 100 || 0,
			};
		}),

		// Queries per day
		prisma.$queryRaw<PrismaQueryPerDay[]>`
            WITH bot_conversations AS (
            SELECT DISTINCT
                "id"
              FROM
                conversations
              WHERE
                "botId" = ${botId}
            )
            SELECT
              DATE_TRUNC('day', c."createdAt") as date,
              COUNT(*)::bigint as count
            FROM
              chats c
              INNER JOIN bot_conversations bc ON c."conversationId" = bc."id"
            GROUP BY
              DATE_TRUNC('day', c."createdAt")
            ORDER BY
              date Desc
        `,

		// @ts-ignore Country distribution
		prisma.conversation.groupBy({
			by: ["countryCode"],
			where: {
				botId,
				countryCode: { not: null },
			},
			_count: true,
		}) as Promise<PrismaCountryDistribution[]>,

		// @ts-ignore Device distribution
		prisma.conversation.groupBy({
			by: ["device"],
			where: {
				botId,
			},
			_count: true,
		}) as Promise<PrismaDeviceDistribution[]>,

		// @ts-ignore Browser distribution
		prisma.conversation.groupBy({
			by: ["browser"],
			where: {
				botId,
			},
			_count: true,
		}) as Promise<PrismaBrowserDistribution[]>,

		// @ts-ignore OS distribution
		prisma.conversation.groupBy({
			by: ["os"],
			where: {
				botId,
			},
			_count: true,
		}) as Promise<PrismaOsDistribution[]>,
	]);

	// Transform the data
	const processedQueriesPerDay = queriesPerDay.map((item) => ({
		date: item.date.toISOString().split("T")[0],
		chats: bigIntToNumber(item.count),
	}));

	return {
		conversationMetrics: {
			...conversationData,
		},
		chatMetrics: chatData,
		queriesPerDay: processedQueriesPerDay,
		countryDistribution: countryDistribution.map((item) => ({
			name: item.countryCode,
			value: bigIntToNumber(item._count),
		})),
		deviceDistribution: deviceDistribution.map((item) => ({
			name: item.device || "Unknown",
			value: bigIntToNumber(item._count),
		})),
		browserDistribution: browserDistribution.map((item) => ({
			name: item.browser || "Unknown",
			value: bigIntToNumber(item._count),
		})),
		osDistribution: osDistribution.map((item) => ({
			name: item.os || "Unknown",
			value: bigIntToNumber(item._count),
		})),
	};
}
