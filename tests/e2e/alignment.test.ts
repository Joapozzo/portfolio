import { test, expect, type Page } from '@playwright/test';

const WIDTHS = [390, 834, 1440] as const;

async function contentLeft(page: Page): Promise<number> {
  return page.evaluate(() => {
    const shell = document.querySelector<HTMLElement>('[data-align="shell"]');
    if (!shell) throw new Error('No [data-align=shell] found');
    const styles = getComputedStyle(shell);
    return shell.getBoundingClientRect().left + parseFloat(styles.paddingLeft || '0');
  });
}

async function leftOf(page: Page, selector: string): Promise<number> {
  const el = page.locator(selector).first();
  await expect(el).toBeVisible();
  const box = await el.boundingBox();
  if (!box) throw new Error(`No box for ${selector}`);
  return box.x;
}

function assertAligned(actual: number, expected: number, label: string, tolerance = 1) {
  expect(Math.abs(actual - expected), `${label} left ${actual} vs expected ${expected}`).toBeLessThanOrEqual(
    tolerance,
  );
}

for (const width of WIDTHS) {
  test.describe(`Layout alignment @ ${width}px`, () => {
    test.use({ viewport: { width, height: width === 390 ? 844 : 900 } });

    test(`home: title, section title and Today card share left edge`, async ({ page }) => {
      await page.goto('/es?grid=1');
      await expect(page.getByTestId('layout-grid')).toBeVisible();
      await expect(page.getByTestId('home-title')).toBeVisible();
      await expect(page.getByTestId('today-card')).toBeVisible();

      const expected = await contentLeft(page);
      assertAligned(await leftOf(page, '[data-testid="home-title"]'), expected, 'home-title');
      assertAligned(await leftOf(page, '[data-testid="section-title"]'), expected, 'section-title');
      assertAligned(await leftOf(page, '[data-testid="today-card"]'), expected, 'today-card');
      assertAligned(await leftOf(page, '[data-testid="top-chrome"]'), expected, 'top-chrome');
    });

    test(`case study: title, Mac mockup and diagram/console share left edge`, async ({ page }) => {
      await page.goto('/es/proyectos/copa-relampago?grid=1');
      await expect(page.getByTestId('case-study')).toBeVisible();
      await expect(page.getByTestId('layout-grid')).toBeVisible();

      const expected = await contentLeft(page);
      assertAligned(await leftOf(page, '[data-testid="case-title"]'), expected, 'case-title');
      assertAligned(await leftOf(page, '[data-testid="device-outer"]'), expected, 'device-outer');

      await page.locator('[data-testid="architecture-diagram"]').scrollIntoViewIfNeeded();
      assertAligned(
        await leftOf(page, '[data-testid="architecture-diagram"]'),
        expected,
        'architecture-diagram',
      );

      await page.locator('[data-testid="server-console"]').scrollIntoViewIfNeeded();
      assertAligned(await leftOf(page, '[data-testid="server-console"]'), expected, 'server-console');
    });
  });
}
