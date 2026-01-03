import { z } from "zod";

export const UserStatisticsSchema = z.object({
  totalCalories: z.number(),
  totalDuration: z.number(),
  totalWorkouts: z.number(),
  height: z.number(),
  weight: z.number(),
});

export type UserStatistics = z.infer<typeof UserStatisticsSchema>;
