export interface DateRange {
	from: Date;
	to: Date;
}

// Raw Prisma return types
export interface PrismaQueryPerDay {
	date: Date;
	count: bigint;
}

export interface PrismaDistributionCount {
	_count: bigint;
}

// Processed types for frontend
export interface QueryPerDay {
	date: string;
	chats: number;
}

export interface DistributionItem {
	name: string;
	value: number;
}

export interface ConversationMetrics {
	totalConversations: number;
	averageChatsPerConversation: number;
	uniqueUsers: number;
}

export interface ChatMetrics {
	totalChats: number;
	downvotedChats: number;
	downvotePercentage: number;
}

export interface AnalyticsResponse {
	conversationMetrics: ConversationMetrics;
	chatMetrics: ChatMetrics;
	queriesPerDay: QueryPerDay[];
}

export interface MetricCardProps {
	title: string;
	value: string | number;
	description?: string;
	trend?: number;
	icon?: any;
}
