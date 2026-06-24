import { test, expect } from '@playwright/test';

test('Navigation demo: pages, tabs, and iframes', async ({ page }) => {
  // 1) Normal page navigation
  await page.goto('https://playwright.dev/');
  await page.pause();

  await page.getByRole('link', { name: /get started/i }).click();
  await expect(page).toHaveURL(/intro/);
  await page.pause();

  // 2) Popup / new tab navigation
  await page.goto('https://the-internet.herokuapp.com/windows');

  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: 'Click Here' }).click(),
  ]);

  await newPage.waitForLoadState('domcontentloaded');
  await newPage.bringToFront();

  await expect(newPage.getByRole('heading')).toHaveText('New Window');
  await page.pause();

  // 3) Return to original page
  await page.bringToFront();
  await expect(page.getByRole('heading')).toHaveText('Opening a new window');

  // 4) Guaranteed editable iframe (self-contained)
  await page.setContent(`
    <html>
      <body>
        <iframe id="demo-frame" srcdoc="
          <html>
            <body>
              <input id='name' placeholder='Type inside iframe' />
            </body>
          </html>
        "></iframe>
      </body>
    </html>
  `);

  const frame = page.frameLocator('#demo-frame');
  const iframeInput = frame.locator('#name');

  await expect(iframeInput).toBeVisible();
  await iframeInput.fill('Playwright iframe interaction');
  await expect(iframeInput).toHaveValue('Playwright iframe interaction');

  await page.pause();
});