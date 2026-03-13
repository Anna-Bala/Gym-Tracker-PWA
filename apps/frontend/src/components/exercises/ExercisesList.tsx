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
            className="surface-card flex flex-row items-center justify-between gap-3 p-3 text-left transition-colors duration-200 hover:border-primary/50 hover:bg-primary/[0.05] hover:cursor-pointer md:px-4"
            onClick={() => {
              setExerciseDetails(exercise);
              toggleExercisePanelOpen();
            }}
            key={exercise.id}
          >
            <img alt={exercise.name} src={exercise.image} className="h-18 w-18 invert-80 rounded-lg bg-foreground/10 object-cover p-1 dark:invert-0 dark:bg-muted/40" />
            <div className="flex flex-1 flex-col ml-1 gap-2">
              <Typography className="font-semibold text-left text-card-foreground" variant="sm-20">
                {exercise.name}
              </Typography>
              {isWorkoutPlanExercise(exercise) ? (
                <div className="flex gap-2">
                  <Typography className="font-normal text-left text-muted-foreground" variant="sm-20">
                    Sets: {exercise.sets}
                  </Typography>

                  <Typography className="font-normal text-left text-muted-foreground" variant="sm-20">
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
            <ChevronRight className="text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    </>
  );
};

export default ExercisesList;
