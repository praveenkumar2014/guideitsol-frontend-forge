import { test, expect } from "@playwright/test";

test.describe("Navigation & Course Catalogue", () => {
  test("loads homepage with navigation links and main CTAs", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByRole("link", { name: "Courses", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Live batches", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Verify", exact: true })).toBeVisible();

    const heroHeading = page.locator("h1");
    await expect(heroHeading).toBeVisible();

    // Verify 8 slide carousel controls
    const nextBtn = page.locator('button[aria-label="Next Slide"]');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await expect(page.getByRole("heading", { name: "Python, GenAI & Agentic Systems" })).toBeVisible();
  });

  test("searches and filters courses in the catalogue", async ({ page }) => {
    await page.goto("/courses");
    await page.waitForLoadState("domcontentloaded");

    // Search for Java
    const searchInput = page.locator('input[placeholder="Search courses"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill("Java");
    await expect(page.getByText("Java Full Stack Development").first()).toBeVisible();

    // Clear search and filter by category
    await searchInput.fill("");
    const categoryBtn = page.getByRole("button", { name: "Cloud & DevOps" });
    await categoryBtn.click();
    await expect(page.getByText("AWS Cloud & DevOps").first()).toBeVisible();
  });

  test("navigates to course detail and verifies curriculum modules", async ({ page }) => {
    await page.goto("/courses/java-full-stack-development");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByRole("heading", { name: "Java Full Stack Development" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Download Full Syllabus PDF" })).toBeVisible();

    // Verify curriculum accordion is present
    await expect(page.getByText("A week-by-week path to useful work.")).toBeVisible();
    await expect(page.getByText("Java Core & OOP")).toBeVisible();
  });
});
