import { z } from "zod";

export const UserStatisticsSchema = z.object({
  height: z.number(),
  weight: z.number(),
});

export type UserStatistics = z.infer<typeof UserStatisticsSchema>;
