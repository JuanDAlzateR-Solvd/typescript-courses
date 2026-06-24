import { test, expect } from '@playwright/test';

test('Synchronization demo', async ({ page }) => {

  await page.goto('https://demo.playwright.dev/todomvc');

  const input = page.getByPlaceholder('What needs to be done?');

  // Step 1: Auto-wait
  await input.fill('Auto-wait example');
  await input.press('Enter');

  await expect(page.locator('.todo-list > li')).toHaveCount(1);
  await page.pause();

  // Step 2: BAD (race condition - may be flaky)
  input.fill('Race condition example');
  input.press('Enter');

  await expect(page.locator('.todo-list > li')).toHaveCount(2);
  await page.pause();

  // Step 3: FIX (proper sequencing)
  await input.fill('Synchronized example');
  await input.press('Enter');

  await expect(page.locator('.todo-list > li')).toHaveCount(3);
  await page.pause();

  // Step 4: Explicit wait (correct for UI state)
  await input.fill('Explicit wait example');
  await input.press('Enter');

  // Explicit synchronization using waitForFunction
  await page.waitForFunction(() => {
    return document.querySelectorAll('.todo-list > li').length === 4;
  });

  await expect(page.locator('.todo-list > li')).toHaveCount(4);
  await page.pause();

});