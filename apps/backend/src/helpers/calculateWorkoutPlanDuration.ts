import { WorkoutPlanExercise } from "@gym-tracker-pwa/schemas";

const SECONDS_PER_REP = 3;

export const calculateWorkoutPlanDuration = (exercises: WorkoutPlanExercise[]) =>
  Math.floor(
    exercises.reduce((totalSeconds, exercise) => {
      const singleExerciseDuration = exercise.sets * exercise.reps * SECONDS_PER_REP;
      return totalSeconds + singleExerciseDuration;
    }, 0)
  );
