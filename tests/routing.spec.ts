import { expect, LANGS, strings, test } from './fixtures';

test.describe('root redirect', () => {
  const cases = [
    { locale: 'fr-FR', expected: 'fr' },
    { locale: 'en-US', expected: 'en' },
    { locale: 'de-DE', expected: 'en' },
  ];

  for (const { locale, expected } of cases) {
    test.describe(`browser locale ${locale}`, () => {
      test.use({ locale });

      test(`/ redirects to /${expected}`, async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL(new RegExp(`/${expected}$`));
      });
    });
  }

  test.describe('stored preference', () => {
    test.use({ locale: 'fr-FR' });

    test('a stored language beats the browser locale', async ({ page }) => {
      await page.addInitScript(() => localStorage.setItem('preferred-lang', 'en'));
      await page.goto('/');
      await expect(page).toHaveURL(/\/en$/);
    });
  });
});

for (const lang of LANGS) {
  test.describe(`/${lang}`, () => {
    test('declares its language, title and canonical URL', async ({ page }) => {
      await page.goto(`/${lang}`);

      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page).toHaveTitle(/\S/);

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      await expect(canonical).toHaveAttribute('href', new RegExp(`/${lang}$`));
    });

    test('marks the current language in the language toggle', async ({ page }) => {
      await page.goto(`/${lang}`);

      for (const option of LANGS) {
        const button = page.getByRole('button', {
          name: strings[lang].languageToggle[option],
          exact: true,
        });
        await expect(button).toHaveAttribute('aria-pressed', String(option === lang));
      }
    });

    test('every in-page nav link has a target', async ({ page }) => {
      await page.goto(`/${lang}`);

      const hrefs = await page
        .getByRole('navigation')
        .locator('a[href^="#"]')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
      expect(hrefs.length).toBeGreaterThan(0);

      for (const href of hrefs) {
        await expect(page.locator(`[id="${href.slice(1)}"]`), href).toHaveCount(1);
      }
    });
  });
}
