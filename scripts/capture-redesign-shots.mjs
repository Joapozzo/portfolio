import { chromium, devices } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const BASE = 'http://127.0.0.1:4321';
const OUT = '/opt/cursor/artifacts';
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

async function shot(name, contextOptions, fn) {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  await fn(page);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  await context.close();
  console.log(name);
}

const desktop = { viewport: { width: 1440, height: 900 } };
const mobile = { ...devices['Pixel 5'] };

await shot('redesign-home-light-desktop', { ...desktop, colorScheme: 'light' }, async (page) => {
  await page.goto(`${BASE}/es`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('portfolio-theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
});

await shot('redesign-home-dark-desktop', { ...desktop, colorScheme: 'dark' }, async (page) => {
  await page.goto(`${BASE}/es`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('portfolio-theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
});

await shot('redesign-home-mobile', { ...mobile, colorScheme: 'light' }, async (page) => {
  await page.goto(`${BASE}/es`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('portfolio-theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await page.reload({ waitUntil: 'networkidle' });
});

await shot('redesign-project-desktop', { ...desktop, colorScheme: 'light' }, async (page) => {
  await page.goto(`${BASE}/es/proyectos/copa-relampago`, { waitUntil: 'networkidle' });
  await page.getByTestId('cinema-mode').waitFor({ state: 'visible' });
  await page.waitForTimeout(600);
});

await shot('redesign-project-mobile', { ...mobile, colorScheme: 'light' }, async (page) => {
  await page.goto(`${BASE}/es/proyectos/copa-relampago`, { waitUntil: 'networkidle' });
  await page.getByTestId('cinema-mode').waitFor({ state: 'visible' });
  await page.waitForTimeout(600);
});

await browser.close();
