import type { Page } from "@playwright/test";

import { mockedWorkoutHistoryAI, mockedWorkoutHistoryUser } from "./mocks";

export const mockWorkoutHistory = async (page: Page) => {
  await page.route("**/api/workout-history", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([mockedWorkoutHistoryAI, mockedWorkoutHistoryUser]),
    });
  });
};
