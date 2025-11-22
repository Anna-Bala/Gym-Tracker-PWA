import React from "react";
import { Pie, PieChart as PieChartBase, ResponsiveContainer, Tooltip, type PieProps } from "recharts";

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
      <ResponsiveContainer>
        <PieChartBase>
          <Pie {...pieProps} label={renderCustomLabel} />
          {needleIndex !== undefined && <Pie activeShape={Needle as PieProps["activeShape"]} {...pieProps} label={renderCustomLabel} />}
          {needleIndex !== undefined && <Tooltip defaultIndex={needleIndex} content={() => null} active />}
        </PieChartBase>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

PieChart.displayName = "PieChart";
