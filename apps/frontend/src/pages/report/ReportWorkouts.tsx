import { useEffect, useMemo, useState } from "react";
import type { WorkoutHistory } from "@gym-tracker-pwa/schemas";

import { authFetch } from "@/lib/fetchClient";
import { BarChart } from "@/components/BarChart";
import { dateRangeOptions, dateRangeSelectOptions } from "./constants";
import { formatChartData, getDateRange } from "./utils";
import { formatDate } from "@/lib/utils";
import { Select } from "@/components/Select";
import { type ChartConfig } from "@/components/ui/chart";
import { Typography } from "@/components/base/Typography";
import Zzz from "@icons/zzz.svg?react";

type DateRange = (typeof dateRangeOptions)[keyof typeof dateRangeOptions];

const DEFAULT_DATE_RANGE = "6m";

const chartConfig = {
  workouts: {
    label: "workouts",
    color: "var(--chart-5)",
  },
  minutes: {
    label: "mins",
    color: "var(--chart-2)",
  },
  calories: {
    label: "kcal",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const ReportWorkouts = () => {
  const [periodOfTime, setPeriodOfTime] = useState<DateRange>(DEFAULT_DATE_RANGE);
  const [workoutPlanHistory, setWorkoutPlanHistory] = useState<WorkoutHistory[]>([]);

  useEffect(() => {
    const fetchWorkoutPlanHistory = async (periodOfTime: DateRange) => {
      const { fromDate, toDate } = getDateRange(periodOfTime);

      await authFetch(`/workout-history?from=${formatDate(fromDate)}&to=${formatDate(toDate)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }).then(async (response) => {
        const responseData = await response.json();
        setWorkoutPlanHistory(responseData);
      });
    };

    fetchWorkoutPlanHistory(periodOfTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = useMemo(() => {
    const { fromDate } = getDateRange(periodOfTime);

    const chartTimePeriodConfigs = {
      "1w": {
        count: 7,
        step: (date: Date, increment: number) => date.setDate(fromDate.getDate() + increment),
        label: (date: Date) => date.toLocaleDateString("default", { weekday: "short" }),
      },
      "1m": {
        count: 4,
        step: (date: Date, increment: number) => date.setDate(1 + increment * 7),
        label: (_: Date, increment: number) => `wk${increment + 1}`,
      },
      default: {
        count: periodOfTime === "3m" ? 3 : 6,
        step: (date: Date, increment: number) => date.setMonth(fromDate.getMonth() + increment),
        label: (date: Date) => date.toLocaleString("default", { month: "long" }),
      },
    };

    const chartTimePeriodConfig = chartTimePeriodConfigs[periodOfTime as keyof typeof chartTimePeriodConfigs] || chartTimePeriodConfigs.default;

    return Array.from({ length: chartTimePeriodConfig.count }, (_, index) => {
      const periodStart = new Date(fromDate);
      periodStart.setHours(0, 0, 0, 0);

      chartTimePeriodConfig.step(periodStart, index);

      const periodEnd = new Date(periodStart);

      if (periodOfTime === "1w") periodEnd.setHours(23, 59, 59, 999);
      else if (periodOfTime === "1m") {
        periodEnd.setDate(index === 3 ? new Date(periodEnd.getFullYear(), periodEnd.getMonth() + 1, 0).getDate() : periodStart.getDate() + 6);
      } else periodEnd.setMonth(periodEnd.getMonth() + 1, 0);

      periodEnd.setHours(23, 59, 59, 999);

      const timePeriodWorkoutHistoryEntries = workoutPlanHistory.filter(({ createdAt }) => {
        const workoutPlanHistoryEntryDate = new Date(createdAt);
        return workoutPlanHistoryEntryDate >= periodStart && workoutPlanHistoryEntryDate <= periodEnd;
      });

      return { label: chartTimePeriodConfig.label(periodStart, index), ...formatChartData(timePeriodWorkoutHistoryEntries) };
    });
  }, [periodOfTime, workoutPlanHistory]);

  return (
    <section className="flex flex-col p-2 border border-border rounded-2xl bg-gradient-to-b from-card to-muted/25 shadow-wide-xs" data-testid="workout-chart">
      <div className="flex items-center justify-between gap-3 p-3">
        <Typography className="font-semibold" variant="h4">
          Statistics
        </Typography>
        <Select className="w-[160px] xl:w-[180px]" handleValueChange={(value) => setPeriodOfTime(value as DateRange)} options={dateRangeSelectOptions} value={periodOfTime} />
      </div>
      <hr className="my-4 w-full border-border" />
      {workoutPlanHistory.length > 0 ? (
        <BarChart
          className="h-[300px] w-full !aspect-auto xl:h-[320px]"
          chartConfig={chartConfig}
          data={chartData}
          xAxisProps={{
            dataKey: "label",
            tickFormatter: (value) => value.slice(0, 3),
          }}
        />
      ) : (
        <>
          <Typography className="font-semibold text-center" variant="lg">
            Empty
          </Typography>
          <Typography className="text-center mt-2 text-muted-foreground" variant="md-20">
            You did not exercise yet
          </Typography>
          <Zzz className="!w-12 !h-12 mt-4 text-primary mx-auto" />
        </>
      )}
    </section>
  );
};

export default ReportWorkouts;
