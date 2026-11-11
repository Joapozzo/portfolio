import { chromium, devices } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const OUT = '/opt/cursor/artifacts';

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

async function capture(name, options, action) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  await action(page);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  await context.close();
  console.log(`saved ${name}.png`);
}

const desktop = { viewport: { width: 1440, height: 900 }, colorScheme: 'light' };
const mobile = { ...devices['Pixel 5'], colorScheme: 'light' };

await capture('home-light-desktop', desktop, async (page) => {
  await page.goto(`${BASE}/es`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('portfolio-theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await page.reload({ waitUntil: 'networkidle' });
});

await capture('home-dark-desktop', { ...desktop, colorScheme: 'dark' }, async (page) => {
  await page.goto(`${BASE}/es`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('portfolio-theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  await page.reload({ waitUntil: 'networkidle' });
});

await capture('home-light-mobile', mobile, async (page) => {
  await page.goto(`${BASE}/es`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('portfolio-theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await page.reload({ waitUntil: 'networkidle' });
});

await capture(
  'home-dark-mobile',
  { ...mobile, colorScheme: 'dark' },
  async (page) => {
    await page.goto(`${BASE}/es`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.setItem('portfolio-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await page.reload({ waitUntil: 'networkidle' });
  }
);

await capture('cinema-mode-desktop', desktop, async (page) => {
  await page.goto(`${BASE}/es/proyectos/copa-relampago?cinema=true`, {
    waitUntil: 'networkidle',
  });
  await page.getByTestId('cinema-mode').waitFor({ state: 'visible' });
});

await browser.close();
console.log('done');
