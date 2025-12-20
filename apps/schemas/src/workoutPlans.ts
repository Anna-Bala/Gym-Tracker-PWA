import { z } from "zod";

export const WorkoutPlanFormExerciseSchema = z.object({
  exerciseApiId: z.string(),
  name: z.string(),
  sets: z.number(),
  reps: z.number(),
});

const WorkoutPlanApiExerciseSchema = WorkoutPlanFormExerciseSchema.omit({
  name: true,
});

export const FormWorkoutPlanSchema = z.object({
  name: z.string().trim().min(1, { message: "Workout plan name is required" }),
  description: z.string().optional(),
  exercises: z.array(WorkoutPlanFormExerciseSchema),
  primaryMuscles: z.array(z.string()),
});

export const ApiWorkoutPlanSchema = FormWorkoutPlanSchema.extend({
  exercises: z.array(WorkoutPlanApiExerciseSchema),
});

export const WorkoutPlan = z.object({
  id: z.number(),
  description: z.string().optional(),
  duration: z.number(),
  focusArea: z.array(z.enum(["arms", "back", "chest", "fullBody", "legs", "shoulders", "stomach"])),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type WorkoutPlanExercise = z.infer<typeof WorkoutPlanApiExerciseSchema>;
export type WorkoutPlan = z.infer<typeof WorkoutPlan>;
