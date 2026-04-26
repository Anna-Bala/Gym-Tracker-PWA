import type { RefreshToken } from "@prisma/client";
import { user } from "./user";

export const refreshToken: RefreshToken = {
  id: 1,
  userId: user.id,
  token: "stored-refresh-token",
  revoked: false,
  expiresAt: new Date("2030-01-01T00:00:00Z"),
  createdAt: new Date("2026-01-01T00:00:00Z"),
};
