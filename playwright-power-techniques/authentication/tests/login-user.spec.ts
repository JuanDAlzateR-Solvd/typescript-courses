import  {test as setup, chromium, expect } from '@playwright/test';

setup('store user ', async ({page}) => {
    // const browser = await chromium.launch();
    // const context = await browser.newContext();
    // const page = await context.newPage();
    await page.goto('https://practice.expandtesting.com/login');
    await page.getByRole('textbox', { name: 'Username' }).fill('practice');
    await page.getByRole('textbox', { name: 'Password' }).fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/.*\/secure/);
    await page.context().storageState({ path: './playwright-power-techniques/authentication/playwright/.auth/user.json' });
    await page.close();
});

setup('registered  user ', async ({page}) => {
    // const browser = await chromium.launch();
    // const context = await browser.newContext();
    // const page = await context.newPage();
    await page.goto('https://practice.expandtesting.com/login');
    await page.getByRole('textbox', { name: 'Username' }).fill('user-testing159');
    await page.getByRole('textbox', { name: 'Password' }).fill('Abc.1234567');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/.*\/secure/);
    await page.context().storageState({ path: './playwright-power-techniques/authentication/playwright/.auth/registered_user.json' });
    await page.close();
});