import type { Page } from "@playwright/test";

import { mockedWorkoutPlanAI, mockedWorkoutPlanDetails, mockedWorkoutPlanUser } from "./mocks";

export const mockWorkoutPlans = async (page: Page) => {
  await page.route("**/api/workout-plans", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([mockedWorkoutPlanAI, mockedWorkoutPlanUser]),
    });
  });
};

export const mockTodaysWorkoutPlan = async (page: Page) => {
  await page.route("**/api/workout-plans", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([mockedWorkoutPlanAI]),
    });
  });
};

export const mockWorkoutPlanWithoutTodaysPlan = async (page: Page) => {
  await page.route("**/api/workout-plans", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([mockedWorkoutPlanUser]),
    });
  });
};

export const mockEmptyWorkoutPlans = async (page: Page) => {
  await page.route("**/api/workout-plans", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });
};

export const mockWorkoutPlanDetails = async (page: Page) => {
  await page.route("**/api/workout-plans/1", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockedWorkoutPlanDetails),
    });
  });
};
