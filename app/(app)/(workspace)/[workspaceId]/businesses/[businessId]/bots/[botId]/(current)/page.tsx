import React from "react";
import { getAnalytics } from "./actions";
import { notFound } from "next/navigation";
import { formatBigInt } from "@/lib/utils";
import { WorkspacePageProps } from "@/types";
import MetricCard from "./_charts/metric-card";
import ShareButton from "@/components/share-button";
import { retrieveBot } from "@/lib/actions/server/bot";
import { Users, MessageSquare, ThumbsDown } from "lucide-react";
import QueryTrendsChart from "./_charts/query-trends-bar-chart";

const AnalyticsDashboard = async (props: WorkspacePageProps) => {
	const botId = props.params.botId;
	const { data: bot, success } = await retrieveBot({ botId });
	if (!success || !bot) {
		notFound();
	}
	const analytics = await getAnalytics(botId);

	const { conversationMetrics, chatMetrics, queriesPerDay } = analytics;

	return (
		<div className="space-y-6">
			<div>
				<ShareButton bot={bot} />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<MetricCard
					title="Total Conversations"
					value={`${formatBigInt(conversationMetrics.totalConversations)}`}
					description="Active chat sessions"
					icon={MessageSquare}
				/>
				<MetricCard
					title="Unique Users"
					value={`${formatBigInt(conversationMetrics.uniqueUsers)}`}
					description="Distinct visitors"
					icon={Users}
				/>
				<MetricCard
					title="Downvote Rate"
					value={`${chatMetrics.downvotePercentage.toFixed(1)}%`}
					description={`${formatBigInt(chatMetrics.downvotedChats)} downvoted`}
					icon={ThumbsDown}
				/>
				<MetricCard
					title="Total Chats"
					value={`${chatMetrics.totalChats.toFixed(1)}%`}
					description={`Total chats received`}
					icon={ThumbsDown}
				/>
				<MetricCard
					title="Average chats per Conversations"
					value={`${formatBigInt(conversationMetrics.averageChatsPerConversation)}`}
					description="Average chats per conversation"
					icon={MessageSquare}
				/>
			</div>

			<div className="grid grid-cols-1">
				<QueryTrendsChart data={queriesPerDay} />
			</div>
		</div>
	);
};

export default AnalyticsDashboard;
