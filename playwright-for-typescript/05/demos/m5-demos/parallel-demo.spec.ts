import { test, expect } from '@playwright/test';

function log(testInfo: any, message: string) {
  const time = new Date().toISOString();
  console.log(
    `[${time}] [Worker ${testInfo.workerIndex}] [${testInfo.title}] ${message}`
  );
}

test.describe('Parallel demo - realistic interactions', () => {
  test.describe.configure({ mode: 'parallel' });

  test('Test A - create and complete item', async ({ page }, testInfo) => {
    log(testInfo, 'START');

    await page.goto('https://demo.playwright.dev/todomvc');
    page.pause();

    const input = page.getByPlaceholder('What needs to be done?');

    await input.fill('Task A1');
    await input.press('Enter');

    await input.fill('Task A2');
    await input.press('Enter');

    const items = page.locator('.todo-list > li');
    await expect(items).toHaveCount(2);

    await items.first().getByRole('checkbox').check();
    await expect(items.first()).toHaveClass(/completed/);

    log(testInfo, 'Mid execution (simulating work)');
    await page.waitForTimeout(3000);

    log(testInfo, 'END');
  });

  test('Test B - filtering behavior', async ({ page }, testInfo) => {
    log(testInfo, 'START');

    await page.goto('https://demo.playwright.dev/todomvc');
    page.pause();

    const input = page.getByPlaceholder('What needs to be done?');

    await input.fill('Task B1');
    await input.press('Enter');

    await input.fill('Task B2');
    await input.press('Enter');

    const items = page.locator('.todo-list > li');

    await items.nth(0).getByRole('checkbox').check();

    await page.getByRole('link', { name: 'Active' }).click();

    await expect(page).toHaveURL(/#\/active/);
    await expect(items).toHaveCount(1);

    log(testInfo, 'Mid execution (simulating work)');
    await page.waitForTimeout(3000);

    log(testInfo, 'END');
  });

  test('Test C - edit and delete', async ({ page }, testInfo) => {
    log(testInfo, 'START');

    await page.goto('https://demo.playwright.dev/todomvc');
    page.pause();

    const input = page.getByPlaceholder('What needs to be done?');

    await input.fill('Task C1');
    await input.press('Enter');

    const item = page.locator('.todo-list > li').first();

    await item.locator('label').dblclick();

    const editInput = item.locator('input.edit');
    await editInput.fill('Task C1 - updated');
    await editInput.press('Enter');

    await expect(item.locator('label')).toHaveText('Task C1 - updated');

    await item.hover();
    await item.locator('button.destroy').click();

    await expect(page.locator('.todo-list > li')).toHaveCount(0);

    log(testInfo, 'Mid execution (simulating work)');
    await page.waitForTimeout(3000);

    log(testInfo, 'END');
  });

});