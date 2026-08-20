import { test, expect } from "@playwright/test";

test.describe("Certificate Verification", () => {
  test("searches and verifies a valid certificate ID", async ({ page }) => {
    await page.goto("/verify");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("heading", { name: "Certificate Lookup" })).toBeVisible();

    const sampleLink = page.getByRole("link", { name: /GS-2026-0142/ });
    await expect(sampleLink).toBeVisible();
    await sampleLink.click();

    await expect(page).toHaveURL(/\/verify\/GS-2026-0142/);
    await expect(page.getByText("Verified Authenticity")).toBeVisible();
    await expect(page.getByText("Priya Sharma")).toBeVisible();
    await expect(page.getByText("Java Full Stack Development")).toBeVisible();
  });

  test("handles nonexistent certificate gracefully", async ({ page }) => {
    await page.goto("/verify/GS-NONEXISTENT-999");
    await expect(page.getByText("No Certificate Found")).toBeVisible();
  });
});
