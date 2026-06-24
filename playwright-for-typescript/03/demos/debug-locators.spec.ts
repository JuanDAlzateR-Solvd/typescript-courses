import { test, expect, Page } from '@playwright/test';

async function pausePoint(page: Page, label: string) {
  await page.evaluate((text) => {
    const existing = document.querySelector('.demo-badge');
    if (existing) existing.remove();

    const badge = document.createElement('div');
    badge.className = 'demo-badge';
    badge.textContent = text;
    badge.style.cssText =
      'position:fixed;top:16px;left:16px;z-index:999999;padding:10px 14px;border-radius:10px;' +
      'background:rgba(0,0,0,0.82);color:#fff;font:700 13px system-ui';
    document.body.appendChild(badge);
  }, label);

  await page.pause();
}

test('Debugging locator problems with Playwright Inspector', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  await pausePoint(page, 'Step 1: Baseline – open Playwright Inspector');

  const input = page.getByPlaceholder('What needs to be done?');

  await input.fill('Debug locator example');
  await input.press('Enter');

  await expect(page.locator('.todo-list > li')).toHaveCount(1);

  await pausePoint(page, 'Step 2: Todo created – now we will introduce a locator bug');

  // intentionally broken locator
  // const brokenLocator = page.getByRole('button', { name: 'Delete Todo' });
  const brokenLocator = page.getByRole('button', { name: 'Delete' });

  await pausePoint(page, 'Step 3: This locator is incorrect – inspect the element');

  // This will fail
  await brokenLocator.click();

  await pausePoint(page, 'Step 4: Fix the locator using Inspector tools');

});