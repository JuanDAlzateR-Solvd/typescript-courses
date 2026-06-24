import { test, expect } from '@playwright/test';

test.describe('Environment-aware tests', () => {

  test('Runs in any environment @smoke', async ({ page }, testInfo) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    console.log('Environment:', testInfo.config.metadata.environment);

    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    await page.pause();
  });

  test('Only relevant for staging @staging', async ({ page }, testInfo) => {

    if (testInfo.config.metadata.environment !== 'staging') {
      test.skip('Skipping: not running in staging');
    }

    await page.goto('https://demo.playwright.dev/todomvc');

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill(`Task A`);
    await input.press('Enter');

    await expect(page).toHaveTitle(/TodoMVC/i);

    await page.pause();
  });
});