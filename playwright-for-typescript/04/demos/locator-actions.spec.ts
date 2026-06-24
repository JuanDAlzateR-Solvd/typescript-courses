import { test, expect } from '@playwright/test';

test('Locator-based advanced UI actions', async ({ page }) => {

  await page.goto('https://demo.playwright.dev/todomvc');

  const input = page.getByPlaceholder('What needs to be done?');

  // Create first todo
  await input.fill('Prepare shipment');
  await input.press('Enter');

  await expect(page.locator('.todo-list > li')).toHaveCount(1);

  // Pause 1 — observe form interaction
  await page.pause();

  const item = page.locator('.todo-list > li').first();

  // Hover interaction
  await item.hover();

  // Checkbox interaction
  const checkbox = item.getByRole('checkbox');
  await checkbox.check();

  // Pause 2 — observe hover and checkbox behavior
  await page.pause();

  // Double click to edit
  await item.locator('label').dblclick();

  const editInput = item.locator('input.edit');
  await editInput.fill('Prepare shipment - priority');
  await editInput.press('Enter');

  // Create second item for drag demo
  await input.fill('Pack inventory');
  await input.press('Enter');

  const firstItem = page.locator('.todo-list > li').nth(0);
  const secondItem = page.locator('.todo-list > li').nth(1);

  // Drag and drop interaction
  await firstItem.dragTo(secondItem);

  // Pause 3 — observe drag-and-drop behavior
  await page.pause();

});