import type { User } from "@prisma/client";

export const user: User = {
  id: 1,
  email: "annabala@mail.com",
  firstName: "Anna",
  lastName: "Bala",
  password: "hashed_password",
  googleId: null,
  theme: null,
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
};
