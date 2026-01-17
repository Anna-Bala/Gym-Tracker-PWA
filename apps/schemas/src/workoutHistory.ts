import { z } from "zod";

export const WorkoutHistoryCreationSchema = z.object({
  workoutPlanId: z.number(),
});

export const WorkoutPlanHistoryDetailsSchema = z.object({
  id: z.number(),
  ai: z.boolean(),
  focusArea: z.array(z.enum(["arms", "back", "chest", "fullBody", "legs", "shoulders", "stomach"])),
  name: z.string(),
});

export const WorkoutHistorySchema = z.object({
  id: z.number(),
  userId: z.number(),
  calories: z.number(),
  duration: z.number(),
  workoutPlanId: z.number(),
  workoutPlan: WorkoutPlanHistoryDetailsSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type WorkoutHistory = z.infer<typeof WorkoutHistorySchema>;
export type WorkoutPlanHistoryDetails = z.infer<typeof WorkoutPlanHistoryDetailsSchema>;
