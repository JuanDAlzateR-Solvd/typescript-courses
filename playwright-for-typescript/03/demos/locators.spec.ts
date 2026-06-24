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

function todoInput(page: Page): Locator {
  return page.getByPlaceholder('What needs to be done?');
}

function todoItems(page: Page): Locator {
  return page.locator('.todo-list > li');
}

function itemByText(page: Page, text: string): Locator {
  return todoItems(page).filter({ hasText: text }).first();
}

function toggleForItem(item: Locator): Locator {
  return item.getByRole('checkbox');
}

function labelForItem(item: Locator): Locator {
  return item.locator('label');
}

function destroyButtonForItem(item: Locator): Locator {
  return item.locator('button.destroy');
}

test('Bulletproof advanced locators with TypeScript (chaining + filters)', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/TodoMVC/i);

  await pausePoint(page, 'Step 1: Baseline – page loaded, stable starting point');

  const input: Locator = todoInput(page);
  await expect(input).toBeVisible();

  const tasks = ['Ship order #A-123', 'Ship order #B-987', 'Reconcile inventory'];
  for (const task of tasks) {
    await input.fill(task);
    await input.press('Enter');
  }

  await expect(todoItems(page)).toHaveCount(3);
  await pausePoint(page, 'Step 2: Created 3 todos – locator collection assertion');

  const itemA: Locator = itemByText(page, 'Ship order #A-123');
  await expect(itemA).toBeVisible();

  const toggleA: Locator = toggleForItem(itemA);
  await toggleA.check();

  await expect(toggleA).toBeChecked();
  await pausePoint(page, 'Step 3: Filter(row) → chain(checkbox) → action + assertion');

  const completedItems: Locator = todoItems(page).filter({
    has: page.getByRole('checkbox', { checked: true }),
  });

  await expect(completedItems).toHaveCount(1);
  await pausePoint(page, 'Step 4: filter({ has: checked checkbox }) – structural targeting');

  await expect(labelForItem(itemA)).toHaveText('Ship order #A-123');
  await pausePoint(page, 'Step 5: chain(row → label) – verify text is correct');

  const itemB: Locator = itemByText(page, 'Ship order #B-987');
  const toggleB: Locator = toggleForItem(itemB);
  await expect(toggleB).not.toBeChecked();
  await pausePoint(page, 'Step 6: Negative assertion – ensure other rows are unaffected');

  await itemB.hover();
  const destroyB: Locator = destroyButtonForItem(itemB);
  await expect(destroyB).toBeVisible();
  await pausePoint(page, 'Step 7: Hover reveals a hidden control – still targetable via scoped locators');

  await destroyB.click();

  await expect(todoItems(page)).toHaveCount(2);
  await expect(page.getByText('Ship order #B-987')).toHaveCount(0);

  await pausePoint(page, 'Step 8: Delete verified – count + absence assertions');
});