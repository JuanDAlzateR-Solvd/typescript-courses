import { test, expect } from '@playwright/test';

test('user can log in and see dashboard', async ({ page }) => {
await page.goto('https://www.saucedemo.com');
await page.getByPlaceholder('Username').fill('standard\_user');
await page.getByPlaceholder('Password').fill('secret\_sauce');
await page.getByRole('button', { name: 'Login' }).click();
await expect(page).toHaveURL(/inventory/);
await expect(page.getByText('Products')).toBeVisible();
});


