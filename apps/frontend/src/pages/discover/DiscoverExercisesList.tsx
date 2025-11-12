import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Exercise } from "@gym-tracker-pwa/schemas";

import { Typography } from "@/components/base/Typography";
import Badge from "@/components/ui/badge";
import DiscoverExercisesDetails from "./DiscoverExercisesDetails";

interface DiscoverExercisesListProps {
  exercisesList: Exercise[];
}

const DiscoverExercisesList = ({ exercisesList }: DiscoverExercisesListProps) => {
  const [exerciseDetails, setExerciseDetails] = useState<Exercise>();
  const [isExercisePanelOpen, setIsExercisePanelOpen] = useState(false);

  const toggleExercisePanelOpen = () => setIsExercisePanelOpen((prevState) => !prevState);

  return (
    <>
      {exerciseDetails ? (
        <DiscoverExercisesDetails
          exerciseDetails={exerciseDetails}
          isExercisePanelOpen={isExercisePanelOpen}
          setIsExercisePanelOpen={setIsExercisePanelOpen}
          toggleExercisePanelOpen={toggleExercisePanelOpen}
        />
      ) : null}
      <div className="flex flex-col mt-4 gap-3">
        {exercisesList.map((exercise) => (
          <button
            className="flex flex-row items-center bg-card border border-border py-3 px-2 rounded-md justify-between"
            onClick={() => {
              setExerciseDetails(exercise);
              toggleExercisePanelOpen();
            }}
            key={exercise.id}
          >
            <img alt={exercise.name} src={exercise.image} className="w-16 h-16" />
            <div className="flex flex-1 flex-col gap-2 ml-2">
              <Typography className="font-medium text-left text-card-foreground" variant="sm-20">
                {exercise.name}
              </Typography>
              <div className="flex flex-wrap gap-1">
                {exercise.primaryMuscles?.map(({ name }) => (
                  <Badge key={name}>{name}</Badge>
                ))}
                {exercise.secondaryMuscles?.map(({ name }) => (
                  <Badge variant="secondary" key={name}>
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
            <ChevronRight className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </>
  );
};

export default DiscoverExercisesList;
