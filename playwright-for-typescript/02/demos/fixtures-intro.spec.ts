import { test as base, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

type Fixtures = {
  docsPage: Page;
};

const test = base.extend<Fixtures>({
  docsPage: async ({ page }, use) => {
    // Fixture setup
    await page.goto('https://playwright.dev/', { waitUntil: 'domcontentloaded' });

    // Visual badge to see the fixture executed
    await page.evaluate(() => {
      const badge = document.createElement('div');
      badge.textContent = 'Fixture: docsPage initialized';
      badge.style.cssText =
        'position:fixed;top:16px;right:16px;z-index:999999;padding:10px 12px;border-radius:10px;' +
        'background:rgba(0,0,0,0.75);color:white;font:700 13px system-ui';
      document.body.appendChild(badge);
    });

    await use(page);
  },
});

test.describe('Codegen recording - structured flow (with fixtures)', () => {
  test('Playwright docs first, then VS Code page + download', async ({ docsPage }) => {
    await docsPage.pause();

    // Playwright Docs Navigation
    await docsPage.getByRole('link', { name: /get started/i }).click();
    await docsPage.getByRole('link', { name: /command line/i }).click();
    await docsPage.getByRole('link', { name: 'Clear Cache', exact: true }).click();
    await docsPage.getByRole('link', { name: /parallelism/i }).click();
    await docsPage.getByRole('link', { name: 'API', exact: true }).click();

    await expect(docsPage).toHaveURL(/api/i);
    await docsPage.getByRole('button', { name: /copy code to clipboard/i }).nth(2).click();

    // VS Code Popup + Download
    await docsPage.goBack();
    await docsPage.getByRole('link', { name: 'Getting started - VS Code' }).click();

    const page1Promise = docsPage.waitForEvent('popup');
    await docsPage.getByRole('link', { name: 'Visual Studio Code' }).click();
    const page1 = await page1Promise;

    await page1.waitForLoadState('domcontentloaded');
    await page1.bringToFront();

    const acceptBtn = page1.getByRole('button', { name: /accept/i });
    if (await acceptBtn.count()) {
      await acceptBtn.first().click();
    }

    const downloadCta = page1
      .getByRole('link', { name: /download for windows/i })
      .first()
      .or(page1.getByRole('button', { name: /download for windows/i }).first());

    await expect(downloadCta).toBeVisible({ timeout: 15000 });
    await downloadCta.scrollIntoViewIfNeeded();

    const [download] = await Promise.all([
      page1.waitForEvent('download', { timeout: 60000 }),
      downloadCta.click(),
    ]);

    const downloadDir = path.join(process.cwd(), 'downloads');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir);
    }

    const fileName = await download.suggestedFilename();
    await download.saveAs(path.join(downloadDir, fileName));
  });
});