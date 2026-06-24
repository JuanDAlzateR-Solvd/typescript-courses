import { test, expect, devices } from '@playwright/test';

const iPhone = devices['iPhone 13'];

async function runScenario(page: any, label: string) {
  await page.goto('https://playwright.dev', { waitUntil: 'domcontentloaded' });

  // Verify main heading exists (stable across desktop + mobile)
  const heading = page.getByRole('heading', {
    name: /Playwright enables reliable end-to-end testing/i,
  });

  await expect(heading).toBeVisible();

  const getStarted = page.getByRole('link', { name: /get started/i });
  await expect(getStarted).toBeVisible();

  // Visual badge to indicate which scenario is running (desktop vs mobile)
  await page.evaluate((text) => {
    const badge = document.createElement('div');
    badge.textContent = text;
    badge.style.cssText =
      'position:fixed;top:16px;left:16px;z-index:999999;padding:10px 14px;border-radius:10px;' +
      'background:rgba(0,0,0,0.75);color:white;font:700 14px system-ui';
    document.body.appendChild(badge);
  }, label);
}

test.describe('Cross-platform behavior in practice', () => {
  test('Desktop: Playwright homepage behavior', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await runScenario(page, 'Desktop run');
    await page.pause();
  });
});

test.use({ ...iPhone });

test('Mobile: iPhone emulation homepage behavior', async ({ page }) => {
  await runScenario(page, 'Mobile run (iPhone 13)');
  await page.pause();
});