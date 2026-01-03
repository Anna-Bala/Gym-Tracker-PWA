import React, { type ComponentProps } from "react";
import { BarChart as BarChartBase, Bar, CartesianGrid, XAxis, type XAxisProps } from "recharts";
import type { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

type BarChartProps = {
  chartConfig: ChartConfig;
  data: CategoricalChartProps["data"];
  xAxisProps: XAxisProps;
} & Omit<ComponentProps<typeof BarChartBase>, "data">;

export const BarChart: React.FC<BarChartProps> = ({ chartConfig, data, xAxisProps, ...barChartProps }) => {
  const chartBars = Object.keys(chartConfig).map((chartDataKey) => ({ dataKey: chartDataKey, fill: chartConfig[chartDataKey].color }));

  return (
    <ChartContainer config={chartConfig}>
      <BarChartBase {...barChartProps} data={data}>
        <CartesianGrid vertical={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />

        {chartBars.map(({ dataKey, fill }) => (
          <Bar dataKey={dataKey} yAxisId={dataKey} fill={fill} radius={4} />
        ))}

        {xAxisProps.dataKey && <XAxis dataKey={xAxisProps.dataKey} {...xAxisProps} tickLine={false} tickMargin={10} axisLine={false} />}
      </BarChartBase>
    </ChartContainer>
  );
};

BarChart.displayName = "BarChart";
