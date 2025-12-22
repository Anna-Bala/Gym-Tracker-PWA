import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { type ExerciseDetails, type Exercise } from "@gym-tracker-pwa/schemas";

import { Typography } from "@/components/base/Typography";
import Badge from "@/components/ui/badge";
import ExercisesDetails from "./ExercisesDetails";

interface ExercisesListProps {
  exercisesList: Exercise[] | ExerciseDetails[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exerciseDetailsFooterContent?: React.ComponentType<any>;
}

const isWorkoutPlanExercise = (exercise: Exercise | ExerciseDetails): exercise is ExerciseDetails => {
  return "sets" in exercise && "reps" in exercise;
};

const ExercisesList = ({ exercisesList, exerciseDetailsFooterContent }: ExercisesListProps) => {
  const [exerciseDetails, setExerciseDetails] = useState<Exercise | ExerciseDetails>();
  const [isExercisePanelOpen, setIsExercisePanelOpen] = useState(false);

  const toggleExercisePanelOpen = () => setIsExercisePanelOpen((prevState) => !prevState);

  return (
    <>
      {exerciseDetails ? (
        <ExercisesDetails
          exerciseDetails={exerciseDetails}
          footerContent={exerciseDetailsFooterContent}
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
              {isWorkoutPlanExercise(exercise) ? (
                <div className="flex gap-2">
                  <Typography className="font-light text-left text-card-foreground" variant="sm-20">
                    Sets: {exercise.sets}
                  </Typography>

                  <Typography className="font-light text-left text-card-foreground" variant="sm-20">
                    Reps: {exercise.reps}
                  </Typography>
                </div>
              ) : (
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
              )}
            </div>
            <ChevronRight className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </>
  );
};

export default ExercisesList;
