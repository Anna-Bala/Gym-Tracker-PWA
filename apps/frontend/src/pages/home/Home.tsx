import { useEffect, useMemo, useState } from "react";
import { CircleAlert } from "lucide-react";
import { WorkoutPlan, type WorkoutPlanDay } from "@gym-tracker-pwa/schemas";

import { Alert } from "@/components/Alert";
import { AllUserWorkoutPlans, TodayWorkoutPlans } from "./";
import { authFetch } from "@/lib/fetchClient";
import { Loader } from "@/components/Loader";
import { MobileHeaderNavigation } from "@/components/MobileHeaderNavigation";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
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
        const workoutPlanIds = responseData.map(({ workoutPlanId }: { workoutPlanId: string }) => workoutPlanId);
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
    () =>
      userWorkoutIdsHistory.length === 0
        ? []
        : userWorkoutPlans.filter(({ days }) => days.includes(new Date().getDay().toString() as WorkoutPlanDay)).filter(({ id }) => !userWorkoutIdsHistory.includes(id)),
    [userWorkoutPlans, userWorkoutIdsHistory]
  );

  return (
    <section className="flex flex-col min-h-[90vh] pb-24">
      <MobileHeaderNavigation centerText hideGoBackButton headerText="Gym Tracker" />

      {errorMessage && <Alert className="mt-4" title="Workout plans failed to load" description={errorMessage} icon={<CircleAlert />} variant="destructive" />}

      {isLoading ? (
        <Loader className="m-auto" color="primary" variant="inline" size="lg" isLoading={isLoading} />
      ) : (
        <>
          <TodayWorkoutPlans todayWorkoutPlans={todayWorkoutPlans} fetchUserWorkoutHistory={fetchUserWorkoutHistory} />
          <AllUserWorkoutPlans userWorkoutPlans={userWorkoutPlans} />
        </>
      )}
    </section>
  );
};

export default Home;
