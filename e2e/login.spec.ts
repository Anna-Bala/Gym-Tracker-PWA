import { Page } from "@playwright/test";

import type { User } from "apps/schemas/dist";
import { test, expect } from "./fixtures";
import { mockLoginIncorrectPassword, mockLoginSuccess } from "./fixtures/auth";

const fillOutForm = async (page: Page, mockedUser: User, password: string) => {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(mockedUser.email);
  await page.getByLabel("Password", { exact: true }).fill(password);
};

test.describe("User login flow", () => {
  test("should successfully login and redirect to the home page", async ({ page, mockedUser }) => {
    await mockLoginSuccess(page);

    await fillOutForm(page, mockedUser, "strongPassword123!");
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page).toHaveURL("/home");
    await expect(page.getByText(/gym tracker/i)).toBeVisible();
    await expect(page.getByText(/today's workout plan/i)).toBeVisible();
  });

  test("should show an error when password in incorrect", async ({ page, mockedUser }) => {
    await mockLoginIncorrectPassword(page);

    await fillOutForm(page, mockedUser, "incorrectPassword");
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page.getByText(/Login attempt failed./i)).toBeVisible();
  });
});
