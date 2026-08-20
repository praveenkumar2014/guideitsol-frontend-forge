import { test, expect } from "@playwright/test";

test.describe("Admin Console & Lead CRM", () => {
  test("authenticates with Admin key and manages leads", async ({ page }) => {
    // Ensure clean unauthenticated state
    await page.addInitScript(() => {
      localStorage.removeItem("guidesoft_admin_auth");
      localStorage.removeItem("guidesoft_admin_key");
    });

    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    const keyInput = page.locator('input[placeholder="Enter secret key..."]');
    await expect(keyInput).toBeVisible();
    await keyInput.fill("test-admin-key");

    const unlockBtn = page.getByRole("button", { name: "Unlock Console" });
    await unlockBtn.click();

    // Expect dashboard view
    await expect(page.getByText("Admin Management Console")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Total Enquiries")).toBeVisible();

    // Search for lead
    const searchInput = page.getByPlaceholder("Search by name, email, phone or course...");
    await searchInput.fill("Aarav");
    await expect(page.getByText("Aarav Sharma")).toBeVisible();

    // Test status selector on row
    const statusSelect = page.locator("table tbody tr select").first();
    await statusSelect.selectOption("contacted");
  });
});
