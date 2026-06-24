import { test, expect } from '@playwright/test';

test('Flaky test demo - timing issue', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  const input = page.getByPlaceholder('What needs to be done?');

  // Add item
  await input.fill('Flaky item');
  await input.press('Enter');

  const items = page.locator('.todo-list > li');

  // Not awaited properly (race condition)
  input.fill('Second item');
  input.press('Enter');

  // This can intermittently fail
  await expect(items).toHaveCount(2);

  await page.pause();
});