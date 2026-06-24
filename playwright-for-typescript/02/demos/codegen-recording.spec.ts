import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.pause();
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started' }).click();
  await page.getByRole('link', { name: 'Getting started - VS Code' }).click();
  await page.getByRole('link', { name: 'Visual Studio Code' }).click({
    button: 'right'
  });
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Visual Studio Code' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('button', { name: 'Accept' }).click();
  await page.getByRole('link', { name: 'Command line' }).click();
  await page.getByRole('link', { name: 'Clear Cache', exact: true }).click();
  await page.getByRole('link', { name: 'Parallelism' }).click();
  await page.getByRole('link', { name: 'API', exact: true }).click();
  await page.getByRole('button', { name: 'Copy code to clipboard' }).nth(2).click();
  const downloadPromise = page1.waitForEvent('download');
  await page1.getByRole('button', { name: 'Download for Windows' }).click();
  const download = await downloadPromise;
});