"use client";
import React, { useState, useEffect } from "react";
import { Users, MessageSquare, ThumbsDown } from "lucide-react";
import { getAnalytics } from "./actions";
import { AnalyticsResponse } from "./types";
import QueryTrendsChart from "./_charts/query-trends-bar-chart";
import { WorkspacePageProps } from "@/types";
import MetricCard from "./_charts/metric-card";

const formatNumber = (num: number): string => {
	const lookup = [
		{ value: 1e6, symbol: "M" },
		{ value: 1e3, symbol: "K" },
	];
	const item = lookup.find((item) => num >= item.value);
	return item ? `${(num / item.value).toFixed(1)}${item.symbol}` : num.toString();
};

const AnalyticsDashboard: React.FC<WorkspacePageProps> = (props) => {
	const botId = props.params.botId;
	const [loading, setLoading] = useState<boolean>(true);
	const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const data = await getAnalytics(botId);
				setAnalytics(data);
			} catch (error) {
				console.error("Failed to fetch analytics:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [botId]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!analytics) return null;

	const { conversationMetrics, chatMetrics, queriesPerDay, countryDistribution } = analytics;

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<MetricCard
					title="Total Conversations"
					value={formatNumber(conversationMetrics.totalConversations)}
					description="Active chat sessions"
					icon={MessageSquare}
				/>
				<MetricCard
					title="Unique Users"
					value={formatNumber(conversationMetrics.uniqueUsers)}
					description="Distinct visitors"
					icon={Users}
				/>
				<MetricCard
					title="Downvote Rate"
					value={`${chatMetrics.downvotePercentage.toFixed(1)}%`}
					description={`${formatNumber(chatMetrics.downvotedChats)} downvoted`}
					icon={ThumbsDown}
				/>
			</div>

			<div className="grid grid-cols-1">
				<QueryTrendsChart data={queriesPerDay} />
			</div>
		</div>
	);
};

export default AnalyticsDashboard;
