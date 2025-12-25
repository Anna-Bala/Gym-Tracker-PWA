import { useState } from "react";
import { CircleAlert } from "lucide-react";
import { toast } from "sonner";
import { WorkoutPlan } from "@gym-tracker-pwa/schemas";

import { Alert } from "@/components/Alert";
import { authFetch } from "@/lib/fetchClient";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/Loader";
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
      .finally(() => setIsLoading(true));
  };

  return (
    <>
      <div className="w-full flex justify-between items-center mt-6">
        <Typography className="w-full font-semibold" variant="h4">
          Today's Workout Plan
        </Typography>
      </div>

      {isError ? (
        <Alert
          className="mt-4"
          title="Workout not saved"
          description="We couldn't save your workout as completed right now. Please try again in a moment."
          icon={<CircleAlert />}
          variant="destructive"
        />
      ) : null}

      {todayWorkoutPlans.length > 0 ? (
        <div className="flex flex-col w-full gap-2 mt-3">
          {todayWorkoutPlans.map((todayWorkoutPlan) => (
            <WorkoutPlanItem workoutPlan={todayWorkoutPlan} variant="primary" key={todayWorkoutPlan.id}>
              <Button className="w-full mt-3" size="icon" disabled={isLoading} onClick={(event) => handleMarkAsCompleted(event, todayWorkoutPlan.id)}>
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
        <>
          <Zzz className="!w-16 !h-16 mt-4 text-primary mx-auto" />
          <Typography className="w-full text-center font-normal text-muted-foreground mt-2" variant="md-20">
            You do not have any workout scheduled for today
          </Typography>
        </>
      )}
    </>
  );
};

export default TodayWorkoutPlans;
