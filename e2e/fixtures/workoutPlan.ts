import type { Page } from "@playwright/test";

import { mockedWorkoutPlanAI, mockedWorkoutPlanUser } from "./mocks";

export const mockWorkoutPlans = async (page: Page) => {
  await page.route("**/api/workout-plans", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([mockedWorkoutPlanAI, mockedWorkoutPlanUser]),
    });
  });
};
