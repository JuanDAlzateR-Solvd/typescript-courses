import { test, expect, devices } from '@playwright/test';

// Define an iPhone device profile
const iPhone = devices['iPhone 13'];

// Desktop test
test('Desktop viewport - Globomantics responsive check', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('https://demo.playwright.dev/todomvc');

  await expect(page).toHaveTitle(/TodoMVC/);

  await page.pause(); // Pause to show desktop viewport in action
});

// Mobile emulation test
test.use({
  ...iPhone,
});

test('Mobile viewport - iPhone emulation', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  await expect(page).toHaveTitle(/TodoMVC/);

  await page.pause(); // Pause to show mobile emulation in action
});

// This script will  run the following tests

// chromium	Desktop viewport
// chromium	Mobile viewport
// firefox	Desktop viewport
// firefox	Mobile viewport
// webkit	Desktop viewport
// webkit	Mobile viewport