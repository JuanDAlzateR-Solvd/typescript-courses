import { test, expect } from '@playwright/test';

test('Mocking APIs + simulating failures for deterministic testing', async ({ page }) => {
  // Step 1: Inject deterministic app state BEFORE load
  await page.addInitScript(() => {
    const mockedTodos = [
      {
        title: 'Mocked Task A - Pending',
        completed: false,
      },
      {
        title: 'Mocked Task B - Completed',
        completed: true,
      },
    ];

    // TodoMVC uses localStorage → seed predictable state
    localStorage.setItem('react-todos', JSON.stringify(mockedTodos));
  });

  // Step 2: Simulate backend API failure (real-world scenario)
  await page.route('**/api/*', async (route) => {
    console.log(`Mocking API failure → ${route.request().url()}`);

    await route.fulfill({
      status: 500,
      contentType: 'text/plain',
      body: 'Server error',
    });
  });

  // Step 3: Observe other network calls (non-blocking)
  await page.route('**/*', async (route) => {
    const request = route.request();

    if (request.resourceType() === 'xhr' || request.resourceType() === 'fetch') {
      console.log(`Observed request → ${request.url()}`);
    }

    await route.continue();
  });

  // Step 4: Load application
  await page.goto('https://demo.playwright.dev/todomvc', {
    waitUntil: 'domcontentloaded',
  });

  const items = page.locator('.todo-list > li');
  const counter = page.locator('.todo-count');

  // Step 5: Validate deterministic UI state
  await expect(items).toHaveCount(2);

  await expect(page.getByText('Mocked Task A - Pending')).toBeVisible();
  await expect(page.getByText('Mocked Task B - Completed')).toBeVisible();

  // Step 6: Validate completed state
  const completedItem = items.filter({
    hasText: 'Mocked Task B - Completed',
  });

  await expect(completedItem).toHaveClass(/completed/);

  // Step 7: Validate business logic (counter)
  await expect(counter).toContainText('1');

  await page.pause();
});