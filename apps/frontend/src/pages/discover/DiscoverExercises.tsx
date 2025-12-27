import { useEffect, useState } from "react";
import type { Exercise } from "@gym-tracker-pwa/schemas";

import { authFetch } from "@/lib/fetchClient";
import { Loader } from "@/components/Loader";
import { MobileHeaderNavigation } from "@/components/MobileHeaderNavigation";
import ExercisesFilter from "@/components/exercises/ExercisesFilter";
import ExercisesList from "@/components/exercises/ExercisesList";

const DiscoverExercises = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);

  useEffect(() => {
    const fetchAllExercises = async () => {
      await authFetch("/exercises", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then(async (response) => {
          const responseData = await response.json();
          setExercisesList(responseData);
        })
        .finally(() => setIsLoading(false));
    };

    fetchAllExercises();
  }, []);

  return (
    <section className="flex flex-col min-h-[80vh] pt-2">
      <MobileHeaderNavigation centerText hideGoBackButton headerText="Discover exercises" />

      <ExercisesFilter setExercisesList={setExercisesList} setIsLoading={setIsLoading} />
      {isLoading ? <Loader className="m-auto" color="primary" variant="inline" isLoading={isLoading} size="lg" /> : <ExercisesList exercisesList={exercisesList} />}
    </section>
  );
};

export default DiscoverExercises;
