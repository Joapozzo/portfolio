import { chromium } from '@playwright/test';
import path from 'node:path';
const out = '/opt/cursor/artifacts';
const browser = await chromium.launch();
for (const [width, height] of [[1440, 900], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto('http://127.0.0.1:4321/es', { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-testid="availability-chip"]');
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(out, `hero-availability-${width}.png`),
    clip: { x: 0, y: 0, width, height: Math.min(height, width === 390 ? 720 : 780) },
  });
  await page.close();
}
await browser.close();
console.log('ok');
