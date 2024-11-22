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

export interface PrismaCountryDistribution extends PrismaDistributionCount {
	countryCode: string;
}

export interface PrismaDeviceDistribution extends PrismaDistributionCount {
	device: string | null;
}

export interface PrismaBrowserDistribution extends PrismaDistributionCount {
	browser: string | null;
}

export interface PrismaOsDistribution extends PrismaDistributionCount {
	os: string | null;
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
	countryDistribution: DistributionItem[];
	deviceDistribution: DistributionItem[];
	browserDistribution: DistributionItem[];
	osDistribution: DistributionItem[];
}

export interface MetricCardProps {
	title: string;
	value: string | number;
	description?: string;
	trend?: number;
	icon?: any;
}
