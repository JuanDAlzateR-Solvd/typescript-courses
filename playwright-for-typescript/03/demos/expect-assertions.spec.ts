import { test, expect, Locator, Page } from '@playwright/test';

async function pausePoint(page: Page, label: string) {
  await page.evaluate((text) => {
    const existing = document.querySelector('.demo-badge');
    if (existing) existing.remove();

    const badge = document.createElement('div');
    badge.className = 'demo-badge';
    badge.textContent = text;
    badge.style.cssText =
      'position:fixed;top:16px;left:16px;z-index:999999;padding:10px 14px;border-radius:10px;' +
      'background:rgba(0,0,0,0.82);color:#fff;font:700 13px system-ui;' +
      'box-shadow:0 10px 20px rgba(0,0,0,0.25)';
    document.body.appendChild(badge);
  }, label);

  await page.pause();
}

function input(page: Page): Locator {
  return page.getByPlaceholder('What needs to be done?');
}

function items(page: Page): Locator {
  return page.locator('.todo-list > li');
}

function itemByText(page: Page, text: string): Locator {
  return items(page).filter({ hasText: text }).first();
}

test('Expect assertions: visibility, text, and state (advanced UI behaviors)', async ({ page }) => {
  // Clean start (TodoMVC persists in localStorage)
  await page.addInitScript(() => window.localStorage.clear());

  await page.goto('https://demo.playwright.dev/todomvc', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/TodoMVC/i);

  const todoInput = input(page);
  await expect(todoInput).toBeVisible();
  await expect(todoInput).toBeEnabled();

  // Footer is hidden until there’s at least one todo
  const footer = page.locator('footer.footer');
  await expect(footer).toBeHidden();

  await pausePoint(page, 'Step 1: Baseline assertions (input ready, footer hidden)');

  // Add two items
  await todoInput.fill('Ship order #A-123');
  await todoInput.press('Enter');

  await todoInput.fill('Ship order #B-987');
  await todoInput.press('Enter');

  await expect(items(page)).toHaveCount(2);

  // Footer becomes visible once items exist
  await expect(footer).toBeVisible();

  // Counter text validation
  const counter = footer.locator('span.todo-count');
  await expect(counter).toContainText('2');

  await pausePoint(page, 'Step 2: Visibility + text assertions (footer visible, counter = 2)');

  // Mark A as completed and validate state via class
  const a = itemByText(page, 'Ship order #A-123');
  await a.getByRole('checkbox').check();

  // TodoMVC marks completed items with class "completed"
  await expect(a).toHaveClass(/completed/);

  // Counter should now show 1 item left
  await expect(counter).toContainText('1');

  await pausePoint(page, 'Step 3: State assertions (completed class + counter updates)');

  // Filter to Active: URL hash changes + completed item disappears
  await page.getByRole('link', { name: 'Active' }).click();
  await expect(page).toHaveURL(/#\/active/);

  await expect(page.getByText('Ship order #A-123')).toHaveCount(0);
  await expect(page.getByText('Ship order #B-987')).toBeVisible();

  await pausePoint(page, 'Step 4: URL + visibility assertions (Active filter hides completed)');

  // Edit the remaining active item (double click label -> edit input)
  const b = itemByText(page, 'Ship order #B-987');
  await b.locator('label').dblclick();

  const editInput = b.locator('input.edit');
  await expect(editInput).toBeVisible();
  await expect(editInput).toHaveValue('Ship order #B-987');

  await editInput.fill('Ship order #B-987 (priority)');
  await editInput.press('Enter');

  // Validate text changed
  await expect(b.locator('label')).toHaveText('Ship order #B-987 (priority)');

  await pausePoint(page, 'Step 5: Text + state assertions (edit mode value, updated label)');

  // Delete the edited item (hover reveals destroy)
  await b.hover();
  const destroy = b.locator('button.destroy');
  await expect(destroy).toBeVisible();
  await destroy.click();

  // Validate removal
  await expect(items(page)).toHaveCount(0); // Only completed A remains (but hidden in Active view)

  await page.getByRole('link', { name: 'Completed' }).click();
  await expect(page).toHaveURL(/#\/completed/);
  await expect(items(page)).toHaveCount(1);
  await expect(page.getByText('Ship order #A-123')).toBeVisible();

  await pausePoint(page, 'Step 6: DOM state assertions (delete removes item)');
});