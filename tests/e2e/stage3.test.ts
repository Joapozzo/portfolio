import { test, expect } from '@playwright/test';

test.describe('Joaquín AI (no API key)', () => {
  test('shows próximamente / email fallback sheet', async ({ page }) => {
    await page.goto('/es', { waitUntil: 'networkidle' });
    const open = page.getByTestId('chat-open');
    await expect(open).toBeVisible();
    await open.click({ force: true });
    await expect(page.getByTestId('chat-sheet')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('chat-unavailable')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Próximamente/i)).toBeVisible();
    await expect(page.getByTestId('chat-email-cta')).toBeVisible();
    await expect(page.getByTestId('chat-input')).toHaveCount(0);
  });

  test('English unavailable copy', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });
    await page.getByTestId('chat-open').click({ force: true });
    await expect(page.getByTestId('chat-sheet')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('chat-unavailable')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Coming soon/i)).toBeVisible();
  });
});

test.describe('Contact form', () => {
  test('renders accessible form', async ({ page }) => {
    await page.goto('/es/contacto');
    await expect(page.getByTestId('contact-form')).toBeVisible();
    await expect(page.getByTestId('contact-name')).toBeVisible();
    await expect(page.getByTestId('contact-email')).toBeVisible();
    await expect(page.getByTestId('contact-message')).toBeVisible();
  });
});

test.describe('CV PDF', () => {
  test('download link points to generated ES pdf', async ({ page, request }) => {
    await page.goto('/es/cv');
    const href = await page.getByTestId('cv-download').getAttribute('href');
    expect(href).toBe('/cv-es.pdf');
    const res = await request.get('/cv-es.pdf');
    expect(res.ok()).toBeTruthy();
    expect(res.headers()['content-type'] || '').toMatch(/pdf|octet-stream/);
  });
});

test.describe('OG image', () => {
  test('home OG asset exists', async ({ request }) => {
    const res = await request.get('/og/es/home.png');
    expect(res.ok()).toBeTruthy();
    expect(res.headers()['content-type'] || '').toMatch(/image\/png/);
  });
});
