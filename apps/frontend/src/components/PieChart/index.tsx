import React from "react";
import { Pie, PieChart as PieChartBase, type PieProps } from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Needle } from "./Needle";
import { renderCustomLabel } from "./utils";

type PieChartProps = {
  chartConfig: ChartConfig;
  className?: string;
  needleIndex?: number;
} & Omit<PieProps, "ref">;

export const PieChart: React.FC<PieChartProps> = ({ chartConfig, className, needleIndex, ...pieProps }) => {
  return (
    <ChartContainer className={className} config={chartConfig}>
      <PieChartBase>
        <Pie {...pieProps} label={renderCustomLabel} />
        {needleIndex !== undefined && (
          <Pie
            {...pieProps}
            activeIndex={needleIndex}
            activeShape={Needle as PieProps["activeShape"]}
            label={renderCustomLabel}
          />
        )}
      </PieChartBase>
    </ChartContainer>
  );
};

PieChart.displayName = "PieChart";
