import { chromium, devices } from '@playwright/test';
import path from 'node:path';

const out = '/opt/cursor/artifacts';
const base = 'http://127.0.0.1:4321';
const browser = await chromium.launch();

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}/es`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(out, 'stage2-home-top.png'), clip: { x: 0, y: 0, width: 1440, height: 900 } });
  // Anchor jump via CTA to verify scroll-margin
  await page.getByRole('link', { name: 'Ver proyectos' }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(out, 'stage2-home-top-header.png'), clip: { x: 0, y: 0, width: 1440, height: 520 } });
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}/es/proyectos/copa-relampago`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-testid="case-study"]');
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(out, 'stage2-copa-desktop.png'), fullPage: false });

  await page.locator('[data-testid="architecture-diagram"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.locator('[data-testid="architecture-diagram"]').screenshot({
    path: path.join(out, 'stage2-copa-architecture.png'),
  });

  const consoleEl = page.locator('[data-testid="server-console"]');
  await consoleEl.scrollIntoViewIfNeeded();
  // Wait until mid-play: progress not 0 and not finished
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-testid="server-console-elapsed"]');
    if (!el) return false;
    const t = el.textContent || '';
    return t.includes('▶') && !t.includes('✓') && /[1-9]\d{2,}ms/.test(t);
  }, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(200);
  // If already finished, replay and wait mid
  const elapsed = await page.locator('[data-testid="server-console-elapsed"]').textContent();
  if (elapsed?.includes('✓')) {
    await page.getByTestId('server-console-play').click();
    await page.waitForTimeout(1600);
  }
  await consoleEl.screenshot({ path: path.join(out, 'stage2-copa-console-midplay.png') });
  await page.close();
}

{
  const iPhone = devices['iPhone 13'];
  const page = await browser.newPage({ ...iPhone });
  await page.goto(`${base}/es/proyectos/copa-relampago`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-testid="case-study"]');
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(out, 'stage2-copa-mobile.png'), fullPage: false });
  await page.close();
}

await browser.close();
console.log('ok');
