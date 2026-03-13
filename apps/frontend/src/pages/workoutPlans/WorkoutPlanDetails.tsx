import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { type WorkoutPlanDetails as WorkouPlan } from "@gym-tracker-pwa/schemas";

import { AddWorkoutToCalendar } from "@/components/AddWorkoutToCalendar";
import { authFetch } from "@/lib/fetchClient";
import { daysOptions } from "./constants";
import { formatFocusArea } from "@/lib/utils";
import { Loader } from "@/components/Loader";
import { ResponsivePageShell } from "@/components/base/ResponsivePageShell";
import { Typography } from "@/components/base/Typography";
import ExercisesList from "@/components/exercises/ExercisesList";
import Fire from "@icons/fire.svg?react";
import PersonRunning from "@icons/person-running.svg?react";
import Timer from "@icons/timer.svg?react";
import WorkoutPlanContextMenu from "./WorkoutPlanContextMenu";

const daysMapped = Object.fromEntries(daysOptions.map((day) => [day.value, day.label]));

const WorkoutPlanDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [workoutPlanDetails, setWorkoutPlanDetails] = useState<WorkouPlan>();

  const { id } = useParams();

  useEffect(() => {
    const fetchWorkoutPlanDetails = async () => {
      await authFetch(`/workout-plans/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then(async (response) => {
          const responseData = await response.json();
          setWorkoutPlanDetails(responseData);
        })
        .finally(() => setIsLoading(false));
    };

    fetchWorkoutPlanDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const workoutPlanColumns = [
    {
      Icon: PersonRunning,
      amount: workoutPlanDetails?.exercises?.length || 0,
      label: "exercises",
    },
    {
      Icon: Timer,
      amount: Math.round((workoutPlanDetails?.duration || 0) / 60),
      label: "minutes",
    },
    {
      Icon: Fire,
      amount: workoutPlanDetails?.calories || 0,
      label: "kcal",
    },
  ];

  return (
    <ResponsivePageShell title={workoutPlanDetails?.name}>
      <Loader variant="full-screen" isLoading={isLoading} color="white" />

      <div className="flex flex-col">
        <div className="flex flex-col gap-4 xl:rounded-2xl xl:top-24">
          {workoutPlanDetails ? (
            <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl border border-border/80 bg-card/90 shadow-compact-xs">
              <div className="flex flex-col gap-2 w-full">
                {workoutPlanDetails?.description ? (
                  <div className="flex flex-col gap-2">
                    <Typography className="font-semibold" variant="h4">
                      Overview
                    </Typography>
                    <Typography className="text-muted-foreground" variant="md-24">
                      {workoutPlanDetails.description}
                    </Typography>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <Typography variant="lg">Plan Schedule:</Typography>
                  <Typography className="text-muted-foreground" variant="md-24">
                    {workoutPlanDetails?.days.map((day) => daysMapped[day]).join(", ")}
                  </Typography>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Typography variant="lg">Focus Areas:</Typography>
                  <Typography className="text-muted-foreground" variant="md-24">
                    {formatFocusArea(workoutPlanDetails?.focusArea)}
                  </Typography>
                </div>
              </div>

              <AddWorkoutToCalendar
                className="mt-0 flex-1 sm:flex-none"
                calendarEventName={workoutPlanDetails.name}
                calendarEventDescription={workoutPlanDetails.description}
                workoutDays={workoutPlanDetails.days}
              />
              <WorkoutPlanContextMenu workoutPlanDetails={workoutPlanDetails} />
            </div>
          ) : null}

          <div className="flex justify-between p-3 border border-border rounded-2xl bg-gradient-to-b from-card to-muted/25 shadow-wide-xs">
            {workoutPlanColumns.map(({ amount, Icon, label }) => (
              <div className="flex flex-col flex-1 items-center gap-1" key={label}>
                <Icon className="w-8 h-8 text-muted-foreground stroke-2" />
                <Typography className="font-semibold" variant="sm-16">
                  {amount}
                </Typography>
                <Typography className="text-muted-foreground" variant="sm-16">
                  {label}
                </Typography>
              </div>
            ))}
          </div>
        </div>

        <ExercisesList exercisesList={workoutPlanDetails?.exercises || []} />
      </div>
    </ResponsivePageShell>
  );
};

export default WorkoutPlanDetails;
