import { Fragment, useEffect, useState } from "react";
import type { WorkoutHistory } from "@gym-tracker-pwa/schemas";

import { authFetch } from "@/lib/fetchClient";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/lib/utils";
import { MobileHeaderNavigation } from "@/components/MobileHeaderNavigation";
import { Typography } from "@/components/base/Typography";
import { WorkoutPlanItem } from "@/components/WorkoutPlanItem";
import Fire from "@icons/fire.svg?react";
import Timer from "@icons/timer.svg?react";
import Zzz from "@icons/zzz.svg?react";

const History = () => {
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [workoutPlanHistory, setWorkoutPlanHistory] = useState<WorkoutHistory[]>([]);
  const [selectedDayWorkoutHistoryEntry, setSelectedDayWorkoutHistoryEntry] = useState<WorkoutHistory[]>([]);

  const fetchWorkoutPlanHistory = async (monthDate: Date) => {
    const firstDayOfTheMonth = formatDate(new Date(monthDate.getFullYear(), monthDate.getMonth(), 1));
    const lastDayOfTheMonth = formatDate(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0));

    await authFetch(`/workout-history?from=${firstDayOfTheMonth}&to=${lastDayOfTheMonth}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }).then(async (response) => {
      const responseData = await response.json();
      setWorkoutPlanHistory(responseData);

      const todaysWorkoutPlans = responseData?.filter(({ createdAt }: { createdAt: string }) => formatDate(new Date(createdAt)) === formatDate(new Date()));
      setSelectedDayWorkoutHistoryEntry(todaysWorkoutPlans);
    });
  };

  useEffect(() => {
    fetchWorkoutPlanHistory(calendarDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!calendarDate) return;

    const selectedDayWorkoutPlans = workoutPlanHistory?.filter(({ createdAt }: { createdAt: string }) => formatDate(new Date(createdAt)) === formatDate(calendarDate));
    setSelectedDayWorkoutHistoryEntry(selectedDayWorkoutPlans);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarDate]);

  const dayStatistics = [
    {
      statistic: Math.round(selectedDayWorkoutHistoryEntry.reduce((totalSeconds, workout) => totalSeconds + (isNaN(workout.duration) ? 0 : workout.duration), 0) / 60),
      Icon: Timer,
      suffix: "min",
    },
    {
      statistic: selectedDayWorkoutHistoryEntry.reduce((totalCalories, workout) => totalCalories + (isNaN(workout.calories) ? 0 : workout.calories), 0),
      Icon: Fire,
      suffix: "kcal",
    },
  ];

  const calendarWorkoutPlanDates = workoutPlanHistory?.map((workoutPlan) => new Date(workoutPlan.createdAt));

  return (
    <section className="flex flex-col pb-24">
      <MobileHeaderNavigation centerText hideGoBackButton headerText="History" />

      <Calendar
        className="mt-6 w-full rounded-md border"
        mode="single"
        modifiers={{ hasEvent: calendarWorkoutPlanDates }}
        onMonthChange={fetchWorkoutPlanHistory}
        onSelect={setCalendarDate}
        required
        selected={calendarDate}
        showOutsideDays={false}
      />
      <div className="w-full border rounded-md mt-4 p-3 bg-card">
        <div className="flex w-full items-center justify-between">
          <Typography className="font-semibold" variant="md-20">
            {calendarDate?.toLocaleDateString("en-US", { month: "short", day: "2-digit", weekday: "short" })}
          </Typography>
          <div className="flex items-center gap-1">
            {dayStatistics.map(({ Icon, statistic, suffix }) => (
              <Fragment key={suffix}>
                <Icon className="w-6 h-6 text-chart-2 stroke-2" />
                <Typography variant="sm-20">
                  {statistic} {suffix}
                </Typography>
              </Fragment>
            ))}
          </div>
        </div>
        <hr className="my-4 w-full border-border dark:border-accent" />
        {selectedDayWorkoutHistoryEntry.length === 0 ? (
          <>
            <Typography className="font-semibold text-center" variant="lg">
              Empty
            </Typography>
            <Typography className="text-center mt-2 text-muted-foreground" variant="md-20">
              You did not exercise on this date
            </Typography>
            <Zzz className="!w-12 !h-12  mt-4 text-primary mx-auto" />
          </>
        ) : (
          <div className="flex flex-col gap-2">
            {selectedDayWorkoutHistoryEntry.map((workoutHistoryEntry) => (
              <WorkoutPlanItem
                className="border-border dark:border-accent"
                workoutPlan={{ ...workoutHistoryEntry.workoutPlan, calories: workoutHistoryEntry.calories, duration: workoutHistoryEntry.duration }}
                variant="default"
                key={workoutHistoryEntry.id}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default History;
