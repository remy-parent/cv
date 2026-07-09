/**
 * Post-build prerender: renders /fr and /en to static HTML in dist/ so
 * crawlers that don't execute JavaScript still see the full page.
 * Expects `vite build` (client) and `vite build --ssr` (dist/server) to
 * have run first — see the `build` script in package.json.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const langs = ['fr', 'en'];

// React 19 hoists head tags (title, meta, link) to the start of the
// renderToString output; peel them off the front until the first body tag.
const HOISTED_TAG = /^(?:<(?:link|meta)\b[^>]*\/?>|<title>[\s\S]*?<\/title>)/;

function splitHoisted(html) {
  let head = '';
  let body = html;
  for (let m = body.match(HOISTED_TAG); m; m = body.match(HOISTED_TAG)) {
    head += m[0];
    body = body.slice(m[0].length);
  }
  return { head, body };
}

const { render } = await import(pathToFileURL(path.join(dist, 'server/entry-server.js')).href);
const template = readFileSync(path.join(dist, 'index.html'), 'utf8');

for (const lang of langs) {
  const { head, body } = splitHoisted(await render(lang));
  if (!head.includes('rel="canonical"') || body.length === 0) {
    throw new Error(`prerender of /${lang} produced unexpected markup`);
  }

  const page = template
    .replace('<html lang="fr">', `<html lang="${lang}">`)
    // React owns the title and meta description on prerendered pages;
    // the static ones in the template only serve the SPA fallback (/, /404).
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, '')
    .replace('</head>', `  ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  mkdirSync(path.join(dist, lang), { recursive: true });
  writeFileSync(path.join(dist, lang, 'index.html'), page);
  console.log(`prerendered /${lang} -> dist/${lang}/index.html`);
}

rmSync(path.join(dist, 'server'), { recursive: true, force: true });
