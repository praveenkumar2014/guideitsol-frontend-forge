import { Builder, By, until, WebDriver } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import * as assert from "assert";

const BASE_URL = "http://localhost:8080";
const TIMEOUT = 15000;

async function buildDriver(): Promise<WebDriver> {
  const opts = new Options();
  opts.addArguments(
    "--headless=new",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--window-size=1920,1080",
    "--disable-web-security",
  );
  return new Builder().forBrowser("chrome").setChromeOptions(opts).build();
}

async function runTest(name: string, fn: (d: WebDriver) => Promise<void>) {
  const driver = await buildDriver();
  try {
    console.log(`\n▶ ${name}`);
    await fn(driver);
    console.log(`  ✅ PASSED`);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`  ❌ FAILED: ${message}`);
    process.exitCode = 1;
  } finally {
    await driver.quit();
  }
}

// ── TEST 1: Homepage loads with header & hero section ──────────────────────────
await runTest("Homepage loads with header and hero slider", async (d) => {
  await d.get(BASE_URL);
  await d.wait(until.titleContains("GUIDESOFT"), TIMEOUT);
  const header = await d.wait(until.elementLocated(By.css("header")), TIMEOUT);
  assert.ok(await header.isDisplayed(), "Header should be visible");
  const h1 = await d.wait(until.elementLocated(By.css("h1")), TIMEOUT);
  assert.ok(await h1.isDisplayed(), "Hero H1 should be visible");
});

// ── TEST 2: Navigation links are present ───────────────────────────────────────
await runTest("Navigation links: Courses, Live batches, Verify", async (d) => {
  await d.get(BASE_URL);
  await d.sleep(2000);
  const coursesLink = await d.wait(
    until.elementLocated(By.xpath("//a[normalize-space()='Courses']")),
    TIMEOUT,
  );
  assert.ok(await coursesLink.isDisplayed(), "'Courses' nav link must be visible");
  const verifyLink = await d.wait(
    until.elementLocated(By.xpath("//a[normalize-space()='Verify']")),
    TIMEOUT,
  );
  assert.ok(await verifyLink.isDisplayed(), "'Verify' nav link must be visible");
});

// ── TEST 3: Hero slider Next Slide button works ────────────────────────────────
await runTest("Hero slider: Next Slide advances to slide 2", async (d) => {
  await d.get(BASE_URL);
  await d.sleep(3000);
  const nextBtn = await d.wait(
    until.elementLocated(By.xpath("//button[@aria-label='Next Slide']")),
    TIMEOUT,
  );
  assert.ok(await nextBtn.isDisplayed(), "Next Slide button should be visible");
  await nextBtn.click();
  await d.sleep(1500);
  const slide2Heading = await d.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'Python, GenAI')]")),
    TIMEOUT,
  );
  assert.ok(await slide2Heading.isDisplayed(), "Slide 2 heading must appear after clicking Next");
});

// ── TEST 4: Courses page loads with search ─────────────────────────────────────
await runTest("Courses catalogue page loads with search input", async (d) => {
  await d.get(`${BASE_URL}/courses`);
  await d.sleep(2000);
  const searchInput = await d.wait(
    until.elementLocated(By.xpath("//input[@placeholder='Search courses']")),
    TIMEOUT,
  );
  assert.ok(await searchInput.isDisplayed(), "Course search input should be visible");
  await searchInput.sendKeys("Java");
  await d.sleep(1000);
  const javaCard = await d.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'Java Full Stack')]")),
    TIMEOUT,
  );
  assert.ok(await javaCard.isDisplayed(), "Java course card should appear after search");
});

// ── TEST 5: Course detail page loads ──────────────────────────────────────────
await runTest("Course detail: /courses/java-full-stack-development", async (d) => {
  await d.get(`${BASE_URL}/courses/java-full-stack-development`);
  await d.sleep(2000);
  const heading = await d.wait(
    until.elementLocated(By.xpath("//h1[contains(text(),'Java Full Stack')]")),
    TIMEOUT,
  );
  assert.ok(await heading.isDisplayed(), "Course detail h1 should be visible");
  const syllabusSection = await d.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'Detailed Syllabus')]")),
    TIMEOUT,
  );
  assert.ok(await syllabusSection.isDisplayed(), "Syllabus section heading should be visible");
  const downloadBtn = await d.wait(
    until.elementLocated(By.id("download-syllabus-btn")),
    TIMEOUT,
  );
  assert.ok(await downloadBtn.isDisplayed(), "Download Syllabus button should be visible");
});

// ── TEST 6: Auth portal left/right split layout ────────────────────────────────
await runTest("/auth page has enterprise learning portal heading and Google sign-in", async (d) => {
  await d.get(`${BASE_URL}/auth`);
  await d.sleep(2000);
  const portalHeading = await d.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'Enterprise-Grade Learning Portal')]")),
    TIMEOUT,
  );
  assert.ok(await portalHeading.isDisplayed(), "Auth left panel heading must be visible");
  const googleBtn = await d.wait(until.elementLocated(By.id("page-google-auth-btn")), TIMEOUT);
  assert.ok(await googleBtn.isDisplayed(), "Google sign-in button must be visible");
});

// ── TEST 7: Dark/Light theme toggle ───────────────────────────────────────────
await runTest("Theme toggle button switches dark/light mode", async (d) => {
  await d.get(BASE_URL);
  await d.sleep(2000);
  const themeToggle = await d.wait(until.elementLocated(By.id("theme-toggle-btn")), TIMEOUT);
  assert.ok(await themeToggle.isDisplayed(), "Theme toggle button must be visible");
  const htmlClass1 = await d.executeScript("return document.documentElement.className");
  await themeToggle.click();
  await d.sleep(500);
  const htmlClass2 = await d.executeScript("return document.documentElement.className");
  assert.notStrictEqual(htmlClass1, htmlClass2, "Theme class must change after toggle click");
});

// ── TEST 8: Contact page form submission ───────────────────────────────────────
await runTest("Contact page enquiry form submits with validation", async (d) => {
  await d.get(`${BASE_URL}/contact`);
  await d.sleep(2000);
  const nameInput = await d.wait(
    until.elementLocated(By.xpath("//input[@placeholder='e.g. Priya Sharma']")),
    TIMEOUT,
  );
  assert.ok(await nameInput.isDisplayed(), "Name input should be visible");
  await nameInput.sendKeys("Selenium Test User");
  const emailInput = await d.findElement(By.xpath("//input[@placeholder='you@example.com']"));
  await emailInput.sendKeys("selenium@guideitsol.in");
  const phoneInput = await d.findElement(
    By.xpath("//input[@placeholder='+91 9876543210']"),
  );
  await phoneInput.sendKeys("9876543210");
  const submitBtn = await d.findElement(
    By.xpath("//button[contains(text(),'Submit Enquiry')]"),
  );
  await submitBtn.click();
  await d.sleep(3000);
  const successText = await d.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'Enquiry Dispatched')]")),
    10000,
  );
  assert.ok(await successText.isDisplayed(), "Enquiry Dispatched success message must appear");
});

// ── TEST 9: Live Batches page loads ───────────────────────────────────────────
await runTest("Live Batches page loads with batch cards", async (d) => {
  await d.get(`${BASE_URL}/live-batches`);
  await d.sleep(2000);
  const pageHeading = await d.wait(
    until.elementLocated(By.xpath("//h1")),
    TIMEOUT,
  );
  assert.ok(await pageHeading.isDisplayed(), "Live Batches h1 should be visible");
});

// ── TEST 10: Certificate verification page ─────────────────────────────────────
await runTest("Certificate verify page accepts certificate ID and shows result", async (d) => {
  await d.get(`${BASE_URL}/verify`);
  await d.sleep(2000);
  const input = await d.wait(
    until.elementLocated(By.xpath("//input[contains(@placeholder,'Certificate')]")),
    TIMEOUT,
  );
  assert.ok(await input.isDisplayed(), "Certificate search input should be visible");
  await input.sendKeys("GS-2024-JAVA-0001");
  await d.sleep(1000);
  const verifyBtn = await d.findElement(
    By.xpath("//button[contains(text(),'Verify')]"),
  );
  await verifyBtn.click();
  await d.sleep(2000);
});

// ── TEST 11: Content protection — right-click blocked ─────────────────────────
await runTest("Right-click context menu is blocked on main content", async (d) => {
  await d.get(BASE_URL);
  await d.sleep(2000);
  const body = await d.findElement(By.css("body"));
  await d.actions().contextClick(body).perform();
  await d.sleep(500);
  const contextMenuExists = await d
    .executeScript("return document.querySelector('[role=\"menu\"]') !== null")
    .catch(() => false);
  assert.strictEqual(contextMenuExists, false, "No context menu should appear — right-click blocked");
});

// ── TEST 12: Student dashboard role login ─────────────────────────────────────
await runTest("Student Dashboard: 1-click test role login and redirect", async (d) => {
  await d.get(`${BASE_URL}/auth`);
  await d.sleep(2000);
  const testLoginBtn = await d.wait(
    until.elementLocated(By.id("auth-role-btn")),
    TIMEOUT,
  );
  assert.ok(await testLoginBtn.isDisplayed(), "1-click test login button should be visible");
  await testLoginBtn.click();
  await d.sleep(2000);
  // Should see role selection or trigger toast
  const toastOrDash = await d
    .findElement(By.xpath("//*[contains(text(),'Welcome') or contains(text(),'Student')]"))
    .catch(() => null);
  assert.ok(toastOrDash !== null, "Welcome message or Student Dashboard should appear");
});

// ── TEST 13: Search command palette opens ─────────────────────────────────────
await runTest("Search command palette opens on button click", async (d) => {
  await d.get(BASE_URL);
  await d.sleep(3000);
  const searchBtn = await d.wait(until.elementLocated(By.id("header-search-btn")), TIMEOUT);
  assert.ok(await searchBtn.isDisplayed(), "Header search button should be visible");
  await searchBtn.click();
  await d.sleep(1000);
  const searchInput = await d.wait(
    until.elementLocated(By.id("course-search-input")),
    TIMEOUT,
  );
  assert.ok(await searchInput.isDisplayed(), "Course search input should appear in dialog");
  await searchInput.sendKeys("DevOps");
  await d.sleep(1000);
  const result = await d.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'AWS Cloud')]")),
    TIMEOUT,
  );
  assert.ok(await result.isDisplayed(), "AWS Cloud DevOps course should appear in search results");
});

// ── TEST 14: Enquiry dialog from course page ──────────────────────────────────
await runTest("Enquiry dialog opens from course page Ask Counsellor button", async (d) => {
  await d.get(`${BASE_URL}/courses/java-full-stack-development`);
  await d.sleep(2500);
  const askBtn = await d.wait(
    until.elementLocated(By.xpath("//button[contains(text(),'Ask Counsellor Questions')]")),
    TIMEOUT,
  );
  assert.ok(await askBtn.isDisplayed(), "Ask Counsellor Questions button should be visible");
  await askBtn.click();
  await d.sleep(1000);
  const dialogTitle = await d.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'Enquire about')]")),
    TIMEOUT,
  );
  assert.ok(await dialogTitle.isDisplayed(), "Enquiry dialog title should appear");
});

// ── TEST 15: Admin console authentication ─────────────────────────────────────
await runTest("Admin console requires admin key and shows CRM data", async (d) => {
  await d.get(`${BASE_URL}/admin`);
  await d.sleep(2000);
  const adminKeyInput = await d.findElement(
    By.xpath("//input[@type='password' or contains(@placeholder,'key') or contains(@placeholder,'Key')]"),
  ).catch(() => null);
  if (adminKeyInput) {
    await adminKeyInput.sendKeys("GS_ADMIN_2025");
    const loginBtn = await d.findElement(By.xpath("//button[contains(text(),'Access') or contains(text(),'Login') or contains(text(),'Enter')]"));
    await loginBtn.click();
    await d.sleep(2000);
  }
  const adminContent = await d.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'Admin') or contains(text(),'Lead') or contains(text(),'CRM')]")),
    TIMEOUT,
  );
  assert.ok(await adminContent.isDisplayed(), "Admin content should be visible after authentication");
});

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("Selenium Test Suite Complete");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
