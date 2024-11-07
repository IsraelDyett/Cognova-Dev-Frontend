"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const colorMap = {
  chrome: "hsl(var(--chart-1))",
  safari: "hsl(var(--chart-2))",
  firefox: "hsl(var(--chart-3))",
  edge: "hsl(var(--chart-4))",
  other: "hsl(var(--chart-5))"
}

export default function BrowsersChart({
  data
}: {
  data: { name: string; value: number }[]
}) {
  const chartData = data.map(item => ({
    browser: item.name.toLowerCase(),
    visitors: item.value,
    fill: colorMap[item.name.toLowerCase() as keyof typeof colorMap] || "hsl(var(--chart-5))"
  }))


  const chartConfig = data.reduce((config, item) => {
    const browserName = item.name.toLowerCase()
    return {
      ...config,
      [browserName]: {
        label: item.name,
        color: colorMap[browserName as keyof typeof colorMap] || "hsl(var(--chart-5))"
      }
    }
  }, {
    visitors: {
      label: "Visitors"
    }
  }) as ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Browser Distribution</CardTitle>
        <CardDescription>
          Most used web browsers
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie data={chartData} dataKey="visitors">
              <LabelList
                dataKey="browser"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: string) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}