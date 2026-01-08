import { Link } from "react-router-dom";

import { type ChartConfig } from "@/components/ui/chart";
import { calculateBMI, calculateBmiNeedlePosition } from "./utils";
import { PieChart } from "@/components/PieChart";
import { Typography } from "@/components/base/Typography";
import Pencil from "@icons/pencil.svg?react";

const chartData = [
  { label: "Under\nweight", value: 1, fill: "var(--chart-1)", labelAdditionalInfo: "< 18.5" },
  { label: "Normal", value: 1, fill: "var(--chart-2)", labelAdditionalInfo: "18.5 - 24.9" },
  { label: "Overweight", value: 1, fill: "var(--chart-3)", labelAdditionalInfo: "25 - 29.9" },
  { label: "Obese", value: 1, fill: "var(--chart-4)", labelAdditionalInfo: "30 - 39.9" },
  { label: "Morbidly\nObese", value: 1, fill: "var(--chart-5)", labelAdditionalInfo: "> 40" },
];

const chartConfig = {
  underweight: {
    label: "Underweight",
    color: "var(--chart-1)",
  },
  normal: {
    label: "Normal",
    color: "var(--chart-2)",
  },
  overweight: {
    label: "Overweight",
    color: "var(--chart-3)",
  },
  obese: {
    label: "Obese",
    color: "var(--chart-4)",
  },
  morbidlyObese: {
    label: "MorbidlyObese",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

interface ReportBmiProps {
  height: number;
  weight: number;
}

const ReportBmi = ({ height, weight }: ReportBmiProps) => {
  const bmi = calculateBMI(weight, height / 100);
  const needlePosition = calculateBmiNeedlePosition(bmi || 0);

  return (
    <section className="flex flex-col py-2 px-2 border border-border rounded-md lg:w-1/2 lg:mx-auto">
      <div className="flex justify-between p-3">
        <Typography className="font-semibold" variant="h4">
          BMI (kg/m<sup>2</sup>): {bmi || "none"}
        </Typography>

        <Link className="!p-0" to="/settings/metrics">
          <Pencil className="!w-7 !h-7 text-muted-foreground" />
        </Link>
      </div>
      <hr className="my-4 w-full border-border dark:border-accent" />
      {bmi ? (
        <PieChart
          chartConfig={chartConfig}
          className="w-full h-[300]"
          cx="50%"
          cy="95%"
          data={chartData}
          dataKey="value"
          endAngle={0}
          innerRadius="90%"
          isAnimationActive={false}
          labelLine={false}
          nameKey="label"
          needleIndex={needlePosition}
          outerRadius="185%"
          startAngle={180}
          stroke="none"
        />
      ) : (
        <Typography variant="md-24">No data</Typography>
      )}
    </section>
  );
};

export default ReportBmi;
