import { type ChartConfig } from "@/components/ui/chart";
import { Typography } from "@/components/base/Typography";
import { PieChart } from "@/components/PieChart";

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

const ReportBmi = () => {
  return (
    <section className="flex flex-col py-2 px-2 border border-border rounded-md">
      <div className="flex justify-between p-3">
        <Typography className="font-semibold" variant="h4">
          BMI (kg/m2): XXX
        </Typography>
      </div>
      <hr className="my-4 w-full border-border dark:border-accent" />
      <PieChart
        showNeedle
        isAnimationActive={false}
        className="w-full h-[300]"
        chartConfig={chartConfig}
        data={chartData}
        labelLine={false}
        dataKey="value"
        nameKey="label"
        startAngle={180}
        endAngle={0}
        cx="50%"
        cy="95%"
        innerRadius="90%"
        outerRadius="185%"
        stroke="none"
      />
    </section>
  );
};

export default ReportBmi;
