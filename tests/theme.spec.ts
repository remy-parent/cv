import type { Page } from '@playwright/test';
import { expect, strings, test } from './fixtures';

const themeToggle = (page: Page) =>
  page.getByRole('button', { name: strings.en.themeToggle.label });

const storedTheme = (page: Page) => page.evaluate(() => localStorage.getItem('theme'));

// The browser UI color (`theme-color`) is meant to be the page background of the
// active theme. Comparing the two avoids hardcoding either palette here; the canvas
// resolves both values to the same notation.
function themeColors(page: Page) {
  return page.evaluate(() => {
    const context = document.createElement('canvas').getContext('2d')!;
    const normalize = (color: string) => {
      context.fillStyle = color;
      return context.fillStyle;
    };
    const meta = document.querySelector('meta[name="theme-color"]')?.getAttribute('content');
    const background = getComputedStyle(document.documentElement).getPropertyValue('--color-bg');
    return { themeColor: normalize(meta ?? ''), background: normalize(background) };
  });
}

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`${scheme} system preference`, () => {
    test.use({ colorScheme: scheme });

    test('sets the initial theme', async ({ page }) => {
      await page.goto('/en');

      await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
      await expect(themeToggle(page)).toHaveAttribute('aria-pressed', String(scheme === 'light'));

      const { themeColor, background } = await themeColors(page);
      expect(themeColor).toBe(background);
    });
  });
}

test.describe('theme toggle', () => {
  test.use({ colorScheme: 'dark' });

  test('flips the theme, stores it and updates theme-color', async ({ page }) => {
    const html = page.locator('html');
    await page.goto('/en');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    const before = await themeColors(page);

    await themeToggle(page).click();

    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(themeToggle(page)).toHaveAttribute('aria-pressed', 'true');
    expect(await storedTheme(page)).toBe('light');
    const after = await themeColors(page);
    expect(after.themeColor).not.toBe(before.themeColor);
    expect(after.themeColor).toBe(after.background);
  });

  test('the choice survives a reload', async ({ page }) => {
    const html = page.locator('html');
    await page.goto('/en');
    await themeToggle(page).click();
    await expect(html).toHaveAttribute('data-theme', 'light');

    await page.reload();

    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(themeToggle(page)).toHaveAttribute('aria-pressed', 'true');
    expect(await storedTheme(page)).toBe('light');
  });

  test('a stored theme beats the system preference', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'light'));
    await page.goto('/en');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(themeToggle(page)).toHaveAttribute('aria-pressed', 'true');
  });
});
