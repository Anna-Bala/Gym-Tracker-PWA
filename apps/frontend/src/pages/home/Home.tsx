import { useEffect, useMemo, useState } from "react";
import { CircleAlert } from "lucide-react";
import { WorkoutPlan, type WorkoutPlanDay } from "@gym-tracker-pwa/schemas";

import { Alert } from "@/components/Alert";
import { AllUserWorkoutPlans, GeneratingAiWorkoutPlan, TodayWorkoutPlans } from "./";
import { authFetch } from "@/lib/fetchClient";
import { getCurrentDayIso } from "@/lib/utils";
import { Loader } from "@/components/Loader";
import { ResponsivePageShell } from "@/components/base/ResponsivePageShell";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingAIWorkoutPlan, setIsGeneratingAIWorkoutPlan] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userWorkoutPlans, setUserWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [userWorkoutIdsHistory, setUserWorkoutIdsHistory] = useState<number[]>([]);

  const fetchUserWorkoutHistory = async () => {
    await authFetch("/workout-history", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then(async (response) => {
        const responseData = await response.json();
        const workoutPlanIds = responseData
          .filter(({ createdAt }: { createdAt: string }) => new Date(createdAt).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0))
          .map(({ workoutPlanId }: { workoutPlanId: string }) => workoutPlanId);
        setUserWorkoutIdsHistory(workoutPlanIds);
      })
      .catch(() => {
        setErrorMessage("We couldn't fetch your today's workout plans right now. Please try again in a moment.");
      });
  };

  const fetchUserWorkoutPlans = async () => {
    await authFetch("/workout-plans", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then(async (response) => {
        const responseData = await response.json();
        setUserWorkoutPlans(responseData);
      })
      .catch(() => {
        setErrorMessage("We couldn't fetch your workout plans right now. Please try again in a moment.");
      });
  };

  const handleAIWorkoutPlanCreation = async () => {
    try {
      setIsGeneratingAIWorkoutPlan(true);
      setErrorMessage("");

      await authFetch("/workout-plans/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      await fetchUserWorkoutPlans().finally(() => setIsGeneratingAIWorkoutPlan(false));
    } catch {
      setErrorMessage("Even AI needs a rest day sometimes. We couldn't generate your plan. You can still create a plan manually, or try again in a few minutes.");
    }
  };

  useEffect(() => {
    const fetchWorkoutPlansData = async () => {
      try {
        await fetchUserWorkoutPlans();
        await fetchUserWorkoutHistory();
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkoutPlansData();
  }, []);

  const todayWorkoutPlans = useMemo(
    () => userWorkoutPlans.filter(({ days }) => days.includes(getCurrentDayIso().toString() as WorkoutPlanDay)).filter(({ id }) => !userWorkoutIdsHistory.includes(id)),
    [userWorkoutPlans, userWorkoutIdsHistory]
  );

  return (
    <ResponsivePageShell contentClassName="xl:mx-auto xl:max-w-[960px]" hideMobileBackButton title="Home">
      {errorMessage && <Alert className="my-4" title="Something went wrong" description={errorMessage} icon={<CircleAlert />} variant="destructive" />}

      {isLoading ? (
        <Loader className="m-auto" color="primary" variant="inline" size="lg" isLoading={isLoading} />
      ) : (
        <>
          {isGeneratingAIWorkoutPlan ? (
            <div className="xl:max-w-[720px] xl:mx-auto xl:w-full">
              <GeneratingAiWorkoutPlan isGeneratingAIWorkoutPlan={isGeneratingAIWorkoutPlan} />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {userWorkoutPlans.length > 0 && (
                <div>
                  <TodayWorkoutPlans todayWorkoutPlans={todayWorkoutPlans} fetchUserWorkoutHistory={fetchUserWorkoutHistory} />
                </div>
              )}
              <div>
                <AllUserWorkoutPlans userWorkoutPlans={userWorkoutPlans} handleAIWorkoutPlanCreation={handleAIWorkoutPlanCreation} />
              </div>
            </div>
          )}
        </>
      )}
    </ResponsivePageShell>
  );
};

export default Home;
