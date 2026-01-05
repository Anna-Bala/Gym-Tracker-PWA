import { useEffect, useMemo, useState } from "react";
import { CircleAlert } from "lucide-react";
import { WorkoutPlan, type WorkoutPlanDay } from "@gym-tracker-pwa/schemas";

import { Alert } from "@/components/Alert";
import { AllUserWorkoutPlans, GeneratingAiWorkoutPlan, TodayWorkoutPlans } from "./";
import { authFetch } from "@/lib/fetchClient";
import { getCurrentDayIso } from "@/lib/utils";
import { Loader } from "@/components/Loader";
import { MobileHeaderNavigation } from "@/components/MobileHeaderNavigation";

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
    <section className="flex flex-col min-h-[90vh] pb-24">
      <MobileHeaderNavigation centerText hideGoBackButton headerText="Gym Tracker" />

      {errorMessage && <Alert className="mt-4" title="Something went wrong" description={errorMessage} icon={<CircleAlert />} variant="destructive" />}

      {isLoading ? (
        <Loader className="m-auto" color="primary" variant="inline" size="lg" isLoading={isLoading} />
      ) : (
        <>
          {isGeneratingAIWorkoutPlan ? (
            <GeneratingAiWorkoutPlan isGeneratingAIWorkoutPlan={isGeneratingAIWorkoutPlan} />
          ) : (
            <>
              {userWorkoutPlans.length > 0 && <TodayWorkoutPlans todayWorkoutPlans={todayWorkoutPlans} fetchUserWorkoutHistory={fetchUserWorkoutHistory} />}
              <AllUserWorkoutPlans userWorkoutPlans={userWorkoutPlans} handleAIWorkoutPlanCreation={handleAIWorkoutPlanCreation} />
            </>
          )}
        </>
      )}
    </section>
  );
};

export default Home;
