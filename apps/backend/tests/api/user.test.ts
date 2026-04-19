import { describe, expect, test } from "vitest";
import request from "supertest";

import "./setup";
import app from "@/app";
import { authRequest, expectClearedAuthCookies } from "./helpers";
import { ErrorCode } from "@/exceptions";
import { onboarding } from "../fixtures/onboarding";
import { prismaMock } from "./setup";
import { user } from "../fixtures/user";

describe("GET /api/user", () => {
  test("returns user without password", async () => {
    prismaMock.user.findUnique.mockResolvedValue(user);

    const response = await authRequest.get("/api/user");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
    expect(response.body).not.toHaveProperty("password");
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).get("/api/user");

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 404 when user not found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const response = await authRequest.get("/api/user");

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(ErrorCode.USER_NOT_FOUND);
  });
});

describe("PATCH /api/user", () => {
  const newUserData = {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
  };

  test("updates and returns user personal info", async () => {
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue({ ...user, ...newUserData });

    const response = await authRequest.patch("/api/user").send(newUserData);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(newUserData);
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).patch("/api/user").send(newUserData);

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 404 when user not found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const response = await authRequest.patch("/api/user").send(newUserData);

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(ErrorCode.USER_NOT_FOUND);
  });

  test("returns 400 when body is invalid", async () => {
    const response = await authRequest.patch("/api/user").send({ firstName: "J", lastName: "", email: "fake-email" });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });
});

describe("DELETE /api/user", () => {
  test("deletes user and returns 204", async () => {
    prismaMock.user.delete.mockResolvedValue(user);

    const response = await authRequest.delete("/api/user");

    expect(response.status).toBe(204);
    expectClearedAuthCookies(response.headers["set-cookie"] as unknown as string[]);
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).delete("/api/user");

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 500 when deletion fails", async () => {
    prismaMock.user.delete.mockRejectedValue(new Error("DB error"));

    const response = await authRequest.delete("/api/user");

    expect(response.status).toBe(500);
    expect(response.body).toStrictEqual({ error: "Failed to delete account" });
  });
});

describe("PATCH /api/user/password", () => {
  const validBody = {
    currentPassword: "OldPass1!",
    newPassword: "NewPass1!",
  };

  test("changes password, clears auth cookies and returns 204", async () => {
    prismaMock.$transaction.mockImplementation(async (cb: any) => cb(prismaMock));
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);
    prismaMock.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

    const response = await authRequest.patch("/api/user/password").send(validBody);

    expect(response.status).toBe(204);
    expectClearedAuthCookies(response.headers["set-cookie"] as unknown as string[]);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: { password: "new-hashed-password" },
    });
    expect(prismaMock.refreshToken.deleteMany).toHaveBeenCalledWith({ where: { userId: user.id } });
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).patch("/api/user/password").send(validBody);

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 400 when body is invalid", async () => {
    const response = await authRequest.patch("/api/user/password").send({ currentPassword: "", newPassword: "" });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });
});

describe("PATCH /api/user/theme", () => {
  test("updates and returns theme", async () => {
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue({ ...user, theme: "dark" });

    const response = await authRequest.patch("/api/user/theme").send({ theme: "dark" });

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ theme: "dark" });
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).patch("/api/user/theme").send({ theme: "dark" });

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 404 when user not found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const response = await authRequest.patch("/api/user/theme").send({ theme: "light" });

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(ErrorCode.USER_NOT_FOUND);
  });

  test("returns 400 when theme value is invalid", async () => {
    const response = await authRequest.patch("/api/user/theme").send({ theme: "blue" });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });
});

describe("GET /api/user/statistic", () => {
  test("returns user statistics", async () => {
    prismaMock.onboarding.findUnique.mockResolvedValue(onboarding);
    prismaMock.workoutHistory.aggregate.mockResolvedValue({
      _count: { id: 10 },
      _sum: { calories: 5000, duration: 600 },
      _avg: { calories: null, duration: null, id: null, userId: null, workoutPlanId: null },
      _min: { calories: null, duration: null, id: null, userId: null, workoutPlanId: null, createdAt: null, updatedAt: null },
      _max: { calories: null, duration: null, id: null, userId: null, workoutPlanId: null, createdAt: null, updatedAt: null },
    });

    const response = await authRequest.get("/api/user/statistic");

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      totalCalories: 5000,
      totalDuration: 600,
      totalWorkouts: 10,
      height: 180,
      weight: 80,
    });
  });

  test("returns 401 when not authenticated", async () => {
    const response = await request(app).get("/api/user/statistic");

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 404 when onboarding not found", async () => {
    prismaMock.onboarding.findUnique.mockResolvedValue(null);

    const response = await authRequest.get("/api/user/statistic");

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(ErrorCode.USER_ONBOARDING_MISSING);
  });
});
