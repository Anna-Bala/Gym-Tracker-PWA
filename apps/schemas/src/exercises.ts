import { z } from "zod";

export const FilterExercisesSchema = z.object({
  categories: z.array(z.enum(["body_weight", "cable", "free_weight", "machine"])).optional(),
  muscles: z
    .array(z.enum(["abductors", "abs", "adductors", "back", "biceps", "calves", "chest", "forearms", "glutes", "hamstrings", "obliques", "quadriceps", "shoulders", "trapezius", "triceps"]))
    .optional(),
  types: z.array(z.enum(["isolation", "polyarticular"])).optional(),
});

export const SearchExercisesSchema = z.object({
  name: z.string().optional(),
});

export const ExerciseSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  primaryMuscles: z.array(z.object({ id: z.string(), code: z.string(), name: z.string() })).optional(),
  secondaryMuscles: z.array(z.object({ id: z.string(), code: z.string(), name: z.string() })).optional(),
  types: z.array(z.object({ id: z.string(), code: z.string(), name: z.string() })).optional(),
  categories: z.array(z.object({ id: z.string(), code: z.string(), name: z.string() })).optional(),
});

export const ExerciseDetailsSchema = ExerciseSchema.extend({
  exerciseApiId: z.string(),
  reps: z.number(),
  sets: z.number(),
  workoutPlanId: z.number(),
});

export type Exercise = z.infer<typeof ExerciseSchema>;
export type ExerciseDetails = z.infer<typeof ExerciseDetailsSchema>;
export type FilterExercises = z.infer<typeof FilterExercisesSchema>;
