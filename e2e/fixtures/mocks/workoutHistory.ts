import { WorkoutHistory } from "apps/schemas/dist";

import { mockedWorkoutPlanAI, mockedWorkoutPlanUser } from "./workoutPlan";

export const mockedWorkoutHistoryAI: WorkoutHistory = {
  id: 1,
  userId: 1,
  workoutPlanId: 1,
  calories: 350,
  duration: 2280,
  workoutPlan: {
    ...mockedWorkoutPlanAI,
  },
  createdAt: "2026-01-21 10:50:42.178",
  updatedAt: "2026-01-21 10:50:42.178",
};

export const mockedWorkoutHistoryUser: WorkoutHistory = {
  id: 2,
  userId: 1,
  workoutPlanId: 2,
  duration: 1500,
  calories: 200,
  workoutPlan: {
    ...mockedWorkoutPlanUser,
  },
  createdAt: "2026-02-15 12:30:30.178",
  updatedAt: "2026-02-15 12:30:30.178",
};
