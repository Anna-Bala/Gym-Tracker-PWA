import { Page } from "@playwright/test";
import { test, expect } from "./fixtures";
import { User } from "apps/schemas/dist";

import { mockRegistrationSuccess, mockRegistrationErrorPasswordDoNotMatch, mockRegistrationErrorPasswordTooShort } from "./fixtures/auth";

const fillOutForm = async (page: Page, mockedUser: User, password: string) => {
  await page.goto("/login");
  await page.getByRole("link", { name: /register now/i }).click();

  await page.getByLabel(/first name/i).fill(mockedUser.firstName);
  await page.getByLabel(/last name/i).fill(mockedUser.lastName);
  await page.getByLabel(/email/i).fill(mockedUser.email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel(/confirm password/i).fill(password);
};

test.describe("User registration flow", () => {
  test("should successfully register and redirect to the login page", async ({ page, mockedUser }) => {
    await mockRegistrationSuccess(page);

    await fillOutForm(page, mockedUser, "strongPassword123!");
    await page.getByRole("button", { name: /sign up/i }).click();

    await expect(page).toHaveURL("/login");
    await expect(page.getByText(/welcome back/i)).toBeVisible();
  });

  test("should show an error message if the password is too short", async ({ page, mockedUser }) => {
    await mockRegistrationErrorPasswordTooShort(page);

    await fillOutForm(page, mockedUser, "123");
    await page.getByRole("button", { name: /sign up/i }).click();

    await expect(page.getByText("Account Creation Error")).toBeVisible();
    await expect(page.getByText("An error occurred while creating your account. Please try again later.")).toBeVisible();
  });

  test("should show an error message if the passwords do not match", async ({ page, mockedUser }) => {
    await mockRegistrationErrorPasswordDoNotMatch(page);

    await fillOutForm(page, mockedUser, "strongPassword123!");
    await page.getByLabel(/confirm password/i).fill("differentPassword123!");
    await page.getByRole("button", { name: /sign up/i }).click();

    await expect(page.getByText("Account Creation Error")).toBeVisible();
    await expect(page.getByText("An error occurred while creating your account. Please try again later.")).toBeVisible();
  });
});
