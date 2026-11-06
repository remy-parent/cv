import { expect, strings, test } from './fixtures';

// A French browser, so that ending up on /en proves the stored choice wins.
test.use({ locale: 'fr-FR' });

test('switching language keeps the hash and remembers the choice', async ({ page }) => {
  const html = page.locator('html');
  const storedLang = () => page.evaluate(() => localStorage.getItem('preferred-lang'));

  await page.goto('/fr#experience');
  await page.getByRole('button', { name: strings.fr.languageToggle.en, exact: true }).click();

  await expect(page).toHaveURL(/\/en#experience$/);
  await expect(html).toHaveAttribute('lang', 'en');
  await expect.poll(storedLang).toBe('en');

  await page.reload();
  await expect(page).toHaveURL(/\/en#experience$/);
  await expect(html).toHaveAttribute('lang', 'en');
  await expect.poll(storedLang).toBe('en');

  await page.goto('/');
  await expect(page).toHaveURL(/\/en$/);
});
