import { test, expect } from "./fixtures";
import { mockRefreshSuccess } from "./fixtures/auth";

test.describe("Workout plan details", () => {
  test("should open the add to calendar modal", async ({ page, mockedWorkoutPlanDetails }) => {
    await mockRefreshSuccess(page);
    await page.goto("/home/workout-plan/1");

    await expect(page.getByText(mockedWorkoutPlanDetails.name).last()).toBeVisible();

    const addToCalendarButton = page.getByRole("button", { name: "Add to calendar" });

    await expect(addToCalendarButton).toBeVisible();
    await addToCalendarButton.click();

    await expect(page.getByText("Pick workout plan time window")).toBeVisible();

    const saveToCalendarButton = page.getByRole("button", { name: "Save to calendar" });

    await expect(saveToCalendarButton).toBeEnabled();
    await saveToCalendarButton.click();
    await expect(page.locator("#atcb-bgoverlay")).toBeVisible();
  });
});
