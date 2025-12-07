import { useEffect, useState } from "react";
import type { Exercise } from "@gym-tracker-pwa/schemas";

import { API_ENDPOINT_PREFIX } from "@/secrets";
import { Loader } from "@/components/Loader";
import { Typography } from "@/components/base/Typography";
import DiscoverExercisesFilter from "./DiscoverExercisesFilter";
import DiscoverExercisesList from "./DiscoverExercisesList";

const DiscoverExercises = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);

  useEffect(() => {
    const fetchAllExercises = async () => {
      await fetch(`${API_ENDPOINT_PREFIX}/exercises`, {
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
    <section className="flex flex-col h-[80vh] pt-2">
      <Typography className="w-full text-center font-semibold" variant="h2">
        Discover exercises
      </Typography>
      <DiscoverExercisesFilter setExercisesList={setExercisesList} setIsLoading={setIsLoading} />
      {isLoading ? <Loader className="m-auto" color="primary" variant="inline" isLoading={isLoading} size="lg" /> : <DiscoverExercisesList exercisesList={exercisesList} />}
    </section>
  );
};

export default DiscoverExercises;
