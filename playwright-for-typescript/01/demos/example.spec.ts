import { test, expect } from '@playwright/test';

test('Globomantics login page loads correctly', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  // Validate page title
  await expect(page).toHaveTitle(/TodoMVC/);

  // Validate input is visible and usable
  const todoInput = page.getByPlaceholder('What needs to be done?');
  await expect(todoInput).toBeVisible();

  await todoInput.fill('Ship order #123');
  await todoInput.press('Enter');

  await expect(page.getByText('Ship order #123')).toBeVisible();
});
