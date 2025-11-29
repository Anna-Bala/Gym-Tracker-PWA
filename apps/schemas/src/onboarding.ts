import { z } from "zod";

export const OnboardingStepActivityLevelSchema = z.object({
  activityLevel: z.enum(["sedentary", "light", "moderate", "highly", "athlete"]),
});

export const OnboardingStepFitnessLevelSchema = z.object({
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced", "athlete"]),
});

export const OnboardingStepFocusAreaSchema = z.object({
  focusArea: z
    .array(z.enum(["arms", "back", "chest", "fullBody", "legs", "shoulders", "stomach"]))
    .min(1)
    .max(7),
});

export const OnboardingStepGenderSchema = z.object({
  gender: z.enum(["M", "F"]),
});

export const OnboardingStepAgeSchema = z.object({
  age: z.number().positive(),
});

export const OnboardingStepDaysSchema = z.object({
  days: z.number().positive(),
});

export const OnboardingStepHeightSchema = z.object({
  height: z.number().positive(),
});

export const OnboardingStepWeightSchema = z.object({
  weight: z.number().positive(),
});

export const OnboardingStepWorkoutGoalSchema = z.object({
  workoutGoal: z.enum(["loseWeight", "buildMuscle", "stayFit"]),
});

export const FullOnboardingSchema = z.object({
  ...OnboardingStepActivityLevelSchema.shape,
  ...OnboardingStepFitnessLevelSchema.shape,
  ...OnboardingStepFocusAreaSchema.shape,
  ...OnboardingStepGenderSchema.shape,
  ...OnboardingStepAgeSchema.shape,
  ...OnboardingStepDaysSchema.shape,
  ...OnboardingStepHeightSchema.shape,
  ...OnboardingStepWeightSchema.shape,
  ...OnboardingStepWorkoutGoalSchema.shape,
});

export const BodyMetricsSchema = z.object({
  ...OnboardingStepGenderSchema.shape,
  ...OnboardingStepAgeSchema.shape,
  ...OnboardingStepHeightSchema.shape,
  ...OnboardingStepWeightSchema.shape,
});
