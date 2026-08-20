import { test, expect } from "@playwright/test";

test.describe("Content Protection Guards", () => {
  test("prevents right click context menu on the page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("header")).toBeVisible();

    // Dispatch contextmenu event and assert that default is prevented
    const isPrevented = await page.evaluate(() => {
      const event = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      document.dispatchEvent(event);
      return event.defaultPrevented;
    });

    expect(isPrevented).toBe(true);
  });

  test("prevents DevTools key shortcuts (F12, Ctrl+Shift+I, Ctrl+U)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("header")).toBeVisible();

    // Test F12
    const f12Prevented = await page.evaluate(() => {
      const event = new KeyboardEvent("keydown", {
        key: "F12",
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(event);
      return event.defaultPrevented;
    });
    expect(f12Prevented).toBe(true);

    // Test Ctrl+Shift+I (Inspect)
    const inspectPrevented = await page.evaluate(() => {
      const event = new KeyboardEvent("keydown", {
        key: "I",
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(event);
      return event.defaultPrevented;
    });
    expect(inspectPrevented).toBe(true);

    // Test Ctrl+U (View Source)
    const viewSourcePrevented = await page.evaluate(() => {
      const event = new KeyboardEvent("keydown", {
        key: "U",
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(event);
      return event.defaultPrevented;
    });
    expect(viewSourcePrevented).toBe(true);
  });

  test("prevents copy and dragstart events on non-input page content", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("header")).toBeVisible();

    const copyPrevented = await page.evaluate(() => {
      const event = new Event("copy", { bubbles: true, cancelable: true });
      document.body.dispatchEvent(event);
      return event.defaultPrevented;
    });
    expect(copyPrevented).toBe(true);

    const dragPrevented = await page.evaluate(() => {
      const event = new DragEvent("dragstart", { bubbles: true, cancelable: true });
      document.body.dispatchEvent(event);
      return event.defaultPrevented;
    });
    expect(dragPrevented).toBe(true);
  });

  test("allows typing and interacting in form input fields", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("domcontentloaded");

    const nameInput = page.locator('input[placeholder="e.g. Priya Sharma"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill("Test Learner");
    await expect(nameInput).toHaveValue("Test Learner");
  });
});
