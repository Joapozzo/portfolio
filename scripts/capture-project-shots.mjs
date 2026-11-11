/**
 * Capture public project screenshots (no login, no forms).
 * Outputs PNG then converts to AVIF + WebP via sharp.
 */
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('src/assets/projects');
const VIEWPORTS = [
  { name: 'mac', width: 1440, height: 900 },
  { name: 'ipad', width: 834, height: 1112 },
  { name: 'iphone', width: 390, height: 844 },
];

/** @type {{ slug: string; id: string; url: string }[]} */
const SITES = [
  { slug: 'copa-relampago', id: 'coparelampago', url: 'https://coparelampago.com' },
  { slug: 'copa-relampago', id: 'ucfa', url: 'https://ucfa.com.ar' },
  { slug: 'loopin', id: 'loopin', url: 'https://loopin.com.ar' },
  { slug: 'gnd', id: 'gnd', url: 'https://naturalonline.com.ar' },
  { slug: 'altiplano', id: 'altiplano', url: 'https://altiplanoexperience.com' },
  { slug: 'maxshop', id: 'maxshop', url: 'https://maxshop.com.ar' },
  { slug: 'landings', id: 'sommierworld', url: 'https://sommierworld.com' },
  { slug: 'landings', id: 'zcseguridad', url: 'https://zcseguridad.com' },
  { slug: 'landings', id: 'megustaloquehago', url: 'https://megustaloquehago.com.ar' },
  { slug: 'landings', id: 'gruporennella', url: 'https://gruporennella.com.ar' },
  { slug: 'landings', id: 'ortodoncia-florenciadiz', url: 'https://ortodoncia-florenciadiz.com' },
  { slug: 'landings', id: 'quantivagroup', url: 'https://quantivagroup.com.ar' },
];

const results = { captured: [], failed: [] };

async function optimize(pngPath, outBase) {
  const input = sharp(pngPath);
  await Promise.all([
    input.clone().avif({ quality: 55 }).toFile(`${outBase}.avif`),
    input.clone().webp({ quality: 72 }).toFile(`${outBase}.webp`),
  ]);
  await unlink(pngPath);
}

async function captureSite(browser, site) {
  const dir = path.join(ROOT, site.slug);
  await mkdir(dir, { recursive: true });

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: 'light',
      deviceScaleFactor: 1,
      javaScriptEnabled: true,
    });
    const page = await context.newPage();
    page.setDefaultTimeout(45000);

    try {
      const response = await page.goto(site.url, {
        waitUntil: 'domcontentloaded',
        timeout: 45000,
      });
      if (!response || response.status() >= 400) {
        throw new Error(`HTTP ${response?.status() ?? 'no response'}`);
      }
      await page.waitForTimeout(2500);

      // Above the fold
      const foldBase = path.join(dir, `${site.id}-${vp.name}-fold`);
      const foldPng = `${foldBase}.png`;
      await page.screenshot({ path: foldPng, fullPage: false });
      await optimize(foldPng, foldBase);

      // Scrolled
      await page.evaluate(() => window.scrollBy(0, Math.min(window.innerHeight * 0.85, 700)));
      await page.waitForTimeout(800);
      const scrollBase = path.join(dir, `${site.id}-${vp.name}-scroll`);
      const scrollPng = `${scrollBase}.png`;
      await page.screenshot({ path: scrollPng, fullPage: false });
      await optimize(scrollPng, scrollBase);

      results.captured.push(`${site.url} @ ${vp.name}`);
      console.log(`✓ ${site.id} ${vp.name}`);
    } catch (err) {
      const msg = `${site.url} @ ${vp.name}: ${err instanceof Error ? err.message : String(err)}`;
      results.failed.push(msg);
      console.error(`✗ ${msg}`);
    } finally {
      await context.close();
    }
  }
}

const browser = await chromium.launch({ headless: true });
for (const site of SITES) {
  await captureSite(browser, site);
}
await browser.close();

await writeFile(
  path.resolve('scripts/capture-report.json'),
  JSON.stringify(results, null, 2)
);
console.log('\n=== CAPTURE REPORT ===');
console.log(`Captured: ${results.captured.length}`);
console.log(`Failed: ${results.failed.length}`);
if (results.failed.length) console.log(results.failed.join('\n'));
