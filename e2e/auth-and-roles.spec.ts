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
});
