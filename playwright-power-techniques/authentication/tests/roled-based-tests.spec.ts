import { test, expect, chromium } from '@playwright/test';
test.describe('Role-Based Access Tests', () => {

    test('Regular user sees limited dashboard features', async () => {
        const browser = await chromium.launch();
        const context = await browser.newContext({ storageState: './playwright-power-techniques/authentication/playwright/.auth/user.json' });
        const page = await context.newPage();
        
        //assert that the user is logged in and on the secure page
        const title = page.getByRole('heading', { name: 'Secure Area page for Automation Testing Practice' });
        await page.goto('https://practice.expandtesting.com/login');
        await expect(title).toBeVisible();
        await expect(page).toHaveURL(/.*\/secure/);

        //logout the user and assert that they are redirected to the login page
        const logoutButton = page.getByRole('link', { name: 'Logout' });
        await expect(logoutButton).toBeVisible();
        await logoutButton.click();
        await expect(page).toHaveURL(/.*\/login/);
        await browser.close();
    
    });

});