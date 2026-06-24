import { test, expect, Page } from '@playwright/test';
import assert from 'node:assert/strict';

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

/**
 * Artificial delay to simulate a real app (API + render time).
 * This makes the difference between auto-retry expect() and single-shot assertions visible.
 */
async function simulateAsyncUiDelay(page: Page) {
  await page.evaluate(() => new Promise((r) => setTimeout(r, 250)));
}

test.describe('Comparing assertion styles', () => {
  test('A) Playwright expect() (auto-retry, stable)', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto('https://demo.playwright.dev/todomvc', { waitUntil: 'domcontentloaded' });

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Globomantics shipment #A-123');
    await input.press('Enter');

    // simulate real-world delay before UI settles
    await simulateAsyncUiDelay(page);

    // Auto-retrying assertion (waits until count becomes 1)
    await expect(page.locator('.todo-list > li')).toHaveCount(1);

    await pausePoint(page, 'PASS: expect() waited until the UI reached the expected state');
  });

  test('B) Standard TS assertion (single-shot, can be flaky)', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto('https://demo.playwright.dev/todomvc', { waitUntil: 'domcontentloaded' });

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Globomantics shipment #B-987');
    await input.press('Enter');

    // simulate real-world delay before UI settles
    await simulateAsyncUiDelay(page);

    // Single-shot read: no retries, just "what is the count right now?"
    const countNow = await page.locator('.todo-list > li').count();

    // Standard TypeScript/Node assertion (no auto-waiting)
    assert.equal(countNow, 1, `Expected 1 todo item, but got ${countNow}`);

    await pausePoint(page, 'This may PASS or FAIL depending on timing (single-shot assertion)');
  });
});