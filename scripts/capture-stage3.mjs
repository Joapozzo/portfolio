import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const out = '/opt/cursor/artifacts';
const base = 'http://127.0.0.1:4321';
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();

// Chat unavailable
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${base}/es`, { waitUntil: 'networkidle' });
  await page.getByTestId('chat-open').click({ force: true });
  await page.getByTestId('chat-unavailable').waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(out, 'stage3-chat-unavailable.png') });
  await page.close();
}

// Mocked conversation
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.route('**/api/chat', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ configured: true, provider: 'gemini' }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        reply:
          'En Copa Relámpago / UCFA hice el 100% del backend: Node.js, Express, TypeScript, Prisma (91 modelos), PostgreSQL, Socket.IO, Redis, Sentry, Mercado Pago y Firebase Auth.',
        remaining: { session: 9, day: 4 },
      }),
    });
  });
  await page.goto(`${base}/es`, { waitUntil: 'networkidle' });
  await page.getByTestId('chat-open').click({ force: true });
  await page.getByTestId('chat-input').waitFor({ state: 'visible', timeout: 15000 });
  await page.getByTestId('chat-input').fill('¿Qué stack usaste en Copa Relámpago?');
  await page.getByTestId('chat-send').click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(out, 'stage3-chat-mock-conversation.png') });
  await page.close();
}

// Contact form
{
  const page = await browser.newPage({ viewport: { width: 834, height: 900 } });
  await page.goto(`${base}/es/contacto`, { waitUntil: 'networkidle' });
  await page.getByTestId('contact-form').waitFor();
  await page.screenshot({ path: path.join(out, 'stage3-contact-form.png') });
  await page.close();
}

await browser.close();

// OG asset copy
fs.copyFileSync(path.join(process.cwd(), 'public/og/es/home.png'), path.join(out, 'stage3-og-home-es.png'));
fs.copyFileSync(path.join(process.cwd(), 'public/og/es/proyectos-copa-relampago.png'), path.join(out, 'stage3-og-copa-es.png'));

// CV first page via Chromium PDF viewer print? Use pdf.js if available — fallback: screenshot CV page + note PDF exists
{
  const browser2 = await chromium.launch();
  const page = await browser2.newPage({ viewport: { width: 900, height: 1200 } });
  // Chromium can open PDF as plugin; use file URL
  const pdfPath = path.resolve('public/cv-es.pdf');
  await page.goto(`file://${pdfPath}`, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(out, 'stage3-cv-es-first-page.png'), fullPage: false });
  await browser2.close();
}

console.log('stage3 artifacts written');
