import React from "react";
import { Pie, PieChart as PieChartBase, ResponsiveContainer, Tooltip, type PieProps } from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Needle } from "./Needle";
import { renderCustomLabel } from "./utils";

type PieChartProps = {
  chartConfig: ChartConfig;
  className?: string;
  showNeedle?: boolean;
} & Omit<PieProps, "ref">;

export const PieChart: React.FC<PieChartProps> = ({ chartConfig, className, showNeedle, ...pieProps }) => {
  return (
    <ChartContainer className={className} config={chartConfig}>
      <ResponsiveContainer>
        <PieChartBase>
          <Pie {...pieProps} label={renderCustomLabel} />
          {showNeedle && <Pie activeShape={Needle as PieProps["activeShape"]} {...pieProps} label={renderCustomLabel} />}
          {showNeedle && <Tooltip defaultIndex={2} content={() => null} active />}
        </PieChartBase>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

PieChart.displayName = "PieChart";
