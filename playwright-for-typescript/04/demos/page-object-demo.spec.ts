import { test, expect, Page, Locator } from '@playwright/test';

class TodoPage {
  readonly page: Page;
  readonly input: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.getByPlaceholder('What needs to be done?');
    this.items = page.locator('.todo-list > li');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://demo.playwright.dev/todomvc');
  }

  async addTodo(text: string): Promise<void> {
    await this.input.fill(text);
    await this.input.press('Enter');
  }

  getItemByText(text: string): Locator {
    return this.items.filter({ hasText: text }).first();
  }

  async toggleTodo(text: string): Promise<void> {
    const item = this.getItemByText(text);
    await item.getByRole('checkbox').check();
  }

  async expectCount(count: number): Promise<void> {
    await expect(this.items).toHaveCount(count);
  }

  async pause(): Promise<void> {
    await this.page.pause();
  }
}

test('Todo flow - using Page Object (single file demo)', async ({ page }) => {
  const todo = new TodoPage(page);

  await todo.goto();

  // Add items
  await todo.addTodo('Prepare shipment');
  await todo.addTodo('Pack inventory');

  // Assert count
  await todo.expectCount(2);

  await todo.pause();

  // Toggle one item
  await todo.toggleTodo('Prepare shipment');

  await todo.pause();
});