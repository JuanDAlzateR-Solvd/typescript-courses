import { test as base, expect, Page } from '@playwright/test';

type Fixtures = {
  docsPage: Page;
};

// Helper: pause only when running Chromium
async function pauseIfChromium(page: Page, testInfo: any) {
  if (testInfo.project.name === 'chromium') {
    await page.pause();
  }
}

const test = base.extend<Fixtures>({
  docsPage: async ({ page }, use, testInfo) => {
    await page.goto('https://playwright.dev/', { waitUntil: 'domcontentloaded' });

    const engine = testInfo.project.name;

    await page.evaluate(({ title, engine }) => {
      const badge = document.createElement('div');
      badge.textContent = `Engine: ${engine} → ${title}`;
      badge.style.cssText =
        'position:fixed;top:16px;right:16px;z-index:999999;padding:10px 12px;border-radius:10px;' +
        'background:rgba(0,0,0,0.75);color:white;font:700 13px system-ui';
      document.body.appendChild(badge);
    }, { title: testInfo.title, engine });

    // Pause only on Chromium (fixture stage)
    await pauseIfChromium(page, testInfo);

    await use(page);
  },
});

async function navigateToApi(docsPage: Page, testInfo: any) {
  await docsPage.getByRole('link', { name: /get started/i }).click();
  await docsPage.getByRole('link', { name: /command line/i }).click();
  await docsPage.getByRole('link', { name: 'Clear Cache', exact: true }).click();
  await docsPage.getByRole('link', { name: /parallelism/i }).click();
  await docsPage.getByRole('link', { name: 'API', exact: true }).click();

  await expect(docsPage).toHaveURL(/api/i);

  // Pause only on Chromium (after navigation)
  await pauseIfChromium(docsPage, testInfo);
}

test.describe('Parallel runs across browsers (with shared fixtures)', () => {

  test('Test A: structured flow + create state', async ({ docsPage }, testInfo) => {
    await navigateToApi(docsPage, testInfo);

    await docsPage.evaluate(() => {
      localStorage.setItem('globomantics_state', 'TEST_A');
    });

    const stored = await docsPage.evaluate(() => localStorage.getItem('globomantics_state'));
    expect(stored).toBe('TEST_A');

    // Pause only on Chromium (state visible)
    await pauseIfChromium(docsPage, testInfo);
  });

  test('Test B: structured flow again — verify isolation', async ({ docsPage }, testInfo) => {
    await navigateToApi(docsPage, testInfo);

    const stored = await docsPage.evaluate(() => localStorage.getItem('globomantics_state'));
    expect(stored).toBeNull();

    // Pause only on Chromium (isolation visible)
    await pauseIfChromium(docsPage, testInfo);
  });

});
