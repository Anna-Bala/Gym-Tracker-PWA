import { FullOnboarding } from "@gym-tracker-pwa/schemas";

const activityMultipliers = {
  sedentary: 1.0,
  light: 1.12,
  moderate: 1.25,
  highly: 1.4,
  athlete: 1.55,
};

export const calculateWorkoutPlanCalories = (activityLevel: FullOnboarding["activityLevel"], age: number, gender: "M" | "F", height: number, weight: number, workoutPlanDuration: number) => {
  let bmr;
  if (gender === "M") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const workoutPlanDurationMins = workoutPlanDuration / 60;
  const metModifier = activityMultipliers[activityLevel];
  const met = 5.0 * metModifier;

  const totalBurnedDuringWorkout = ((met * 3.5 * weight) / 200) * workoutPlanDurationMins;

  const bmrPerMinute = bmr / 1440;
  const bmrDuringWorkout = bmrPerMinute * workoutPlanDurationMins;

  return Math.round(totalBurnedDuringWorkout + bmrDuringWorkout);
};
