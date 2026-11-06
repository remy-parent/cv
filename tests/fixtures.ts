import { test as base } from '@playwright/test';
import en from '../src/i18n/locales/en.json' with { type: 'json' };
import fr from '../src/i18n/locales/fr.json' with { type: 'json' };

export const LANGS = ['fr', 'en'] as const;
export type Lang = (typeof LANGS)[number];

// UI strings come from the app's own locale files, so the tests follow copy changes.
export const strings = { fr, en };

// Injected by Vercel in production; it does not exist on the local preview server.
const SPEED_INSIGHTS_SCRIPT = '/_vercel/speed-insights/script.js';

export interface PageIssues {
  /** Messages of the uncaught exceptions raised in the page (`pageerror`). */
  pageErrors: string[];
  /** `console.error` messages, without the noise of the requests aborted below. */
  consoleErrors: string[];
}

export const test = base.extend<{ pageIssues: PageIssues }>({
  // Runs for every test, whether or not the test reads it: the page never talks to
  // anything but the local preview server, so no test depends on the network.
  pageIssues: [
    // The second parameter is conventionally named `use`; that name trips the
    // react-hooks lint rule, which takes it for React's `use` hook.
    async ({ page, baseURL }, provide) => {
      const host = new URL(baseURL ?? '').hostname;
      const issues: PageIssues = { pageErrors: [], consoleErrors: [] };
      const aborted = new Set<string>();

      await page.route(
        (url) => url.hostname !== host || url.pathname === SPEED_INSIGHTS_SCRIPT,
        async (route) => {
          aborted.add(route.request().url());
          await route.abort();
        },
      );

      page.on('pageerror', (error) => issues.pageErrors.push(error.message));
      page.on('console', (message) => {
        if (message.type() !== 'error') return;
        const text = message.text();
        // Browsers word a failed request differently: match the usual message, or any
        // error that points at a URL aborted above.
        const fromAbortedRequest =
          text.includes('Failed to load resource') ||
          [...aborted].some((url) => text.includes(url) || message.location().url === url);
        if (!fromAbortedRequest) issues.consoleErrors.push(text);
      });

      await provide(issues);
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
