import { expect, LANGS, test } from './fixtures';

// The purpose of the prerender: a crawler that does not run JavaScript still gets
// the full page.
test.use({ javaScriptEnabled: false });

for (const lang of LANGS) {
  // On its own, `vite preview` only serves dist/<lang>/index.html for /<lang>/ (with
  // a trailing slash) and answers /<lang> with the empty app shell. The preview plugin
  // in vite.config.ts maps /<lang> to the prerendered file, as production does. If
  // that mapping breaks, this test fails: without JavaScript the shell has no content.
  test(`/${lang} is served with its content`, async ({ page }) => {
    await page.goto(`/${lang}`);

    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
  });
}
