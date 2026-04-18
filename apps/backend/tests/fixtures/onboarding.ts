import type { Onboarding } from "@prisma/client";

export const onboarding: Onboarding = {
  id: 1,
  userId: 1,
  activityLevel: "moderate",
  fitnessLevel: "intermediate",
  focusArea: ["chest"],
  gender: "M",
  age: 25,
  days: 4,
  height: 180,
  weight: 80,
  workoutGoal: "buildMuscle",
  restTime: 60,
};
