import { z } from "zod";

export const WorkoutHistoryCreationSchema = z.object({
  workoutPlanId: z.number(),
});

export const WorkoutHistorySchema = z.object({
  id: z.number(),
  userId: z.number(),
  workoutPlanId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
