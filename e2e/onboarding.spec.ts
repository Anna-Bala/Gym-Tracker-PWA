import { Page } from "@playwright/test";
import { FullOnboarding } from "apps/schemas/dist";

import { test, expect } from "./fixtures";
import { mockRefreshSuccess } from "./fixtures/auth";
import { mockOnboardingCreationError, mockOnboardingCreationSuccess } from "./fixtures/onboarding";

const fillOutForm = async (page: Page, mockedOnboarding: FullOnboarding) => {
  await page.goto("/onboarding/1");

  await expect(page.getByRole("heading", { name: "Select Your Gender" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Female" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Male", exact: true })).toBeVisible();
  await page.getByRole("radio", { name: mockedOnboarding.gender === "M" ? "Male" : "Female", exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "Choose Your Focus Area" })).toBeVisible();
  mockedOnboarding.focusArea.forEach(async (area) => await page.getByRole("checkbox", { name: area }).click({ force: true }));
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "Enter Your Age" })).toBeVisible();
  await page.locator('li[data-rwp-option="true"]').getByText(mockedOnboarding.age.toString(), { exact: true }).click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "Enter Your Height" })).toBeVisible();
  await page.locator('li[data-rwp-option="true"]').getByText(mockedOnboarding.height.toString(), { exact: true }).click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "Enter Your Weight" })).toBeVisible();
  await page.locator('li[data-rwp-option="true"]').getByText(mockedOnboarding.weight.toString(), { exact: true }).click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "Select Your Activity Level" })).toBeVisible();
  await page.getByRole("radio", { name: mockedOnboarding.activityLevel }).click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "Set Your Workout Goal" })).toBeVisible();
  await page.getByRole("radio", { name: mockedOnboarding.workoutGoal.replace(/([A-Z])/g, " $1").trim() }).click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "How Many Push-Ups Can You Do?" })).toBeVisible();
  await page.getByRole("radio", { name: mockedOnboarding.fitnessLevel }).click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "Select Your Weekly Workout Plan" })).toBeVisible();
  await page.locator('li[data-rwp-option="true"]').getByText(mockedOnboarding.days.toString()).first().click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "Rest Between Sets" })).toBeVisible();
  await page.locator('li[data-rwp-option="true"]').getByText(mockedOnboarding.restTime.toString(), { exact: true }).click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();
};

test.describe("Onboarding form", () => {
  test("should be filled successfully", async ({ page, mockedOnboarding }) => {
    await mockRefreshSuccess(page);
    await mockOnboardingCreationSuccess(page);

    await fillOutForm(page, mockedOnboarding);

    await expect(page.getByRole("heading", { name: "Failed to initialize your profile" })).not.toBeVisible();
    await expect(page.getByText(/All Your Workout Plans/i)).toBeVisible();
  });

  test("should show error screen when request fails", async ({ page, mockedOnboarding }) => {
    await mockRefreshSuccess(page);
    await mockOnboardingCreationError(page);

    await fillOutForm(page, mockedOnboarding);

    await expect(page.getByRole("heading", { name: "Failed to initialize your profile" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();
  });
});
