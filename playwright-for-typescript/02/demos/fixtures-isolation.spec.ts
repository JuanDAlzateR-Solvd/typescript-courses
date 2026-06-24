import { test as base, expect, Page } from '@playwright/test';

type Fixtures = {
  docsPage: Page;
};

const test = base.extend<Fixtures>({
  docsPage: async ({ page }, use, testInfo) => {
    // Shared setup (same structured navigation entry point)
    await page.goto('https://playwright.dev/', { waitUntil: 'domcontentloaded' });

    // Visual badge to show fixture isolation
    await page.evaluate((title) => {
      const badge = document.createElement('div');
      badge.textContent = `Fixture init → ${title}`;
      badge.style.cssText =
        'position:fixed;top:16px;right:16px;z-index:999999;padding:10px 12px;border-radius:10px;' +
        'background:rgba(0,0,0,0.75);color:white;font:700 13px system-ui';
      document.body.appendChild(badge);
    }, testInfo.title);

    await use(page);
  },
});

test.describe('Codegen structured flow - fixture isolation demo', () => {

  test('Test A: structured flow + create state', async ({ docsPage }) => {
    await docsPage.pause();

    // SAME structured navigation
    await docsPage.getByRole('link', { name: /get started/i }).click();
    await docsPage.getByRole('link', { name: /command line/i }).click();
    await docsPage.getByRole('link', { name: 'Clear Cache', exact: true }).click();
    await docsPage.getByRole('link', { name: /parallelism/i }).click();
    await docsPage.getByRole('link', { name: 'API', exact: true }).click();

    await expect(docsPage).toHaveURL(/api/i);

    // Create state (this should NOT leak)
    await docsPage.evaluate(() => {
      localStorage.setItem('globomantics_state', 'TEST_A');
    });

    await docsPage.pause();
  });

  test('Test B: structured flow again — verify isolation', async ({ docsPage }) => {
    // SAME structured navigation again
    await docsPage.getByRole('link', { name: /get started/i }).click();
    await docsPage.getByRole('link', { name: /command line/i }).click();
    await docsPage.getByRole('link', { name: 'Clear Cache', exact: true }).click();
    await docsPage.getByRole('link', { name: /parallelism/i }).click();
    await docsPage.getByRole('link', { name: 'API', exact: true }).click();

    await expect(docsPage).toHaveURL(/api/i);

    // Verify state is gone
    const stored = await docsPage.evaluate(() => localStorage.getItem('globomantics_state'));
    expect(stored).toBeNull();

    await docsPage.pause();
  });

});
