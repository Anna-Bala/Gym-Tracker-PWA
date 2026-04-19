import type { WorkoutPlan } from "@prisma/client";

export const workoutPlan: WorkoutPlan = {
  id: 1,
  userId: 1,
  name: "Full Body Strength",
  description: "Balanced strength routine",
  ai: false,
  days: ["1", "3", "5"],
  calories: 450,
  duration: 3600,
  focusArea: ["chest", "back"],
  createdAt: new Date("2026-01-01T10:00:00Z"),
  updatedAt: new Date("2026-01-01T12:30:00Z"),
};
