import { useState } from "react";
import { CircleAlert } from "lucide-react";
import { toast } from "sonner";
import { WorkoutPlan } from "@gym-tracker-pwa/schemas";

import { Alert } from "@/components/Alert";
import { authFetch } from "@/lib/fetchClient";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/base/EmptyState";
import { Loader } from "@/components/Loader";
import { SectionCard } from "@/components/base/SectionCard";
import { SectionHeader } from "@/components/base/SectionHeader";
import { Typography } from "@/components/base/Typography";
import { WorkoutPlanItem } from "@/components/WorkoutPlanItem";
import Checkmark from "@icons/checkmark.svg?react";
import Zzz from "@icons/zzz.svg?react";

interface TodayWorkoutPlanProps {
  fetchUserWorkoutHistory: () => Promise<void>;
  todayWorkoutPlans: WorkoutPlan[];
}

const TodayWorkoutPlans = ({ fetchUserWorkoutHistory, todayWorkoutPlans }: TodayWorkoutPlanProps) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsCompleted = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, workoutPlanId: number) => {
    event.preventDefault();
    setIsError(false);
    setIsLoading(true);

    await authFetch("/workout-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ workoutPlanId }),
    })
      .then(async () => {
        await fetchUserWorkoutHistory();
        toast.success("Today's workout has been logged successfully.");
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  };

  return (
    <SectionCard className="mt-6" tone={todayWorkoutPlans.length > 0 ? "accent" : "muted"}>
      <SectionHeader title="Today's Workout Plan" />

      {isError ? (
        <Alert
          className="my-4"
          title="Workout not saved"
          description="We couldn't save your workout as completed right now. Please try again in a moment."
          icon={<CircleAlert />}
          variant="destructive"
        />
      ) : null}

      {todayWorkoutPlans.length > 0 ? (
        <div className="flex w-full flex-col gap-3 mt-5">
          {todayWorkoutPlans.map((todayWorkoutPlan) => (
            <WorkoutPlanItem workoutPlan={todayWorkoutPlan} variant="primary" key={todayWorkoutPlan.id}>
              <Button className="w-full mt-3 md:mt-0 md:min-w-44" disabled={isLoading} onClick={(event) => handleMarkAsCompleted(event, todayWorkoutPlan.id)}>
                <>
                  <Typography className="font-semibold" variant="md-20">
                    Mark as completed
                  </Typography>
                  {isLoading ? <Loader color="white" variant="inline" size="sm" isLoading={isLoading} /> : <Checkmark className="!w-6 !h-6" />}
                </>
              </Button>
            </WorkoutPlanItem>
          ))}
        </div>
      ) : (
        <EmptyState className="mt-5" icon={<Zzz />} title="Nothing scheduled today" description="You do not have any workout scheduled for today." />
      )}
    </SectionCard>
  );
};

export default TodayWorkoutPlans;
