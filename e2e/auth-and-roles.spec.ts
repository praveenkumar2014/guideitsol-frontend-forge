import { test, expect } from "@playwright/test";

test.describe("Multi-Role Authentication & Session Management", () => {
  test("authenticates via 1-click test role, displays permissions, and switches roles", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Open Auth Modal from header
    const authBtn = page.locator("#auth-role-btn");
    await expect(authBtn).toBeVisible();
    await authBtn.click();

    // Verify modal title
    await expect(
      page
        .locator("text=GUIDESOFT Access & Role Portal")
        .or(page.locator("text=User Account & Role Management")),
    ).toBeVisible();

    // Click "Sign in as learner"
    const learnerLoginBtn = page.locator('button:has-text("Sign in as learner")');
    await expect(learnerLoginBtn).toBeVisible();
    await learnerLoginBtn.click();

    // Verify header updates with active learner badge
    await expect(page.locator("#auth-role-btn")).toContainText("Priya");
    await expect(page.locator("#auth-role-btn")).toContainText("learner");

    // Open Auth Modal again to switch role
    await page.waitForTimeout(300);
    await authBtn.click();
    await expect(page.locator("text=Active Permissions & Capabilities")).toBeVisible();

    // Switch to Admin role
    const adminRoleBtn = page.locator('button:has-text("admin")').last();
    await adminRoleBtn.click();

    // Verify header updates with Admin
    await expect(page.locator("#auth-role-btn")).toContainText("admin");

    // Sign out
    await page.waitForTimeout(300);
    await authBtn.click();
    const signOutBtn = page.locator('button:has-text("Sign Out")');
    await expect(signOutBtn).toBeVisible();
    await signOutBtn.click();

    // Verify reset to Sign In
    await expect(page.locator("#auth-role-btn")).toContainText("Sign In");
  });

  test("authenticates with Google Fast Sign-In and loads dedicated /auth portal", async ({
    page,
  }) => {
    await page.goto("/auth");
    await page.waitForLoadState("networkidle");

    // Verify /auth Left & Right Split Layout
    await expect(page.getByRole("heading", { name: "Enterprise-Grade Learning Portal" })).toBeVisible();
    await expect(page.locator("#page-google-auth-btn")).toBeVisible();

    // Sign in with Google on the page
    await page.locator("#page-google-auth-btn").click();

    // Verify redirection to /student-dashboard with Google Verified Learner session
    await expect(page).toHaveURL(/\/student-dashboard/, { timeout: 10000 });
    await expect(page.getByText("Welcome back, Google Verified Learner")).toBeVisible();
  });
});
