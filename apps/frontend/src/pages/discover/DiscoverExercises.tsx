import { useEffect, useState } from "react";
import type { Exercise } from "@gym-tracker-pwa/schemas";

import { authFetch } from "@/lib/fetchClient";
import { Loader } from "@/components/Loader";
import { ResponsivePageShell } from "@/components/base/ResponsivePageShell";
import { Typography } from "@/components/base/Typography";
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
    <ResponsivePageShell contentClassName="xl:mx-auto xl:max-w-[960px]" hideMobileBackButton title="Discover exercises">
      <div className="flex flex-col gap-6">
        <aside className="xl:rounded-2xl xl:p-4">
          <Typography className="font-semibold" variant="h4">
            Find exercises
          </Typography>
          <Typography className="mt-1 text-muted-foreground" variant="sm-20">
            Search by name and refine by muscle, category, or movement type.
          </Typography>
          <div className="xl:mt-4">
            <ExercisesFilter setExercisesList={setExercisesList} setIsLoading={setIsLoading} />
          </div>
        </aside>
        <div>{isLoading ? <Loader className="m-auto" color="primary" variant="inline" isLoading={isLoading} size="lg" /> : <ExercisesList exercisesList={exercisesList} />}</div>
      </div>
    </ResponsivePageShell>
  );
};

export default DiscoverExercises;
