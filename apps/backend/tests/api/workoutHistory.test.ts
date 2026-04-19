import { describe, expect, test } from "vitest";
import request from "supertest";
import { prismaMock } from "./setup";
import { authRequest } from "./helpers";
import { ErrorCode } from "@/exceptions";
import { workoutHistory } from "../fixtures/workoutHistory";
import { workoutPlan } from "../fixtures/workoutPlan";
import app from "@/app";

describe("GET /api/workout-history", () => {
  const historyWithPlan = {
    ...workoutHistory,
    workoutPlan: {
      id: workoutPlan.id,
      ai: workoutPlan.ai,
      focusArea: workoutPlan.focusArea,
      name: workoutPlan.name,
    },
  };

  test("returns workout history entries", async () => {
    prismaMock.workoutHistory.findMany.mockResolvedValue([historyWithPlan] as any);

    const response = await authRequest.get("/api/workout-history");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject(JSON.parse(JSON.stringify(workoutHistory)));
  });

  test("filters workout history by from and to date range", async () => {
    prismaMock.workoutHistory.findMany.mockResolvedValue([historyWithPlan] as any);

    const response = await authRequest.get("/api/workout-history?from=2026-01-01&to=2026-01-31");

    expect(response.status).toBe(200);
    expect(prismaMock.workoutHistory.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: workoutHistory.userId,
          createdAt: {
            gte: new Date("2026-01-01T00:00:00.000Z"),
            lte: new Date("2026-01-31T23:59:59.999Z"),
          },
        }),
      })
    );
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).get("/api/workout-history");

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 400 when date format is invalid", async () => {
    const response = await authRequest.get("/api/workout-history?from=not-a-date");

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_DATE);
  });
});

describe("POST /api/workout-history", () => {
  const validBody = { workoutPlanId: workoutPlan.id };

  test("creates and returns workout history entry", async () => {
    prismaMock.$transaction.mockImplementation(async (cb: any) => cb(prismaMock));
    prismaMock.workoutPlan.findUnique.mockResolvedValue(workoutPlan);
    prismaMock.workoutHistory.create.mockResolvedValue(workoutHistory);

    const response = await authRequest.post("/api/workout-history").send(validBody);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(JSON.parse(JSON.stringify(workoutHistory)));
    expect(prismaMock.workoutHistory.create).toHaveBeenCalledWith({
      data: {
        calories: workoutPlan.calories,
        duration: workoutPlan.duration,
        userId: workoutHistory.userId,
        workoutPlanId: workoutPlan.id,
      },
    });
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).post("/api/workout-history").send(validBody);

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 400 when body is invalid", async () => {
    const response = await authRequest.post("/api/workout-history").send({ workoutPlanId: "abc" });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });

  test("returns 500 when workout plan is missing", async () => {
    prismaMock.$transaction.mockImplementation(async (cb: any) => cb(prismaMock));
    prismaMock.workoutPlan.findUnique.mockResolvedValue(null);

    const response = await authRequest.post("/api/workout-history").send(validBody);

    expect(response.status).toBe(500);
    expect(response.body.errorCode).toBe(ErrorCode.INTERNAL_EXCEPTION);
  });
});
