import { test, expect } from "./fixtures";
import { mockRefreshSuccess } from "./fixtures/auth";
import { mockEmptyWorkoutPlans, mockTodaysWorkoutPlan, mockWorkoutPlanWithoutTodaysPlan } from "./fixtures/workoutPlan";

test.describe("Home page", () => {
  test("should contain all workout plans", async ({ page, mockedWorkoutPlans }) => {
    await mockRefreshSuccess(page);

    await page.goto("/home");

    await expect(page.getByText(/All Your Workout Plans/i)).toBeVisible();

    for (const workoutPlan of mockedWorkoutPlans) {
      await expect(page.getByText(workoutPlan.name).last()).toBeVisible();
      await expect(page.getByText(`${workoutPlan.calories} kcal`).last()).toBeVisible();
    }
  });

  test("should contain today's workout plan", async ({ page, mockedWorkoutPlans }) => {
    await mockRefreshSuccess(page);
    await mockTodaysWorkoutPlan(page);

    await page.goto("/home");

    await expect(page.getByText(/Today's workout plan/i)).toBeVisible();
    await expect(page.getByText(/You do not have any workout scheduled for today/i)).not.toBeVisible();
    await expect(page.getByText(mockedWorkoutPlans[0].name).first()).toBeVisible();
  });

  test("should not contain today's workout plan", async ({ page, mockedWorkoutPlans }) => {
    await mockRefreshSuccess(page);
    await mockWorkoutPlanWithoutTodaysPlan(page);

    await page.goto("/home");

    await expect(page.getByText(/Today's workout plan/i)).toBeVisible();
    await expect(page.getByText(/You do not have any workout scheduled for today/i)).toBeVisible();
  });

  test("should show empty state", async ({ page }) => {
    await mockRefreshSuccess(page);
    await mockEmptyWorkoutPlans(page);

    await page.goto("/home");

    await expect(page.getByText(/You haven't created any workout plans yet/i)).toBeVisible();
    await expect(page.getByRole("link", { name: "Create your workout plan" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Generate workout plan with AI" })).toBeVisible();
  });

  test("should show AI badge for AI created workout plan", async ({ page }) => {
    await mockRefreshSuccess(page);

    await page.goto("/home");
    await expect(page.locator('[data-slot="badge"]', { hasText: "AI" }).last()).toBeVisible();
  });

  test("should contain button link for adding new workout plan", async ({ page }) => {
    await mockRefreshSuccess(page);

    await page.goto("/home");
    await expect(page.locator('a[href*="/home/create-workout-plan"]')).toBeVisible();
  });
});
