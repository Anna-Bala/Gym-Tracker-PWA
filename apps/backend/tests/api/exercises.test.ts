import { describe, expect, test, vi, beforeEach } from "vitest";
import request from "supertest";

import "./setup";
import app from "@/app";
import { authRequest } from "./helpers";
import { ErrorCode } from "@/exceptions";
import { exerciseApiItem } from "../fixtures/exercise-api";

const { mockService } = vi.hoisted(() => ({
  mockService: {
    getAllExercises: vi.fn(),
    searchExercises: vi.fn(),
    filterExercises: vi.fn(),
  },
}));

vi.mock("@/services/exerciseApi.service", () => ({
  ExerciseApiService: class {
    getAllExercises = mockService.getAllExercises;
    searchExercises = mockService.searchExercises;
    filterExercises = mockService.filterExercises;
  },
  default: mockService,
}));

beforeEach(() => {
  mockService.getAllExercises.mockReset();
  mockService.searchExercises.mockReset();
  mockService.filterExercises.mockReset();
});

describe("GET /api/exercises", () => {
  test("returns all exercises", async () => {
    mockService.getAllExercises.mockResolvedValue([exerciseApiItem]);

    const response = await authRequest.get("/api/exercises");

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([exerciseApiItem]);
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).get("/api/exercises");

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 500 when upstream fails", async () => {
    mockService.getAllExercises.mockRejectedValue(new Error("upstream down"));

    const response = await authRequest.get("/api/exercises");

    expect(response.status).toBe(500);
    expect(response.body.errorCode).toBe(ErrorCode.INTERNAL_EXCEPTION);
  });
});

describe("POST /api/exercises/search", () => {
  test("returns exercises matching the name", async () => {
    mockService.searchExercises.mockResolvedValue([exerciseApiItem]);

    const response = await authRequest.post("/api/exercises/search").send({ name: "plank" });

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([exerciseApiItem]);
    expect(mockService.searchExercises).toHaveBeenCalledWith("plank");
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).post("/api/exercises/search").send({ name: "plank" });

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 400 when body is invalid", async () => {
    const response = await authRequest.post("/api/exercises/search").send({ name: 123 });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });

  test("returns 500 when upstream fails", async () => {
    mockService.searchExercises.mockRejectedValue(new Error("upstream down"));

    const response = await authRequest.post("/api/exercises/search").send({ name: "plank" });

    expect(response.status).toBe(500);
    expect(response.body.errorCode).toBe(ErrorCode.INTERNAL_EXCEPTION);
  });
});

describe("POST /api/exercises/filter", () => {
  const validBody = {
    muscles: ["chest"],
    categories: ["body_weight"],
    types: ["isolation"],
  };

  test("returns filtered exercises", async () => {
    mockService.filterExercises.mockResolvedValue([exerciseApiItem]);

    const response = await authRequest.post("/api/exercises/filter").send(validBody);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([exerciseApiItem]);
    expect(mockService.filterExercises).toHaveBeenCalledWith(validBody.muscles, validBody.categories, validBody.types);
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).post("/api/exercises/filter").send(validBody);

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 400 when body contains invalid enum value", async () => {
    const response = await authRequest.post("/api/exercises/filter").send({ muscles: ["not-a-muscle"] });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });

  test("returns 500 when upstream fails", async () => {
    mockService.filterExercises.mockRejectedValue(new Error("upstream down"));

    const response = await authRequest.post("/api/exercises/filter").send(validBody);

    expect(response.status).toBe(500);
    expect(response.body.errorCode).toBe(ErrorCode.INTERNAL_EXCEPTION);
  });
});
