"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

interface ChatActivityChartProps {
	chatConfig: Record<string, { color: string; label: string }>;
	charts: {
		chatActivity: Array<{
			date: string;
			[key: string]: number | string;
		}>;
	};
}

const ChatActivityChart: React.FC<ChatActivityChartProps> = ({ chatConfig, charts }) => {
	const botNames = Object.keys(chatConfig);
	const [activeBot, setActiveBot] = React.useState<string>(botNames[0] || "");

	const total = React.useMemo(() => {
		const totals: Record<string, number> = {};

		charts.chatActivity.forEach((entry) => {
			botNames.forEach((botName) => {
				const count = Number(entry[botName]) || 0;
				totals[botName] = (totals[botName] || 0) + count;
			});
		});

		return totals;
	}, [charts.chatActivity, botNames]);

	const sortedData = React.useMemo(() => {
		return [...charts.chatActivity].sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		);
	}, [charts.chatActivity]);

	return (
		<Card>
			<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
					<CardTitle>Chat Activity Over Time</CardTitle>
					<CardDescription>Showing total chats for the last 3 months</CardDescription>
				</div>
				<div className="flex">
					{botNames.map((botName) => (
						<button
							key={botName}
							data-active={activeBot === botName}
							className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
							onClick={() => setActiveBot(botName)}
						>
							<span className="text-xs text-muted-foreground text-nowrap">
								{chatConfig[botName].label}
							</span>
							<span className="text-lg font-bold leading-none sm:text-3xl">
								{total[botName]?.toLocaleString() || "0"}
							</span>
						</button>
					))}
				</div>
			</CardHeader>
			<CardContent className="px-2 sm:p-6">
				<ChartContainer config={chatConfig} className="aspect-[16/9] w-full max-h-[250px]">
					<BarChart
						accessibilityLayer
						data={sortedData}
						margin={{
							left: 12,
							right: 12,
							top: 5,
							bottom: 5,
						}}
						barSize={12}
					>
						<CartesianGrid vertical={false} stroke="#f0f0f0" strokeDasharray="3 3" />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>
						<ChartTooltip
							cursor={{ fill: "transparent" }}
							content={
								<ChartTooltipContent
									nameKey="chats"
									labelFormatter={(value) => {
										return new Date(value).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										});
									}}
								/>
							}
						/>
						<Bar
							dataKey={activeBot}
							fill={chatConfig[activeBot]?.color || "var(--chart-1)"}
							radius={[2, 2, 0, 0]}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};

export default ChatActivityChart;
