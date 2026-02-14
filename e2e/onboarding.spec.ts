import { Page } from "@playwright/test";
import { FullOnboarding } from "apps/schemas/dist";

import { test, expect } from "./fixtures";
import { mockRefreshSuccess } from "./fixtures/auth";
import { mockOnboardingCreationError, mockOnboardingCreationSuccess } from "./fixtures/onboarding";

const fillOutForm = async (page: Page, mockedOnboarding: FullOnboarding) => {
  await page.goto("/onboarding/1");

  await expect(page.getByText(/Select Your Gender/i)).toBeVisible();
  await expect(page.getByRole("radio", { name: "Female" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Male", exact: true })).toBeVisible();
  await page.getByRole("radio", { name: mockedOnboarding.gender === "M" ? "Male" : "Female", exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText(/Choose Your Focus Area/i)).toBeVisible();
  mockedOnboarding.focusArea.forEach(async (area) => await page.getByRole("checkbox", { name: area }).click({ force: true }));
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText(/Enter Your Age/i)).toBeVisible();
  await page.locator('li[data-rwp-option="true"]').getByText(mockedOnboarding.age.toString(), { exact: true }).click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText(/Enter Your Height/i)).toBeVisible();
  await page.locator('li[data-rwp-option="true"]').getByText(mockedOnboarding.height.toString(), { exact: true }).click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText(/Enter Your Weight/i)).toBeVisible();
  await page.locator('li[data-rwp-option="true"]').getByText(mockedOnboarding.weight.toString(), { exact: true }).click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText(/Select Your Activity Level/i)).toBeVisible();
  await page.getByRole("radio", { name: mockedOnboarding.activityLevel }).click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText(/Set Your Workout Goal/i)).toBeVisible();
  await page.getByRole("radio", { name: mockedOnboarding.workoutGoal.replace(/([A-Z])/g, " $1").trim() }).click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText(/How Many Push-Ups Can You Do?/i)).toBeVisible();
  await page.getByRole("radio", { name: mockedOnboarding.fitnessLevel }).click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText(/Select Your Weekly Workout Plan/i)).toBeVisible();
  await page.locator('li[data-rwp-option="true"]').getByText(mockedOnboarding.days.toString()).first().click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText(/Rest Between Sets/i)).toBeVisible();
  await page.locator('li[data-rwp-option="true"]').getByText(mockedOnboarding.restTime.toString(), { exact: true }).click({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();
};

test.describe("Onboarding form", () => {
  test("should be filled successfully", async ({ page, mockedOnboarding }) => {
    await mockRefreshSuccess(page);
    await mockOnboardingCreationSuccess(page);

    await fillOutForm(page, mockedOnboarding);

    await expect(page.getByText(/Failed to initialize/i)).not.toBeVisible();
    await expect(page.getByText(/All Your Workout Plans/i)).toBeVisible();
  });

  test("should show error screen when request fails", async ({ page, mockedOnboarding }) => {
    await mockRefreshSuccess(page);
    await mockOnboardingCreationError(page);

    await fillOutForm(page, mockedOnboarding);

    await expect(page.getByText(/Failed to initialize/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();
  });
});
