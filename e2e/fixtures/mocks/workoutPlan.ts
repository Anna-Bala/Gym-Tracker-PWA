import { WorkoutPlan } from "apps/schemas/dist";

export const mockedWorkoutPlanAI: WorkoutPlan = {
  id: 1,
  name: "Two Day Full Body Plan",
  description: "A beginner-friendly, sustainable two-day full-body routine. Focuses on compound lifts to build muscle safely using the provided exercises. Increase workload gradually each week.",
  duration: 2280,
  focusArea: ["fullBody"],
  days: ["1", "4"],
  calories: 350,
  ai: true,
  createdAt: "2026-01-18 10:50:42.178",
  updatedAt: "2026-01-18 10:50:42.178",
};

export const mockedWorkoutPlanUser: WorkoutPlan = {
  id: 2,
  name: "Leg day",
  description: "A light workout for legs",
  duration: 1500,
  focusArea: ["legs"],
  days: ["3", "5"],
  calories: 200,
  ai: false,
  createdAt: "2026-02-01 15:30:00.000",
  updatedAt: "2026-02-01 15:30:00.000",
};
