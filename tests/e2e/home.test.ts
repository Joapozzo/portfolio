import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Home page', () => {
  test.describe('Spanish locale', () => {
    test('renders home page in Spanish', async ({ page }) => {
      await page.goto('/es');
      await expect(page).toHaveTitle(/Joaquín Pozzo/);
      await expect(page.getByRole('heading', { level: 1, name: 'Joaquín Pozzo' })).toBeVisible();
      await expect(page.getByText('Backend & Full Stack Developer').first()).toBeVisible();
      await expect(page.getByText(/Gentío MKT desde 2023/i).first()).toBeVisible();
      await expect(page.getByText(/\+3 años/i)).toHaveCount(0);
    });

    test('displays navigation', async ({ page, isMobile }) => {
      await page.goto('/es');
      if (isMobile) {
        const tabs = page.getByRole('navigation', { name: 'Tab bar' });
        await expect(tabs.getByRole('link', { name: 'Inicio' })).toBeVisible();
        await expect(tabs.getByRole('link', { name: 'Contacto' })).toBeVisible();
      } else {
        const dock = page.getByRole('navigation', { name: 'Dock' });
        await expect(dock.getByRole('link', { name: 'Inicio' })).toBeVisible();
        await expect(dock.getByRole('link', { name: 'Proyectos' })).toBeVisible();
        await expect(dock.getByRole('link', { name: 'CV' })).toBeVisible();
      }
    });

    test('displays project feed', async ({ page }) => {
      await page.goto('/es');
      await expect(page.getByTestId('project-carousel')).toBeVisible();
      await expect(page.getByText('Copa Relámpago / UCFA').first()).toBeVisible();
    });
  });

  test.describe('English locale', () => {
    test('renders home page in English', async ({ page }) => {
      await page.goto('/en');
      await expect(page).toHaveTitle(/Joaquín Pozzo/);
      await expect(page.getByRole('heading', { level: 1, name: 'Joaquín Pozzo' })).toBeVisible();
      await expect(page.getByText(/Gentío MKT since 2023/i).first()).toBeVisible();
    });

    test('displays navigation', async ({ page, isMobile }) => {
      await page.goto('/en');
      if (isMobile) {
        const tabs = page.getByRole('navigation', { name: 'Tab bar' });
        await expect(tabs.getByRole('link', { name: 'Home' })).toBeVisible();
      } else {
        const dock = page.getByRole('navigation', { name: 'Dock' });
        await expect(dock.getByRole('link', { name: 'Home' })).toBeVisible();
      }
    });

    test('displays project feed', async ({ page }) => {
      await page.goto('/en');
      await expect(page.getByTestId('project-carousel')).toBeVisible();
      await expect(page.getByText('Copa Relámpago / UCFA').first()).toBeVisible();
    });
  });

  test.describe('Language switching', () => {
    test('can switch from Spanish to English', async ({ page }) => {
      await page.goto('/es');
      await page.getByTestId('language-switch').click();
      await expect(page).toHaveURL(/\/en/);
      await expect(page.getByText(/Gentío MKT since 2023/i).first()).toBeVisible();
    });

    test('can switch from English to Spanish', async ({ page }) => {
      await page.goto('/en');
      await page.getByTestId('language-switch').click();
      await expect(page).toHaveURL(/\/es/);
      await expect(page.getByText(/Gentío MKT desde 2023/i).first()).toBeVisible();
    });
  });
});

test.describe('Theme toggle', () => {
  test('toggles between light and dark theme', async ({ page }) => {
    await page.goto('/es');
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);
    await page.getByRole('button', { name: /Switch to dark theme/i }).click();
    await expect(html).toHaveClass(/dark/);
    await page.getByRole('button', { name: /Switch to light theme/i }).click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test('persists theme preference', async ({ page }) => {
    await page.goto('/es');
    await page.getByRole('button', { name: /Switch to dark theme/i }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});

test.describe('Project feed keyboard', () => {
  test('project cards are keyboard reachable', async ({ page }) => {
    await page.goto('/es');
    const firstCard = page.getByTestId('project-carousel').locator('a').first();
    await firstCard.focus();
    await expect(firstCard).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/es\/proyectos\//);
  });
});

test.describe('Case study pages', () => {
  test('renders Copa Relámpago case study with architecture and console', async ({ page }) => {
    await page.goto('/es/proyectos/copa-relampago');
    await expect(page.getByTestId('case-study')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: /Copa Relámpago/ })).toBeVisible();
    await expect(page.getByTestId('case-study-nav')).toBeVisible();
    await expect(page.getByTestId('architecture-diagram')).toBeVisible();
    await expect(page.getByTestId('server-console')).toBeVisible();
    await expect(page.getByText('TODO')).toHaveCount(0);
  });

  test('cinema mode still available as overlay route', async ({ page, isMobile }) => {
    await page.goto('/es/proyectos/copa-relampago/cine');
    await expect(page.getByTestId('cinema-mode')).toBeVisible();
    await expect(page.getByTestId('device-frame')).toBeVisible();
    if (!isMobile) {
      await expect(page.getByTestId('server-console')).toBeVisible();
    }
  });

  test('never surfaces TODO placeholders on home', async ({ page }) => {
    await page.goto('/es');
    await expect(page.getByText('TODO')).toHaveCount(0);
    await expect(page.getByText(/Plataforma SAS/i)).toHaveCount(0);
    await expect(page.getByText(/fidelización de clientes/i).first()).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('home page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/es');
    await expect(page.getByTestId('project-carousel')).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    expect(critical).toEqual([]);
  });

  test('skip link is functional', async ({ page }) => {
    await page.goto('/es');
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });
});
