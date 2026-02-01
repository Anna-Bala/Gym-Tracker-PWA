import type { Page } from "@playwright/test";

import { mockedUser } from "./mocks";

export const mockUser = async (page: Page) => {
  await page.route("**/api/user", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockedUser),
    });
  });
};
