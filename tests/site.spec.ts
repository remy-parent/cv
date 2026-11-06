import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const LANGS = ['fr', 'en'] as const;
type Lang = (typeof LANGS)[number];

interface UiStrings {
  nav: { experience: string };
  languageToggle: Record<Lang, string>;
  themeToggle: { label: string };
  notFound: { title: string };
}

// UI strings are read from the app's own locale files, so these tests follow
// copy changes instead of hardcoding text.
function loadStrings(lang: Lang): UiStrings {
  const file = new URL(`../src/i18n/locales/${lang}.json`, import.meta.url);
  return JSON.parse(readFileSync(file, 'utf8')) as UiStrings;
}

const strings: Record<Lang, UiStrings> = { fr: loadStrings('fr'), en: loadStrings('en') };

test.describe('root redirect', () => {
  const cases: { locale: string; expected: Lang }[] = [
    { locale: 'fr-FR', expected: 'fr' },
    { locale: 'en-US', expected: 'en' },
    { locale: 'de-DE', expected: 'en' },
  ];

  for (const { locale, expected } of cases) {
    test.describe(`browser language ${locale}`, () => {
      test.use({ locale });

      test(`/ redirects to /${expected}`, async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL(new RegExp(`/${expected}$`));
      });
    });
  }
});

for (const lang of LANGS) {
  test.describe(`/${lang}`, () => {
    test('renders in the right language', async ({ page }) => {
      await page.goto(`/${lang}`);

      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByRole('link', { name: strings[lang].nav.experience })).toBeVisible();
    });

    // The prerendered HTML is what a crawler that does not run JavaScript reads.
    test.describe('without JavaScript', () => {
      test.use({ javaScriptEnabled: false });

      test('is served as prerendered HTML', async ({ page }) => {
        await page.goto(`/${lang}`);

        await expect(page.locator('html')).toHaveAttribute('lang', lang);
        await expect(page.locator('#root h1')).toHaveCount(1);
        await expect(page.getByRole('link', { name: strings[lang].nav.experience })).toBeAttached();
      });

      test('declares its canonical and alternate URLs', async ({ page }) => {
        await page.goto(`/${lang}`);

        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical).toHaveCount(1);
        await expect(canonical).toHaveAttribute('href', new RegExp(`/${lang}$`));

        for (const alternate of LANGS) {
          const link = page.locator(`link[rel="alternate"][hreflang="${alternate}"]`);
          await expect(link).toHaveCount(1);
          await expect(link).toHaveAttribute('href', new RegExp(`/${alternate}$`));
        }
      });
    });
  });
}

test.describe('language toggle', () => {
  // A French browser, so that landing on /en later proves the stored choice wins.
  test.use({ locale: 'fr-FR' });

  test('switches locale and remembers the choice', async ({ page }) => {
    await page.goto('/fr');
    await page.getByRole('button', { name: strings.fr.languageToggle.en, exact: true }).click();

    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await page.goto('/');
    await expect(page).toHaveURL(/\/en$/);
  });
});

test.describe('theme toggle', () => {
  test('switches theme and keeps it after a reload', async ({ page }) => {
    await page.goto('/en');
    const html = page.locator('html');
    const initial = await html.getAttribute('data-theme');
    const switched = initial === 'light' ? 'dark' : 'light';

    await page.getByRole('button', { name: strings.en.themeToggle.label }).click();
    await expect(html).toHaveAttribute('data-theme', switched);

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', switched);
  });
});

test.describe('not found', () => {
  for (const path of ['/de', '/fr/does-not-exist', '/does/not/exist']) {
    test(`${path} ends up on the 404 page`, async ({ page }) => {
      await page.goto(path);

      await expect(page).toHaveURL(/\/404$/);
      await expect(
        page.getByRole('heading', { level: 1, name: strings.fr.notFound.title }),
      ).toBeVisible();
    });
  }
});
