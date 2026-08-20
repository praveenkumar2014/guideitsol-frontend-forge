import { test, expect } from "@playwright/test";

test.describe("Live Batches & Checkout Workflow", () => {
  test("views batches, opens checkout modal and completes payment flow", async ({ page }) => {
    await page.goto("/live-batches");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Choose a rhythm that fits." })).toBeVisible();

    // Click first "Enrol Online" button using exact ID
    const enrolBtn = page.locator("#enrol-batch-java-aug-26");
    await expect(enrolBtn).toBeVisible();
    await enrolBtn.click({ force: true });

    // Verify modal is open
    await expect(page.getByText("Enroll in Cohort")).toBeVisible({ timeout: 10000 });

    // Fill customer checkout details
    await page.locator('input[placeholder="e.g. Priya Sharma"]').last().fill("Kiran Kumar");
    await page
      .locator('input[placeholder="priya@example.com"]')
      .last()
      .fill("kiran.kumar@example.com");
    await page.locator('input[placeholder="+91 98765 43210"]').last().fill("9876500112");

    // Click Proceed to Payment
    const payBtn = page.locator('button:has-text("Proceed to Payment")');
    await payBtn.click({ force: true });

    // Expect real-time UPI payment screen with QR code and UPI ID
    await expect(page.getByText("Scan with any UPI App to Pay")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Q166755499@ybl")).toBeVisible();

    // Click Verify & Confirm
    const verifyBtn = page.locator('button:has-text("Verify & Confirm")');
    await expect(verifyBtn).toBeVisible();
    await verifyBtn.click({ force: true });

    // Verify redirection to payment return page with success confirmation
    await expect(page).toHaveURL(/\/payment-return/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: "Payment Successful!" })).toBeVisible();
    await expect(page.getByText("Enrolment Confirmed")).toBeVisible();
  });
});
