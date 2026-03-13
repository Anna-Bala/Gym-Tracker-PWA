import { useEffect, useState } from "react";
import type { Exercise } from "@gym-tracker-pwa/schemas";

import { authFetch } from "@/lib/fetchClient";
import { Button } from "@/components/ui";
import { Drawer } from "@/components/Drawer";
import { Loader } from "@/components/Loader";
import { SectionCard } from "@/components/base/SectionCard";
import { Typography } from "@/components/base/Typography";
import ExercisesFilter from "@/components/exercises/ExercisesFilter";
import ExercisesList from "@/components/exercises/ExercisesList";
import ExercisesDetailsFooter from "./ExercisesDetailsFooter";

interface WorkoutPlanExercisesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WorkoutPlanExercisesDrawer = ({ isOpen, onClose }: WorkoutPlanExercisesDrawerProps) => {
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
    <Drawer isOpen={isOpen} onAnimationEnd={onClose}>
      <div className="flex flex-row justify-between w-full">
        <Typography className="font-semibold" variant="h3">
          Add exercise
        </Typography>
        <Button className="pr-0 text-muted-foreground lg:pr-4" variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      <ExercisesFilter setExercisesList={setExercisesList} setIsLoading={setIsLoading} />
      <div
        className="flex w-full flex-col overflow-y-scroll mb-2 mt-4"
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <Loader className="m-auto" color="primary" variant="inline" isLoading={isLoading} size="lg" />
        ) : (
          <SectionCard className="border-0 bg-transparent p-0 shadow-none">
            <ExercisesList exercisesList={exercisesList} exerciseDetailsFooterContent={ExercisesDetailsFooter} />
          </SectionCard>
        )}
      </div>
    </Drawer>
  );
};

export default WorkoutPlanExercisesDrawer;
