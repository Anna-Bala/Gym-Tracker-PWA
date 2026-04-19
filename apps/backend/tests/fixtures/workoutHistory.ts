import type { WorkoutHistory } from "@prisma/client";

export const workoutHistory: WorkoutHistory = {
  id: 1,
  userId: 1,
  workoutPlanId: 1,
  calories: 450,
  duration: 3600,
  createdAt: new Date("2026-01-01T10:00:00Z"),
  updatedAt: new Date("2026-01-01T12:30:00Z"),
};
