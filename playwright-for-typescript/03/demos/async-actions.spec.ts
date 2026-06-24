import { test, expect, Page } from '@playwright/test';

/**
 * Visual step marker for clarity
 */
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

test('Performing actions safely with async/await', async ({ page }) => {
  // clean state
  await page.addInitScript(() => window.localStorage.clear());

  await page.goto('https://demo.playwright.dev/todomvc', {
    waitUntil: 'domcontentloaded',
  });

  await expect(page).toHaveTitle(/TodoMVC/i);

  await pausePoint(page, 'Step 1: Page loaded – stable baseline');

  const input = page.getByPlaceholder('What needs to be done?');

  // async action pattern
  await input.fill('Prepare shipment #A-123');
  await input.press('Enter');

  await expect(page.locator('.todo-list > li')).toHaveCount(1);

  await pausePoint(page, 'Step 2: Awaited actions → deterministic result');

  const checkbox = page.getByRole('checkbox', { name: 'Toggle Todo' });

  // safe sequencing
  await checkbox.check();
  await expect(checkbox).toBeChecked();

  await pausePoint(page, 'Step 3: Await action → then assert state');

  // auto-wait behavior
  await input.fill('Prepare shipment #B-987');
  await input.press('Enter');

  await expect(page.locator('.todo-list > li')).toHaveCount(2);

  await pausePoint(page, 'Step 4: Playwright auto-waiting in action');
});