import { beforeEach, describe, expect, test, vi } from "vitest";
import request from "supertest";

import "./setup";
import app from "@/app";
import { aiWorkoutPlan, workoutPlan } from "../fixtures/workoutPlan";
import { authRequest } from "./helpers";
import { ErrorCode } from "@/exceptions";
import { exercise1, exercise2 } from "../fixtures/exercise";
import { exerciseApiItem } from "../fixtures/exercise-api";
import { onboarding } from "../fixtures/onboarding";
import { prismaMock } from "./setup";

const { exerciseApiMock, openAiApiMock } = vi.hoisted(() => ({
  exerciseApiMock: {
    getExercisesByCodes: vi.fn(),
  },
  openAiApiMock: {
    createWorkoutPlan: vi.fn(),
  },
}));

vi.mock("@/services/exerciseApi.service", () => ({
  ExerciseApiService: class {
    getExercisesByCodes = exerciseApiMock.getExercisesByCodes;
  },
  default: exerciseApiMock,
}));

vi.mock("@/services/openAiApi.service", () => ({
  OpenAIApiService: class {
    createWorkoutPlan = openAiApiMock.createWorkoutPlan;
  },
  default: openAiApiMock,
}));

beforeEach(() => {
  exerciseApiMock.getExercisesByCodes.mockReset();
  openAiApiMock.createWorkoutPlan.mockReset();
});

const validPlanRequestBody = {
  name: workoutPlan.name,
  description: workoutPlan.description,
  exercises: [exercise1, exercise2],
  primaryMuscles: ["Chest", "Back"],
  days: ["1", "3", "5"] as const,
};

describe("GET /api/workout-plans", () => {
  test("returns user workout plans", async () => {
    prismaMock.workoutPlan.findMany.mockResolvedValue([workoutPlan]);

    const response = await authRequest.get("/api/workout-plans");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      id: workoutPlan.id,
      userId: workoutPlan.userId,
      name: workoutPlan.name,
    });
    expect(prismaMock.workoutPlan.findMany).toHaveBeenCalledWith({ where: { userId: workoutPlan.userId } });
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).get("/api/workout-plans");

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });
});

describe("GET /api/workout-plans/:id", () => {
  const planWithExercises = {
    ...workoutPlan,
    exercises: [{ id: 10, workoutPlanId: workoutPlan.id, ...exercise1, createdAt: new Date("2026-01-01T00:00:00Z") }],
  };

  test("returns workout plan with exercise details", async () => {
    prismaMock.workoutPlan.findUnique.mockResolvedValue(planWithExercises as any);
    exerciseApiMock.getExercisesByCodes.mockResolvedValue(new Map([[exercise1.exerciseApiCode, exerciseApiItem]]));

    const response = await authRequest.get(`/api/workout-plans/${workoutPlan.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: workoutPlan.id, name: workoutPlan.name });
    expect(response.body.exercises[0]).toMatchObject({
      ...exercise1,
      name: exerciseApiItem.name,
    });
    expect(exerciseApiMock.getExercisesByCodes).toHaveBeenCalledWith([exercise1.exerciseApiCode]);
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).get(`/api/workout-plans/${workoutPlan.id}`);

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });
});

describe("POST /api/workout-plans", () => {
  test("creates a workout plan and returns it", async () => {
    prismaMock.$transaction.mockImplementation(async (cb: any) => cb(prismaMock));
    prismaMock.onboarding.findUnique.mockResolvedValue(onboarding);
    prismaMock.workoutPlan.create.mockResolvedValue(workoutPlan);
    prismaMock.workoutPlanExercise.createMany.mockResolvedValue({ count: validPlanRequestBody.exercises.length });

    const response = await authRequest.post("/api/workout-plans").send(validPlanRequestBody);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: workoutPlan.id, name: workoutPlan.name });

    expect(prismaMock.workoutPlan.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: workoutPlan.userId,
        name: validPlanRequestBody.name,
        description: validPlanRequestBody.description,
        days: validPlanRequestBody.days,
      }),
    });
    expect(prismaMock.workoutPlanExercise.createMany).toHaveBeenCalledWith({
      data: validPlanRequestBody.exercises.map((exercise) => ({ workoutPlanId: workoutPlan.id, ...exercise })),
    });
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).post("/api/workout-plans").send(validPlanRequestBody);

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 400 when body is invalid", async () => {
    const response = await authRequest.post("/api/workout-plans").send({ ...validPlanRequestBody, name: "" });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });

  test("returns 500 when onboarding is missing", async () => {
    prismaMock.$transaction.mockImplementation(async (cb: any) => cb(prismaMock));
    prismaMock.onboarding.findUnique.mockResolvedValue(null);

    const response = await authRequest.post("/api/workout-plans").send(validPlanRequestBody);

    expect(response.status).toBe(500);
    expect(response.body.errorCode).toBe(ErrorCode.INTERNAL_EXCEPTION);
  });
});

describe("POST /api/workout-plans/ai", () => {
  test("creates AI workout plan and returns it", async () => {
    prismaMock.onboarding.findUnique.mockResolvedValue(onboarding);
    openAiApiMock.createWorkoutPlan.mockResolvedValue(aiWorkoutPlan);
    prismaMock.$transaction.mockImplementation(async (cb: any) => cb(prismaMock));
    prismaMock.workoutPlan.create.mockResolvedValue({ ...workoutPlan, ai: true, name: aiWorkoutPlan.name });
    prismaMock.workoutPlanExercise.createMany.mockResolvedValue({ count: aiWorkoutPlan.exercises.length });

    const response = await authRequest.post("/api/workout-plans/ai");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: workoutPlan.id, ai: true, name: aiWorkoutPlan.name });

    expect(openAiApiMock.createWorkoutPlan).toHaveBeenCalledWith(onboarding);
    expect(prismaMock.workoutPlan.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: workoutPlan.userId,
        ai: true,
        name: aiWorkoutPlan.name,
        description: aiWorkoutPlan.description,
        focusArea: aiWorkoutPlan.focusArea,
        days: aiWorkoutPlan.days,
      }),
    });
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).post("/api/workout-plans/ai");

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 404 when onboarding is missing", async () => {
    prismaMock.onboarding.findUnique.mockResolvedValue(null);

    const response = await authRequest.post("/api/workout-plans/ai");

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(ErrorCode.USER_ONBOARDING_MISSING);
  });

  test("returns 500 when AI generation fails", async () => {
    prismaMock.onboarding.findUnique.mockResolvedValue(onboarding);
    openAiApiMock.createWorkoutPlan.mockResolvedValue(null);

    const response = await authRequest.post("/api/workout-plans/ai");

    expect(response.status).toBe(500);
    expect(response.body.errorCode).toBe(ErrorCode.OPEN_AI_ERROR);
  });
});

describe("PATCH /api/workout-plans/:id", () => {
  test("updates workout plan and returns it", async () => {
    const updatedPlan = { ...workoutPlan, name: "Updated", exercises: [] };
    prismaMock.workoutPlan.findFirst.mockResolvedValue({ ...workoutPlan, exercises: [] } as any);
    prismaMock.onboarding.findUnique.mockResolvedValue(onboarding);
    prismaMock.$transaction.mockImplementation(async (cb: any) => cb(prismaMock));
    prismaMock.workoutPlanExercise.deleteMany.mockResolvedValue({ count: 1 });
    prismaMock.workoutPlanExercise.createMany.mockResolvedValue({ count: validPlanRequestBody.exercises.length });
    prismaMock.workoutPlan.update.mockResolvedValue(updatedPlan as any);

    const response = await authRequest.patch(`/api/workout-plans/${workoutPlan.id}`).send({ ...validPlanRequestBody, name: "Updated" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: workoutPlan.id, name: "Updated" });
    expect(prismaMock.workoutPlanExercise.deleteMany).toHaveBeenCalledWith({ where: { workoutPlanId: workoutPlan.id } });
    expect(prismaMock.workoutPlan.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: workoutPlan.id } }));
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).patch(`/api/workout-plans/${workoutPlan.id}`).send(validPlanRequestBody);

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 404 when workout plan is missing", async () => {
    prismaMock.workoutPlan.findFirst.mockResolvedValue(null);
    prismaMock.onboarding.findUnique.mockResolvedValue(onboarding);

    const response = await authRequest.patch(`/api/workout-plans/${workoutPlan.id}`).send(validPlanRequestBody);

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(ErrorCode.WORKOUT_PLAN_MISSING);
  });

  test("returns 404 when onboarding is missing", async () => {
    prismaMock.workoutPlan.findFirst.mockResolvedValue({ ...workoutPlan, exercises: [] } as any);
    prismaMock.onboarding.findUnique.mockResolvedValue(null);

    const response = await authRequest.patch(`/api/workout-plans/${workoutPlan.id}`).send(validPlanRequestBody);

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(ErrorCode.USER_ONBOARDING_MISSING);
  });

  test("returns 400 when body is invalid", async () => {
    const response = await authRequest.patch(`/api/workout-plans/${workoutPlan.id}`).send({ exercises: [{ sets: "bad" }] });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });
});
