import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Above-the-fold screenshot across engines (desktop)', async ({ page }, testInfo) => {
  // 1) Lock the viewport so each browser renders into the same pixel box
  await page.setViewportSize({ width: 1280, height: 720 });

  // 2) Load a more complex real-world page (shows cross-engine differences better than TodoMVC)
  await page.goto('https://playwright.dev', { waitUntil: 'domcontentloaded' });

  // 3) Quick sanity check
  await expect(page).toHaveTitle(/Playwright/i);

  // 4) Add an on-screen label so screenshots are self-identifying
  const browserName = testInfo.project.name; // chromium | firefox | webkit
  await page.addStyleTag({
    content: `
      .engine-badge {
        position: fixed;
        top: 16px;
        left: 16px;
        z-index: 999999;
        padding: 10px 14px;
        border-radius: 10px;
        font: 700 16px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        background: rgba(0,0,0,0.75);
        color: white;
        letter-spacing: 0.5px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.25);
      }
    `,
  });

  await page.evaluate((name) => {
    const badge = document.createElement('div');
    badge.className = 'engine-badge';
    badge.textContent = `Engine: ${name}`;
    document.body.appendChild(badge);
  }, browserName);

  // 5) Ensure output folder exists
  const outDir = path.join(testInfo.project.outputDir, 'above-the-fold');
  fs.mkdirSync(outDir, { recursive: true });

  // 6) Take an above-the-fold screenshot (viewport only)
  const filePath = path.join(outDir, `above-the-fold-${browserName}.png`);
  await page.screenshot({ path: filePath, fullPage: false });
});
