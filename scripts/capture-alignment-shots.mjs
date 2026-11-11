import { chromium } from '@playwright/test';
import path from 'node:path';

const out = '/opt/cursor/artifacts';
const base = 'http://127.0.0.1:4321';
const widths = [1440, 834, 390];
const browser = await chromium.launch();

for (const width of widths) {
  const height = width === 390 ? 844 : 900;
  const page = await browser.newPage({ viewport: { width, height } });

  await page.goto(`${base}/es?grid=1`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-testid="layout-grid"]');
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(out, `align-home-${width}-grid.png`),
    fullPage: false,
  });

  await page.goto(`${base}/es/proyectos/copa-relampago?grid=1`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-testid="case-study"]');
  await page.waitForSelector('[data-testid="layout-grid"]');
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(out, `align-copa-${width}-grid.png`),
    fullPage: false,
  });

  await page.close();
}

await browser.close();
console.log('alignment screenshots ok');
