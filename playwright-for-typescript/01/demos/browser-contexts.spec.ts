import { test, expect, chromium } from '@playwright/test';

test('two browser contexts are isolated sessions', async () => {
  const browser = await chromium.launch({ headless: false });

  const contextA = await browser.newContext();
  const contextB = await browser.newContext();

  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();

  await Promise.all([
    pageA.goto('https://demo.playwright.dev/todomvc'),
    pageB.goto('https://demo.playwright.dev/todomvc'),
  ]);

  // PAUSE 
  await pageA.pause();

  await pageA.getByPlaceholder('What needs to be done?').fill('Context A: Ship order #A-123');
  await pageA.keyboard.press('Enter');

  await pageB.getByPlaceholder('What needs to be done?').fill('Context B: Ship order #B-987');
  await pageB.keyboard.press('Enter');

  // PAUSE 
  await pageA.pause();

  await expect(pageA.getByText('Context A: Ship order #A-123')).toBeVisible();
  await expect(pageA.getByText('Context B: Ship order #B-987')).toHaveCount(0);

  await expect(pageB.getByText('Context B: Ship order #B-987')).toBeVisible();
  await expect(pageB.getByText('Context A: Ship order #A-123')).toHaveCount(0);

  await contextA.close();
  await contextB.close();
  await browser.close();
});
