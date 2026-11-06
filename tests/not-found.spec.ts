import { expect, strings, test } from './fixtures';

// The server answers every unknown path with the app shell; the redirect to /404
// happens in the browser.
for (const path of ['/nope', '/xx/yy', '/de']) {
  test(`${path} ends on the 404 page`, async ({ page }) => {
    await page.goto(path);

    await expect(page).toHaveURL(/\/404$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
}

const cases = [
  { locale: 'fr-FR', expected: 'fr' },
  { locale: 'en-US', expected: 'en' },
];

for (const { locale, expected } of cases) {
  test.describe(`browser locale ${locale}`, () => {
    test.use({ locale });

    test(`the link back home ends on /${expected}`, async ({ page }) => {
      await page.goto('/nope');
      await expect(page).toHaveURL(/\/404$/);

      // Whichever language the 404 copy is in.
      const home = page
        .getByRole('link', { name: strings.fr.notFound.back })
        .or(page.getByRole('link', { name: strings.en.notFound.back }));
      await home.click();

      await expect(page).toHaveURL(new RegExp(`/${expected}$`));
    });
  });
}
