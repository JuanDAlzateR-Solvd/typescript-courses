import { test, expect } from '@playwright/test';    // Import tools

test('has title', async ({ page }) => {             // One test case
   await page.goto('https://playwright.dev/');       // Navigate to the URL

   await expect(page).toHaveTitle(/Playwrights/);    // Expect a title "to contain" a substring.
});

test('get started link', async ({ page }) => {      // second test case
  await page.goto('https://playwright.dev/');       // Navigate to the URL

  await page.getByRole('link', { name: 'Get started' }).click();      // Click the get started link.

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installations' })).toBeVisible();      

});
