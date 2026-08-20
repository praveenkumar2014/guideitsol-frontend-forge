import { test, expect } from "@playwright/test";

test.describe("Enquiry & Lead Capture Workflows", () => {
  test("submits enquiry from the contact page with validation", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    const nameInput = page.locator('input[placeholder="e.g. Priya Sharma"]');
    await expect(nameInput).toBeVisible();

    // Fill and submit form
    await nameInput.fill("Aarav Test");
    await page.locator('input[placeholder="priya@example.com"]').fill("aarav.test@example.com");
    await page.locator('input[placeholder="+91 9876543210"]').fill("9876543210");
    await page
      .locator('textarea[placeholder*="Tell us about your learning background"]')
      .fill("I would like syllabus details and upcoming batch dates for Java Full Stack.");

    const submitBtn = page.getByRole("button", { name: "Send Enquiry" });
    await submitBtn.click();

    // Expect success confirmation screen
    await expect(page.getByText("Enquiry Dispatched")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Reference:")).toBeVisible();
  });

  test("opens enquiry dialog from course page and submits", async ({ page }) => {
    await page.goto("/courses/java-full-stack-development");
    await page.waitForLoadState("networkidle");

    const askAdvisorBtn = page.getByRole("button", { name: "Ask Counsellor Questions" });
    await expect(askAdvisorBtn).toBeVisible();
    await askAdvisorBtn.click();

    // Verify modal appears
    await expect(page.getByText("Enquire about Java Full Stack Development")).toBeVisible();

    // Fill modal form
    await page.locator('input[placeholder="e.g. Priya Sharma"]').last().fill("Rohan Verma");
    await page.locator('input[placeholder="you@example.com"]').fill("rohan.verma@example.com");
    await page.locator('input[placeholder="+91 9876543210"]').last().fill("9123456780");

    await page.getByRole("button", { name: "Submit Enquiry" }).click();

    // Expect modal confirmation
    await expect(page.getByText("Enquiry Registered")).toBeVisible({ timeout: 10000 });
  });
});
