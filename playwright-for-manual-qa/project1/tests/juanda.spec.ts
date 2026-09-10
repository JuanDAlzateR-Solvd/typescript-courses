import { test, expect } from '@playwright/test';

// POSITIVE test — checks that something IS as expected
test('page has the correct title', async ({ page }) => {
  await page.goto('https://juandaymeli.love/');
  await expect(page).toHaveTitle(/Juan David y Melisa/);
});

// NEGATIVE test — checks that something is NOT present.
// In QA, this is just as important as positive checks.
test('page does not contain error text', async ({ page }) => {
  await page.goto('https://juandaymeli.love/');
  // .not.toBeVisible() = assert the element is NOT visible on the page
  await expect(page.getByText('404 Page Not Found')).not.toBeVisible();
});

test('page does not contain confirmation text', async ({ page }) => {
  await page.goto('https://juandaymeli.love/');
  await expect(page.getByText('Recepción')).not.toBeVisible();
  await expect(page.getByText('Confirmación')).not.toBeVisible();
});