import { beforeAll, beforeEach, vi } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type { PrismaClient } from "@prisma/client";
import type { RedisClientType } from "redis";

export const prismaMock = mockDeep<PrismaClient>();
export const redisMock = mockDeep<RedisClientType>();

vi.hoisted(() => {
  process.env.OPENAI_API_KEY = "test-key";
  process.env.WORKOUT_API_BASE_URL = "http://test-api";
  process.env.WORKOUT_API_KEY = "test-key";
  process.env.JWT_ACCESS_TOKEN_SECRET = "test-access-secret";
  process.env.JWT_REFRESH_TOKEN_SECRET = "test-refresh-secret";
  process.env.FRONT_END_ORIGIN = "http://localhost:5173";
  process.env.GOOGLE_CLIENT_ID = "test-google-id";
  process.env.GOOGLE_CLIENT_SECRET = "test-google-secret";
});

vi.mock("@/clients", () => ({
  prismaClient: prismaMock,
  redisClient: redisMock,
}));

vi.mock("bcrypt", () => ({
  compareSync: vi.fn(() => true),
  hashSync: vi.fn(() => "new-hashed-password"),
}));

beforeAll(() => {
  vi.useRealTimers();
});

beforeEach(() => {
  mockReset(prismaMock);
  mockReset(redisMock);
});
