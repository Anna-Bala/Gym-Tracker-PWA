import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { type WorkoutPlanDetails as WorkouPlan } from "@gym-tracker-pwa/schemas";

import { authFetch } from "@/lib/fetchClient";
import { daysOptions } from "./constants";
import { Loader } from "@/components/Loader";
import { MobileHeaderNavigation } from "@/components/MobileHeaderNavigation";
import { Typography } from "@/components/base/Typography";
import ExercisesList from "@/components/exercises/ExercisesList";
import PersonRunning from "@icons/person-running.svg?react";
import Timer from "@icons/timer.svg?react";

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
      amount: (workoutPlanDetails?.duration || 0) / 60,
      label: "minutes",
    },
  ];

  return (
    <section className="flex flex-col pb-24">
      <Loader variant="full-screen" isLoading={isLoading} color="white" />
      {workoutPlanDetails?.name ? <MobileHeaderNavigation centerText headerText={workoutPlanDetails.name} /> : null}
      {workoutPlanDetails?.description && (
        <Typography className="w-full text-center mt-2" variant="sm-20">
          {workoutPlanDetails?.description}
        </Typography>
      )}

      <div className="flex flex-wrap gap-2 mt-6">
        <Typography variant="lg">Plan Schedule:</Typography>
        <Typography className="text-muted-foreground" variant="md-24">
          {workoutPlanDetails?.days.map((day) => daysMapped[day]).join(", ")}
        </Typography>
      </div>

      <div className="flex justify-between py-2 px-3 border border-border rounded-md mt-4">
        {workoutPlanColumns.map(({ amount, Icon, label }) => (
          <div className="flex flex-col flex-1 items-center gap-1" key={label}>
            <Icon className="w-8 h-8 text-chart-2 stroke-2" />
            <Typography className="font-semibold" variant="sm-16">
              {amount}
            </Typography>
            <Typography className="text-muted-foreground" variant="sm-16">
              {label}
            </Typography>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1 mt-6">
        <Typography variant="lg">Exercises</Typography>
        <Typography className="text-muted-foreground" variant="md-24">
          Focus areas: {workoutPlanDetails?.focusArea.join(" / ")}
        </Typography>
      </div>

      <ExercisesList exercisesList={workoutPlanDetails?.exercises || []} />
    </section>
  );
};

export default WorkoutPlanDetails;
