import { test, expect } from "./fixtures";
import { mockRefreshSuccess } from "./fixtures/auth";

test.describe("Report page", () => {
  test("should show all combined user workout statistics correctly", async ({ page, mockedUserStatistics, mockedWorkoutHistory }) => {
    await mockRefreshSuccess(page);

    await page.goto("/report");

    await expect(page.getByRole("heading", { name: /Report/i })).toBeVisible();

    const workoutsContainer = page.locator("div").filter({ hasText: /^300workouts$/ });

    await expect(workoutsContainer.getByText("300")).toBeVisible();
    await expect(workoutsContainer.getByText("workouts")).toBeVisible();

    const minutesContainer = page.locator("div").filter({ hasText: /^1440minutes$/ });

    await expect(minutesContainer.getByText("1440")).toBeVisible();
    await expect(minutesContainer.getByText("minutes")).toBeVisible();

    const kcalContainer = page.locator("div").filter({ hasText: /^20000kcal$/ });

    await expect(kcalContainer.getByText("20000")).toBeVisible();
    await expect(kcalContainer.getByText("kcal")).toBeVisible();
  });

  test("should show statistics chart correctly", async ({ page }) => {
    await mockRefreshSuccess(page);

    await page.goto("/report");

    const chart = page.getByTestId("workout-chart");

    await expect(chart).toHaveScreenshot("workout-chart.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.05,
    });
  });

  test("should show bmi chart correctly", async ({ page }) => {
    await mockRefreshSuccess(page);

    await page.goto("/report");

    const chart = page.getByTestId("bmi-chart");

    await expect(chart).toHaveScreenshot("bmi-chart.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.05,
    });
  });
});
