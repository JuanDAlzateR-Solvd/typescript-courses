import { test, expect } from '@playwright/test';

test('Trace demo - capture failure artifacts', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  const input = page.getByPlaceholder('What needs to be done?');

  // Create item
  await input.fill('Trace demo task');
  await input.press('Enter');

  await expect(page.locator('.todo-list > li')).toHaveCount(1);
  await page.pause();

  // INTENTIONAL FAILURE
  await expect(page.getByText('This item does NOT exist')).toBeVisible();
});