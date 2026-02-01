import type { Page } from "@playwright/test";

import { mockedUser, authCookies } from "./mocks";

export const mockRegistrationSuccess = async (page: Page) => {
  await page.route("**/api/auth/signup", async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify(mockedUser),
    });
  });
};

export const mockLoginSuccess = async (page: Page) => {
  await page.route("**/api/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        "Set-Cookie": authCookies.join("\n"),
      },
      contentType: "application/json",
      body: JSON.stringify({ user: mockedUser, onboardingFilled: true }),
    });
  });
};

export const mockRefreshSuccess = async (page: Page) => {
  await page.route("**/api/auth/refresh", async (route) => {
    await route.fulfill({
      status: 204,
      headers: {
        "Set-Cookie": authCookies.join("\n"),
      },
      contentType: "application/json",
    });
  });
};

export const mockRegistrationErrorPasswordTooShort = async (page: Page) => {
  await page.route("**/api/auth/signup", async (route) => {
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ error: "Password must contain at least one special character" }),
    });
  });
};

export const mockRegistrationErrorPasswordDoNotMatch = async (page: Page) => {
  await page.route("**/api/auth/signup", async (route) => {
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ error: "Passwords do not match" }),
    });
  });
};
