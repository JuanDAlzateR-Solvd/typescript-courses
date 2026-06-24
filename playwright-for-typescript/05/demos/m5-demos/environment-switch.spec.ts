import { test, expect, Page, Locator } from '@playwright/test';

type EnvMetadata = {
  environment: string;
  build: string;
  target: string;
  releaseChannel: string;
  configuredRetries: number;
};

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

test.describe('Environment switch demo', () => {
  test('same test, different environment configuration', async ({ page }, testInfo) => {
    const metadata = testInfo.config.metadata as EnvMetadata;

    const environment = metadata.environment;
    const build = metadata.build;
    const target = metadata.target;
    const releaseChannel = metadata.releaseChannel;

    // Uses baseURL from config + relative app path
    await page.goto('/todomvc');

    await expect(page).toHaveTitle(/TodoMVC/i);

    const input: Locator = page.getByPlaceholder('What needs to be done?');
    const items = page.locator('.todo-list > li');
    const counter = page.locator('span.todo-count');

    await expect(input).toBeVisible();

    await pauseWithLabel(
      page,
      `Env: ${environment} | Build: ${build} | Target: ${target} | Channel: ${releaseChannel}`
    );

    await input.fill(`Smoke validation - ${environment}`);
    await input.press('Enter');

    await input.fill(`Regression validation - ${releaseChannel}`);
    await input.press('Enter');

    await expect(items).toHaveCount(2);
    await expect(counter).toContainText('2');

    await pauseWithLabel(
      page,
      `Created environment-specific items in ${environment}`
    );

    const firstItem = items.first();
    await firstItem.getByRole('checkbox').check();
    await expect(firstItem).toHaveClass(/completed/);
    await expect(counter).toContainText('1');

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page).toHaveURL(/#\/active/);

    await expect(page.getByText(`Smoke validation - ${environment}`)).toHaveCount(0);
    await expect(page.getByText(`Regression validation - ${releaseChannel}`)).toBeVisible();

    await pauseWithLabel(
      page,
      `Same test flow, but running under ${environment} configuration`
    );
  });

  test('reads environment metadata at runtime', async ({ page }, testInfo) => {
    const metadata = testInfo.config.metadata as EnvMetadata;

    await page.goto('/todomvc');

    console.log('Environment:', metadata.environment);
    console.log('Build:', metadata.build);
    console.log('Target:', metadata.target);
    console.log('Release channel:', metadata.releaseChannel);
    console.log('Configured retries:', metadata.configuredRetries);

    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    await pauseWithLabel(
      page,
      `Runtime metadata → env=${metadata.environment}, retries=${metadata.configuredRetries}`
    );
  });
});