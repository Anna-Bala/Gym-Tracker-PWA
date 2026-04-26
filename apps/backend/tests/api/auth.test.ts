import { beforeEach, describe, expect, test, vi } from "vitest";
import request from "supertest";

import "./setup";
import app from "@/app";
import { bcryptMocks, prismaMock } from "./setup";
import { ErrorCode } from "@/exceptions";
import { expectAuthCookiesSet, expectClearedAuthCookies } from "./helpers";
import { onboarding } from "../fixtures/onboarding";
import { refreshToken as refreshTokenFixture } from "../fixtures/refreshToken";
import { signRefreshToken } from "@/helpers";
import { user } from "../fixtures/user";

const { googleApiMock } = vi.hoisted(() => ({
  googleApiMock: {
    authenticateUser: vi.fn(),
  },
}));

vi.mock("@/services/googleApi.service", () => ({
  GoogleApiService: class {
    authenticateUser = googleApiMock.authenticateUser;
  },
  default: googleApiMock,
}));

beforeEach(() => {
  googleApiMock.authenticateUser.mockReset();
});

describe("POST /api/auth/signup", () => {
  const validBody = {
    firstName: "Anna",
    lastName: "Bala",
    email: "anna@example.com",
    password: "StrongPass1!",
    confirmPassword: "StrongPass1!",
  };

  test("creates a user and returns 201 without exposing the password", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(user);

    const response = await request(app).post("/api/auth/signup").send(validBody);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: user.id, email: user.email });
    expect(response.body).not.toHaveProperty("password");
  });

  test("returns 409 when email is already registered", async () => {
    prismaMock.user.findUnique.mockResolvedValue(user);

    const response = await request(app).post("/api/auth/signup").send(validBody);

    expect(response.status).toBe(409);
    expect(response.body.errorCode).toBe(ErrorCode.USER_ALREADY_EXISTS);
  });

  test("returns 400 when password does not meet requirements", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({ ...validBody, password: "weak", confirmPassword: "weak" });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });

  test("returns 400 when passwords do not match", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({ ...validBody, confirmPassword: "123!" });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });
});

describe("POST /api/auth/login", () => {
  const validBody = { email: user.email, password: "StrongPass1!" };

  test("authenticates user, sets cookies and returns onboarding status", async () => {
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.refreshToken.create.mockResolvedValue({} as any);
    prismaMock.onboarding.findFirst.mockResolvedValue(onboarding);

    const response = await request(app).post("/api/auth/login").send(validBody);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      user: { id: user.id, email: user.email, firstName: user.firstName },
      onboardingFilled: true,
    });
    expect(response.body.user).not.toHaveProperty("password");
    expectAuthCookiesSet(response.headers["set-cookie"] as unknown as string[]);
  });

  test("returns onboardingFilled false when user has not completed onboarding", async () => {
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.refreshToken.create.mockResolvedValue({} as any);
    prismaMock.onboarding.findFirst.mockResolvedValue(null);

    const response = await request(app).post("/api/auth/login").send(validBody);

    expect(response.status).toBe(200);
    expect(response.body.onboardingFilled).toBe(false);
  });

  test("returns 404 when user is not found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const response = await request(app).post("/api/auth/login").send(validBody);

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(ErrorCode.USER_NOT_FOUND);
  });

  test("returns 401 when password is incorrect", async () => {
    prismaMock.user.findUnique.mockResolvedValue(user);
    bcryptMocks.compareSync.mockReturnValueOnce(false);

    const response = await request(app).post("/api/auth/login").send(validBody);

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INCORRECT_PASSWORD);
  });
});

describe("POST /api/auth/refresh", () => {
  const signedRefreshToken = signRefreshToken(user.id);

  test("rotates refresh token, issues new cookies and returns 204", async () => {
    prismaMock.refreshToken.findFirst.mockResolvedValue({ ...refreshTokenFixture, token: signedRefreshToken });
    prismaMock.$transaction.mockResolvedValue([] as any);

    const response = await request(app).post("/api/auth/refresh").set("Cookie", `refresh_token=${signedRefreshToken}`);

    expect(response.status).toBe(204);
    expectAuthCookiesSet(response.headers["set-cookie"] as unknown as string[]);
  });

  test("returns 401 when refresh token cookie is missing", async () => {
    const response = await request(app).post("/api/auth/refresh");

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.MISSING_TOKEN);
  });

  test("returns 401 when stored refresh token is revoked", async () => {
    prismaMock.refreshToken.findFirst.mockResolvedValue({ ...refreshTokenFixture, token: signedRefreshToken, revoked: true });

    const response = await request(app).post("/api/auth/refresh").set("Cookie", `refresh_token=${signedRefreshToken}`);

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 401 when refresh token is not found in database", async () => {
    prismaMock.refreshToken.findFirst.mockResolvedValue(null);

    const response = await request(app).post("/api/auth/refresh").set("Cookie", `refresh_token=${signedRefreshToken}`);

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });

  test("returns 401 when refresh token jwt is invalid", async () => {
    prismaMock.refreshToken.findFirst.mockResolvedValue({ ...refreshTokenFixture, token: "malformed" });

    const response = await request(app).post("/api/auth/refresh").set("Cookie", "refresh_token=malformed");

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.INVALID_TOKEN);
  });
});

describe("POST /api/auth/google", () => {
  const googlePayload = {
    sub: "google-sub-123",
    email: user.email,
    given_name: user.firstName,
    family_name: user.lastName,
    name: `${user.firstName} ${user.lastName}`,
  };

  test("authenticates user via Google, sets cookies and returns user profile", async () => {
    googleApiMock.authenticateUser.mockResolvedValue(googlePayload);
    prismaMock.user.upsert.mockResolvedValue({ ...user, googleId: googlePayload.sub });
    prismaMock.refreshToken.create.mockResolvedValue({} as any);
    prismaMock.onboarding.findFirst.mockResolvedValue(onboarding);

    const response = await request(app).post("/api/auth/google").send({ code: "google-code" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      user: { id: user.id, email: user.email },
      onboardingFilled: true,
    });
    expect(response.body.user).not.toHaveProperty("password");
    expectAuthCookiesSet(response.headers["set-cookie"] as unknown as string[]);
    expect(googleApiMock.authenticateUser).toHaveBeenCalledWith("google-code");
  });

  test("falls back to default names when Google payload is missing them", async () => {
    googleApiMock.authenticateUser.mockResolvedValue({ sub: "sub-1", email: "x@example.com" });
    prismaMock.user.upsert.mockResolvedValue(user);
    prismaMock.refreshToken.create.mockResolvedValue({} as any);
    prismaMock.onboarding.findFirst.mockResolvedValue(null);

    const response = await request(app).post("/api/auth/google").send({ code: "google-code" });

    expect(response.status).toBe(200);
    expect(prismaMock.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ firstName: "Guest", lastName: "User" }),
      })
    );
  });

  test("returns 401 when Google authentication fails", async () => {
    googleApiMock.authenticateUser.mockResolvedValue(null);

    const response = await request(app).post("/api/auth/google").send({ code: "bad-code" });

    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe(ErrorCode.GOOGLE_API_ERROR);
  });
});

describe("POST /api/auth/logout", () => {
  test("deletes stored refresh token and clears cookies when token is present", async () => {
    const signedRefreshToken = signRefreshToken(user.id);
    prismaMock.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

    const response = await request(app).post("/api/auth/logout").set("Cookie", `refresh_token=${signedRefreshToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ ok: true });
    expect(prismaMock.refreshToken.deleteMany).toHaveBeenCalledWith({ where: { token: signedRefreshToken } });
    expectClearedAuthCookies(response.headers["set-cookie"] as unknown as string[]);
  });

  test("returns ok:false when no refresh token cookie is present", async () => {
    const response = await request(app).post("/api/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ ok: false });
    expect(prismaMock.refreshToken.deleteMany).not.toHaveBeenCalled();
  });
});
