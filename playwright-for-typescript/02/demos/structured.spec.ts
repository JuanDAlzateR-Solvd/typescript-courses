import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Codegen recording - structured flow', () => {
  test('Playwright docs first, then VS Code page + download', async ({ page }) => {
    await page.pause();

    await page.goto('https://playwright.dev/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('link', { name: /get started/i }).click();
    await page.getByRole('link', { name: /command line/i }).click();
    await page.getByRole('link', { name: 'Clear Cache', exact: true }).click();
    await page.getByRole('link', { name: /parallelism/i }).click();
    await page.getByRole('link', { name: 'API', exact: true }).click();

    await expect(page).toHaveURL(/api/i);
    await page.getByRole('button', { name: /copy code to clipboard/i }).nth(2).click();

    await page.goBack();
    await page.getByRole('link', { name: 'Getting started - VS Code' }).click();

    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Visual Studio Code' }).click();
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