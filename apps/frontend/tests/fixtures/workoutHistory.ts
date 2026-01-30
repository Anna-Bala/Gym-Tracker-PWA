import type { WorkoutHistory } from "@gym-tracker-pwa/schemas";

const workoutHistory: WorkoutHistory = {
  id: 1,
  userId: 1,
  calories: 360,
  duration: 988,
  workoutPlanId: 1,
  workoutPlan: {
    id: 1,
    ai: false,
    focusArea: ["back", "chest", "shoulders"],
    name: "Upper body workout",
  },
  createdAt: "2026-01-21 22:21:02.311",
  updatedAt: "2026-01-30 16:00:10.000",
};

export { workoutHistory };
