import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import i18n from './i18n/i18n';
import App from './App';
import type { Lang } from './types/content';

// On React 19, head tags (title, meta, link — including Helmet's) are
// hoisted by React itself to the start of the renderToString output;
// scripts/prerender.mjs splits them from the body markup.
export async function render(lang: Lang): Promise<string> {
  await i18n.changeLanguage(lang);
  return renderToString(
    <StrictMode>
      <HelmetProvider>
        <StaticRouter location={`/${lang}`}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>,
  );
}
