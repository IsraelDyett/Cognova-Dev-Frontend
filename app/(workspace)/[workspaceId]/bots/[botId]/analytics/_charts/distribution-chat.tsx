"use client";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];
const formatNumber = (num: number): string => {
  const lookup = [
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "K" },
  ];
  const item = lookup.find((item) => num >= item.value);
  return item ? `${(num / item.value).toFixed(1)}${item.symbol}` : num.toString();
};

const DistributionChart = ({
  title,
  data,
  description,
}: {
  title: string;
  data: { name: string; value: number }[];
  description: string;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatNumber(value)}
            contentStyle={{ backgroundColor: "white", borderRadius: "8px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
export default DistributionChart;
