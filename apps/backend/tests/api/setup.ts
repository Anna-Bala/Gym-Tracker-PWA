import { beforeAll, beforeEach, vi } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type { PrismaClient } from "@prisma/client";
import type { RedisClientType } from "redis";

export const prismaMock = mockDeep<PrismaClient>();
export const redisMock = mockDeep<RedisClientType>();

vi.hoisted(() => {
  process.env.OPENAI_API_KEY = "open-ai-api-key";
  process.env.JWT_ACCESS_TOKEN_SECRET = "jwt-access-secret";
  process.env.JWT_REFRESH_TOKEN_SECRET = "jwt-refresh-secret";
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
