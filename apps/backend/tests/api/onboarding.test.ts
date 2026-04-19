import { describe, expect, test } from "vitest";
import request from "supertest";

import "./setup";
import app from "@/app";
import { authRequest } from "./helpers";
import { ErrorCode } from "@/exceptions";
import { onboarding } from "../fixtures/onboarding";
import { prismaMock } from "./setup";

describe("GET /api/onboarding", () => {
  test("returns onboarding data", async () => {
    prismaMock.onboarding.findFirst.mockResolvedValue(onboarding);

    const response = await authRequest.get("/api/onboarding");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(onboarding);
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).get("/api/onboarding");

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 404 when onboarding not found", async () => {
    prismaMock.onboarding.findFirst.mockResolvedValue(null);

    const response = await authRequest.get("/api/onboarding");

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(ErrorCode.USER_ONBOARDING_MISSING);
  });
});

describe("POST /api/onboarding", () => {
  const { id, userId, ...validBody } = onboarding;

  test("creates and returns onboarding", async () => {
    prismaMock.onboarding.findFirst.mockResolvedValue(null);
    prismaMock.onboarding.create.mockResolvedValue(onboarding);

    const response = await authRequest.post("/api/onboarding").send(validBody);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(validBody);
    expect(prismaMock.onboarding.create).toHaveBeenCalledWith({
      data: { ...validBody, userId: onboarding.userId },
    });
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).post("/api/onboarding").send(validBody);

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 400 when onboarding already exists", async () => {
    prismaMock.onboarding.findFirst.mockResolvedValue(onboarding);

    const response = await authRequest.post("/api/onboarding").send(validBody);

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe(ErrorCode.USER_ONBOARDING_ALREADY_EXISTS);
  });

  test("returns 400 when body is invalid", async () => {
    const response = await authRequest.post("/api/onboarding").send({ ...validBody, gender: "X" });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });
});

describe("PATCH /api/onboarding", () => {
  const validBody = {
    age: 30,
    gender: "F" as const,
    height: 170,
    weight: 65,
  };

  test("updates and returns body metrics", async () => {
    prismaMock.onboarding.findFirst.mockResolvedValue(onboarding);
    prismaMock.onboarding.update.mockResolvedValue({ ...onboarding, ...validBody });

    const response = await authRequest.patch("/api/onboarding").send(validBody);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(validBody);
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).patch("/api/onboarding").send(validBody);

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 404 when onboarding not found", async () => {
    prismaMock.onboarding.findFirst.mockResolvedValue(null);

    const response = await authRequest.patch("/api/onboarding").send(validBody);

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(ErrorCode.USER_ONBOARDING_MISSING);
  });

  test("returns 400 when body is invalid", async () => {
    const response = await authRequest.patch("/api/onboarding").send({ age: -5 });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });
});
