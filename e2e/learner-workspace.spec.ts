import { test, expect } from "@playwright/test";

test.describe("Student Dashboard & Interactive Course Player", () => {
  test("loads student dashboard with progress tabs and milestone info", async ({ page }) => {
    await page.goto("/student-dashboard");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Learner Workspace")).toBeVisible();
    await expect(page.getByText("Welcome back, Priya!")).toBeVisible();

    // Switch to Assignments tab
    const assignmentsTab = page.locator("#tab-assignments");
    await expect(assignmentsTab).toBeVisible();
    await assignmentsTab.click();
    await expect(page.getByText("Project Submissions & Code Reviews")).toBeVisible({
      timeout: 10000,
    });

    // Switch to Certificates tab
    const certTab = page.locator("#tab-certificates");
    await expect(certTab).toBeVisible();
    await certTab.click();
    await expect(page.getByText("Verified Certificates of Completion")).toBeVisible({
      timeout: 10000,
    });
  });

  test("interacts with course player, toggles completion and takes notes", async ({ page }) => {
    await page.goto("/course-player/java-full-stack-development");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Course Curriculum")).toBeVisible();
    await expect(page.getByText("GUIDESOFT Virtual Lab Environment")).toBeVisible();

    // Toggle complete button
    const markCompleteBtn = page
      .locator('button:has-text("Mark as Complete"), button:has-text("Completed")')
      .first();
    await expect(markCompleteBtn).toBeVisible();
    await markCompleteBtn.click();

    // Open notes drawer
    const notesBtn = page.locator("#notes-toggle-btn");
    await expect(notesBtn).toBeVisible();
    await notesBtn.click();
    await expect(page.getByText("Your Notes for this Lesson")).toBeVisible({ timeout: 10000 });

    // Type notes
    const notesTextarea = page.locator('textarea[placeholder*="Jot down code snippets"]');
    await notesTextarea.fill("Mastered Spring Boot dependency injection and repository layers.");

    const saveNotesBtn = page.getByRole("button", { name: "Save Notes" });
    await saveNotesBtn.click();

    // Test Next Lesson button
    const nextBtn = page.getByRole("button", { name: "Next Lesson" });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
  });
});
