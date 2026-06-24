import { test, expect, Page } from '@playwright/test';

async function pauseWithLabel(page: Page, label: string) {
  await page.evaluate((text) => {
    const existing = document.querySelector('[data-demo-label]');
    if (existing) existing.remove();

    const badge = document.createElement('div');
    badge.setAttribute('data-demo-label', 'true');
    badge.textContent = text;
    badge.style.cssText =
      'position:fixed;top:16px;left:16px;z-index:999999;' +
      'padding:10px 14px;border-radius:10px;' +
      'background:rgba(0,0,0,0.82);color:white;' +
      'font:700 13px system-ui';
    document.body.appendChild(badge);
  }, label);

  await page.pause();
}

test.describe('Config demo', () => {

  test('shows configured baseURL, viewport, and project settings', async ({ page }, testInfo) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    const projectName = testInfo.project.name;
    const viewport = page.viewportSize();

    await expect(page).toHaveTitle(/TodoMVC/i);

    await pauseWithLabel(
      page,
      `Project: ${projectName} | Viewport: ${viewport?.width}x${viewport?.height}`
    );

    // Create items
    const input = page.getByPlaceholder('What needs to be done?');

    await input.fill(`Task A - ${projectName}`);
    await input.press('Enter');

    await input.fill(`Task B - ${projectName}`);
    await input.press('Enter');

    const items = page.locator('.todo-list > li');

    await expect(items).toHaveCount(2);

    await pauseWithLabel(
      page,
      `Created 2 items in project: ${projectName}`
    );

    // Complete first item
    const firstItem = items.first();
    await firstItem.getByRole('checkbox').check();
    await expect(firstItem).toHaveClass(/completed/);

    // Filter Active
    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page).toHaveURL(/#\/active/);

    await expect(page.getByText(`Task A - ${projectName}`)).toHaveCount(0);
    await expect(page.getByText(`Task B - ${projectName}`)).toBeVisible();

    await pauseWithLabel(
      page,
      `Active filter validated in ${projectName}`
    );
  });

  test('demonstrates testInfo and project-specific execution', async ({ page }, testInfo) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    console.log(`Running in project: ${testInfo.project.name}`);
    console.log(`Retry number: ${testInfo.retry}`);
    console.log(`Expected status: ${testInfo.expectedStatus}`);

    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const isMobile = testInfo.project.name === 'mobile-chrome';

    if (isMobile) {
      await pauseWithLabel(page, 'Running in MOBILE project from config');
    } else {
      await pauseWithLabel(page, `Running in DESKTOP project: ${testInfo.project.name}`);
    }
  });
});