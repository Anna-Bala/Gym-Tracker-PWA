import { vi, beforeAll, afterAll } from "vitest";

beforeAll(() => {
  vi.useFakeTimers();

  const fakeDate = new Date("2026-01-24T00:00:00Z");
  vi.setSystemTime(fakeDate);
});

afterAll(() => {
  vi.useRealTimers();
});
