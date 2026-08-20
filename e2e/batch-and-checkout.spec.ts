import { test, expect } from "@playwright/test";

test.describe("Live Batches & Checkout Workflow", () => {
  test("views batches, opens checkout modal and completes payment flow", async ({ page }) => {
    await page.goto("/live-batches");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Choose a rhythm that fits." })).toBeVisible();

    // Click first "Enrol Online" button
    const enrolBtn = page.getByRole("button", { name: "Enrol Online" }).first();
    await expect(enrolBtn).toBeVisible();
    await enrolBtn.click();

    // Verify modal is open
    await expect(page.getByText("Secure Checkout")).toBeVisible({ timeout: 10000 });

    // Fill customer checkout details
    await page.locator('input[placeholder="e.g. Priya Sharma"]').last().fill("Kiran Kumar");
    await page
      .locator('input[placeholder="priya@example.com"]')
      .last()
      .fill("kiran.kumar@example.com");
    await page.locator('input[placeholder="9876543210"]').last().fill("9876500112");

    // Click Proceed to Pay
    const payBtn = page.locator('button:has-text("Proceed to Pay")');
    await payBtn.click();

    // Expect order creation confirmation in modal
    await expect(page.getByText("Order Created")).toBeVisible({ timeout: 10000 });

    // Click complete payment button
    const completePaymentBtn = page.locator('button:has-text("Complete Payment")');
    await completePaymentBtn.click();

    // Verify redirection to payment return page with success confirmation
    await expect(page).toHaveURL(/\/payment-return/, { timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Payment Successful!" })).toBeVisible();
    await expect(page.getByText("Enrolment Confirmed")).toBeVisible();
  });
});
