import type { Page } from "@playwright/test";

import { mockedUserStatistics } from "./mocks";

export const mockUserStatistics = async (page: Page) => {
  await page.route("**/api/user/statistic", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockedUserStatistics),
    });
  });
};
