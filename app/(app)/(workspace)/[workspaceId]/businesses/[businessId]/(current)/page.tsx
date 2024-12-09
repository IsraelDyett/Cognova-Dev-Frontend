import { prisma } from "@/services/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatActivityChart from "./components/chat-activity-chart";

async function getBusinessAnalytics(businessId: string) {
	const business = await prisma.business.findUnique({
		where: { id: businessId },
		include: {
			products: true,
			locations: true,
			configurations: true,
			bots: {
				include: {
					conversations: {
						include: {
							chats: true,
						},
					},
				},
			},
		},
	});

	if (!business) throw new Error("Business not found");

	const totalProducts = business.products.length;
	const totalLocations = business.locations.length;
	const activeProducts = business.products.filter((p) => p.isActive).length;
	const totalConversations = business.bots.reduce(
		(acc, bot) => acc + bot.conversations.length,
		0,
	);
	const totalChats = business.bots.reduce(
		(acc, bot) => acc + bot.conversations.reduce((acc2, conv) => acc2 + conv.chats.length, 0),
		0,
	);

	const chatsByBotAndDate = business.bots.reduce(
		(acc, bot) => {
			const botChats = bot.conversations.flatMap((conv) =>
				conv.chats.map((chat) => ({
					date: chat.createdAt.toISOString().split("T")[0],
					bot: bot.name,
					count: 1,
				})),
			);

			botChats.forEach((chat) => {
				if (!acc[chat.date]) {
					acc[chat.date] = {};
				}
				acc[chat.date][chat.bot] = (acc[chat.date][chat.bot] || 0) + chat.count;
			});

			return acc;
		},
		{} as Record<string, Record<string, number>>,
	);

	const chatActivity = Object.entries(chatsByBotAndDate).map(([date, bots]) => ({
		date,
		...bots,
	}));

	return {
		business,
		metrics: {
			totalProducts,
			totalLocations,
			activeProducts,
			totalConversations,
			totalChats,
		},
		charts: {
			chatActivity,
		},
	};
}

export default async function Page({ params }: { params: { businessId: string } }) {
	const analytics = await getBusinessAnalytics(params.businessId);
	const { business, metrics, charts } = analytics;

	const chartConfig = business.bots.reduce(
		(acc, bot, index) => {
			acc[bot.name] = {
				color: `var(--chart-${index + 1})`,
				label: bot.name,
			};
			return acc;
		},
		{} as Record<string, { color: string; label: any }>,
	);

	return (
		<div className="space-y-8">
			<h1 className="text-2xl font-bold">{business.name}</h1>

			{/* Key Metrics */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Products</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{metrics.totalProducts}</div>
						<p className="text-xs text-muted-foreground">
							{metrics.activeProducts} active products
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Locations</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{metrics.totalLocations}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{metrics.totalConversations}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Chats</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{metrics.totalChats}</div>
					</CardContent>
				</Card>
			</div>
			<ChatActivityChart chatConfig={chartConfig} charts={charts} />
		</div>
	);
}
