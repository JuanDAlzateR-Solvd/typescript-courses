import { test, expect, Locator } from '@playwright/test';

test('End-to-end flow: forms, filters, edit, tab, and final validation', async ({ page, context }) => {
  // Clean start
  await page.addInitScript(() => window.localStorage.clear());

  // Step 1: Open app
  await page.goto('https://demo.playwright.dev/todomvc', {
    waitUntil: 'domcontentloaded',
  });

  const input: Locator = page.getByPlaceholder('What needs to be done?');
  const items = page.locator('.todo-list > li');
  const counter = page.locator('span.todo-count');

  // Step 2: Add multiple work items
  await input.fill('Validate customer order');
  await input.press('Enter');

  await input.fill('Generate shipping label');
  await input.press('Enter');

  await input.fill('Notify warehouse team');
  await input.press('Enter');

  await expect(items).toHaveCount(3);
  await expect(counter).toContainText('3');

  await page.pause();

  // Step 3: Complete the first item
  const firstItem = items.nth(0);
  await firstItem.getByRole('checkbox').check();

  await expect(firstItem).toHaveClass(/completed/);
  await expect(counter).toContainText('2');

  await page.pause();

  // Step 4: Edit the second item
  const secondItem = items.nth(1);
  await secondItem.locator('label').dblclick();

  const editInput = secondItem.locator('input.edit');
  await expect(editInput).toBeVisible();
  await expect(editInput).toHaveValue('Generate shipping label');

  await editInput.fill('Generate shipping label and invoice');
  await editInput.press('Enter');

  await expect(secondItem.locator('label')).toHaveText('Generate shipping label and invoice');

  await page.pause();

  // Step 5: Navigate to Active items and validate filtering
  await page.getByRole('link', { name: 'Active' }).click();

  await expect(page).toHaveURL(/#\/active/);
  await expect(items).toHaveCount(2);
  await expect(page.getByText('Validate customer order')).toHaveCount(0);
  await expect(page.getByText('Generate shipping label and invoice')).toBeVisible();
  await expect(page.getByText('Notify warehouse team')).toBeVisible();

  await page.pause();

  // Step 6: Open external site in a separate tab so TodoMVC state stays intact
  const externalPage = await context.newPage();
  await externalPage.goto('https://the-internet.herokuapp.com/windows', {
    waitUntil: 'domcontentloaded',
  });

  const [popup] = await Promise.all([
    externalPage.waitForEvent('popup'),
    externalPage.getByRole('link', { name: 'Click Here' }).click(),
  ]);

  await popup.waitForLoadState('domcontentloaded');
  await popup.bringToFront();

  await expect(popup.getByRole('heading')).toHaveText('New Window');

  await page.pause();

  // Step 7: Return to original TodoMVC tab and validate final state
  await page.bringToFront();

  await page.getByRole('link', { name: 'Completed' }).click();

  await expect(page).toHaveURL(/#\/completed/);
  await expect(items).toHaveCount(1);
  await expect(page.getByText('Validate customer order')).toBeVisible();

  await page.pause();
});