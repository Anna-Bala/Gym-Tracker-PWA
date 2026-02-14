import type { Page } from "@playwright/test";

import { authCookies, mockedOnbaording } from "./mocks";

export const mockOnboardingCreationSuccess = async (page: Page) => {
  await page.route("**/api/onboarding", async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        "Set-Cookie": authCookies.join("\n"),
      },
      contentType: "application/json",
      body: JSON.stringify(mockedOnbaording),
    });
  });
};

export const mockOnboardingCreationError = async (page: Page) => {
  await page.route("**/api/onboarding", async (route) => {
    await route.fulfill({
      status: 500,
      headers: {
        "Set-Cookie": authCookies.join("\n"),
      },
      contentType: "application/json",
      body: JSON.stringify({
        errors: {
          message: "Onboarding has been already created for this user",
        },
      }),
    });
  });
};
