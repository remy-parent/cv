import { expect, LANGS, test } from './fixtures';

// React must adopt the prerendered HTML as it is. When the first client render
// differs from it, React reports a hydration error, renders the page again from
// scratch and leaves a second copy of every head tag behind.
for (const scheme of ['light', 'dark'] as const) {
  for (const lang of LANGS) {
    test.describe(`/${lang} with a ${scheme} color scheme`, () => {
      test.use({ colorScheme: scheme });

      test('hydrates without errors or duplicated head tags', async ({ page, pageIssues }) => {
        await page.goto(`/${lang}`);
        // The language is stored by an effect, so once it is there React has
        // finished rendering the page.
        await expect
          .poll(() => page.evaluate(() => localStorage.getItem('preferred-lang')))
          .toBe(lang);

        await expect.soft(page.locator('title')).toHaveCount(1);
        await expect.soft(page.locator('meta[name="description"]')).toHaveCount(1);
        await expect.soft(page.locator('link[rel="canonical"]')).toHaveCount(1);
        await expect.soft(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(3);
        expect.soft(pageIssues.pageErrors).toEqual([]);
        expect.soft(pageIssues.consoleErrors).toEqual([]);
      });
    });
  }
}
