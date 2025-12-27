import { WorkoutPlanExercise } from "@gym-tracker-pwa/schemas";

const SECONDS_PER_REP = 4;

export const calculateWorkoutPlanDuration = (exercises: WorkoutPlanExercise[], restTime: number) =>
  Math.floor(
    exercises.reduce((totalSeconds, exercise) => {
      const singleExerciseDuration = ((exercise.sets * exercise.reps * SECONDS_PER_REP) + ((exercise.sets - 1) * restTime));
      return totalSeconds + singleExerciseDuration;
    }, 0)
  );
