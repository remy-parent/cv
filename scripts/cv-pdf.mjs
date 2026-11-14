/**
 * Renders the French CV as an A4 PDF (2 pages max) from the same content as the site:
 * the typed data files in src/data/ and the UI strings in src/i18n/locales/fr.json.
 * The bullets are condensed here (CONDENSED) so that everything fits on two balanced pages;
 * titles, periods, companies, links and the tag pool still come from the site data.
 *
 * Usage: npm run cv:pdf -- [output.pdf]        (default: out/cv-remy-parent.pdf, git-ignored)
 *
 * Optional environment variable CV_PHONE adds a phone number to the contact block. It is read
 * from the environment on purpose: the number must not be committed to this public repository.
 *
 * The design is scripts/cv-base-style.css, used as is (system sans-serif fonts, no web fonts).
 * Needs a local Chromium (`npx playwright install chromium`). Like og:image, it is not part of the build.
 */
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { experience } from '../src/data/experience.ts';
import { techStack } from '../src/data/techStack.ts';

const LANG = 'fr';
const MAX_PAGES = 2;

const EMAIL = 'remy.email@icloud.com';
const LINKEDIN = 'linkedin.com/in/remyparent';
const GITHUB = 'github.com/remy-parent';
const SITE = 'cv.remyparent.com'; // host of VITE_SITE_URL (.env.example)
const CITY = 'Aix-en-Provence (13100)';
const TITLE = 'Développeur full-stack senior · TypeScript · API Claude · Claude Code';
const SUMMARY =
  '9+ ans d’expérience en agence, puis en mission chez un client (Salomon) : besoins clients traduits en fonctionnalités, estimation, lead d’une équipe de 7 développeurs. Aujourd’hui : TypeScript sur toute la stack (React, Node.js), API Claude (tool use) et Claude Code au quotidien. En appui : back-end e-commerce à grande échelle (PHP, Magento 2, AWS).';

// Stack: 4 cards on 2 rows, the tags most relevant for a TypeScript + AI full-stack role (every tag
// comes from src/data/techStack.ts; checked below). Accent tags: 1 or 2 per card.
const MORE = 'et plus…'; // filler pill: the list is not exhaustive
const STACK_CARDS = [
  {
    title: 'IA & Qualité',
    tags: [
      'Claude API',
      'Tool use',
      'MCP',
      'Claude Code',
      'Prompt Engineering',
      'Sous-agents',
      MORE,
    ],
    accent: ['Claude API', 'Claude Code'],
  },
  {
    title: 'Front-end',
    tags: ['React', 'Next.js', 'TypeScript', 'Vitest', 'Playwright'],
    accent: ['React', 'Next.js'],
  },
  {
    title: 'Back-end',
    tags: ['Node.js', 'TypeScript', 'PHP 7/8', 'Symfony', 'Laravel', 'Magento 2', 'WordPress'],
    accent: ['TypeScript', 'Node.js'],
  },
  {
    title: 'Data, Cloud & Architecture',
    tags: [
      'GraphQL',
      'PostgreSQL',
      'DynamoDB',
      'AWS',
      'Serverless',
      'Microservices',
      'Docker',
      'CI/CD',
    ],
    accent: ['DynamoDB', 'AWS'],
  },
];

// Condensed wording of the site's experience bullets (same facts, same figures), max 5 tags each
// (picked from the entry's tags on the site).
const CONDENSED = {
  'personal-fullstack': {
    bullets: [
      'Sami (en développement, dépôt privé) : application bilingue de musculation et suivi d’entraînement, en TypeScript (web) et SwiftUI (iOS). Coach IA sur l’API Claude (SDK Anthropic) : enregistre une série, compose une séance ou répond via les mêmes services que l’interface ; boucle de tool use bornée, quota d’usage IA atomique par utilisateur. Typé, testé de bout en bout (Vitest / Playwright), CI/CD Vercel.',
      'Développement augmenté par l’IA : Spec-Driven Development (docs de design et briefs validés avant implémentation), Claude Code sous règles écrites (CLAUDE.md, permissions), commandes personnalisées, 5 sous-agents dont 2 de revue à froid, serveur MCP Playwright pour la vérification de bout en bout. Sur mon site (cv.remyparent.com, code public) : hooks, skills, revue automatique par Claude en CI.',
      'En préparation : certification CCDV-F. Cours de préparation à l’examen terminé (Udemy, 14 h, 2 nov. 2026).',
    ],
    tags: ['TypeScript', 'Claude API', 'Claude Code', 'React', 'Vitest'],
  },
  'darwin-salomon': {
    bullets: [
      'Refonte complète du site Salomon en Next.js / React (monorepo) ; responsable de la page produit (composants React réutilisables, logique, état, Tailwind).',
      'Seul concepteur et mainteneur du microservice de données produits (Node.js / TypeScript, ERP + PIM ; AWS serverless, GraphQL / Apollo, DynamoDB, Jest) : 2 500–3 500 modèles (30 000+ SKUs) dans 12 pays.',
      'Architecture événementielle (le PIM publie sur un bus d’événements, le service écoute et écrit dans DynamoDB) ; 2 librairies partagées, dont une de synonymes réutilisée par checkout, recherche et menu.',
      'Les ~18 premiers mois : maintenance de 5 sites e-commerce Amer Sports (Magento 2.4 Enterprise, PHP 8.2).',
    ],
    tags: [],
  },
  quatrecentquatre: {
    bullets: [
      'Développé plusieurs sites e-commerce sur Magento, Laravel et CraftCMS, de l’architecture aux fonctionnalités.',
      'Besoins clients traduits en fonctionnalités avec les analystes ; estimation et découpage des tâches, refactoring de code legacy, déploiements et mises à jour de frameworks (support QA).',
      'Monté jusqu’à Lead d’une équipe de 7 développeurs : revues de code, formation des juniors, ateliers techniques (SOLID, design patterns), rituels EOS (Level 10 meetings).',
    ],
    tags: [],
  },
  'u92-pulse': {
    bullets: [
      'Seul développeur back-end (PHP / Symfony) de Pulse, application RH interne : architecture et concept produit.',
    ],
    tags: [],
  },
  o2web: {
    bullets: [
      'Bâti l’architecture back-end de 9 sites e-commerce (7 Magento 2, 2 Drupal 8) pour des marques nationales ; mené la migration Magento 1 → 2 de HockeyShot.',
      'Intégrations critiques (passerelles de paiement, connecteurs ERP / CRM) ; encadré jusqu’à 3 développeurs.',
    ],
    tags: [],
  },
  monolith: {
    bullets: [
      'Full-stack orienté back-end sur des projets e-commerce (WooCommerce, Magento 1, Shopify).',
    ],
    tags: [],
  },
};

// Same list as CERTIFICATIONS in src/components/sections/Certifications.tsx (keep in sync).
const CERTIFICATIONS = [
  { name: 'Claude Code 101', date: 'Mai 2026', url: 'https://verify.skilljar.com/c/9vnxrrovpbnx' },
  {
    name: 'Claude Code in Action',
    date: 'Juin 2026',
    url: 'https://verify.skilljar.com/c/hu8raudyayra',
  },
  {
    name: 'Building with the Claude API',
    date: '2026',
    url: 'https://verify.skilljar.com/c/ncmbuppm9k2m',
  },
  { name: 'Introduction to MCP', date: '2026', url: 'https://verify.skilljar.com/c/gowi6vu8sib5' },
  { name: 'MCP: Advanced Topics', date: '2026', url: 'https://verify.skilljar.com/c/626idhj2nk6v' },
];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(process.argv[2] ?? path.join(root, 'out/cv-remy-parent.pdf'));
const fr = JSON.parse(readFileSync(path.join(root, 'src/i18n/locales/fr.json'), 'utf8'));
const css = readFileSync(path.join(root, 'scripts/cv-base-style.css'), 'utf8');
const photo = `data:image/jpeg;base64,${readFileSync(path.join(root, 'src/assets/profile.jpg')).toString('base64')}`;

const esc = (s) =>
  String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const pick = (v) => (typeof v === 'string' ? v : v[LANG]);
const tag = (text, accent, more) =>
  `<span class="tag${accent ? ' accent' : ''}${more ? ' more' : ''}">${esc(text)}</span>`;

const phone = process.env.CV_PHONE;
const contactItems = [
  ['@', `<a href="mailto:${EMAIL}">${EMAIL}</a>`],
  phone ? ['·', `<a href="tel:${phone.replaceAll(/\s/g, '')}">${esc(phone)}</a>`] : null,
  ['·', esc(CITY)],
  ['·', 'Langues : Français · Anglais'],
  null, // line break
  ['in', `<a href="https://${LINKEDIN}">${LINKEDIN}</a>`],
  ['gh', `<a href="https://${GITHUB}">${GITHUB}</a>`],
  ['↗', `<a href="https://${SITE}">${SITE}</a>`],
]
  .filter((x) => x !== undefined && (x === null || x))
  .map((x) =>
    x === null
      ? '<span style="flex-basis:100%;height:0"></span>'
      : `<span><span class="dot">${x[0]}</span>${x[1]}</span>`,
  )
  .join('');

const pool = new Set(techStack.flatMap((g) => g.skills.map(pick)));
const stack = STACK_CARDS.map((c) => {
  for (const t of c.tags)
    if (t !== MORE && !pool.has(t)) throw new Error(`Stack tag "${t}" is not on the site.`);
  return `<div class="stack-card"><h4>${esc(c.title)}</h4><div class="tags">${c.tags
    .map((t) => tag(t, c.accent.includes(t), t === MORE))
    .join('')}</div></div>`;
}).join('');
const jobs = experience
  .map((e) => {
    const c = CONDENSED[e.id];
    if (!c) throw new Error(`No condensed content for experience "${e.id}".`);
    const link = (e.links ?? [])
      .map((l) => `<a class="xp-link" href="${l.url}">${esc(l.label[LANG])} →</a>`)
      .join(' ');
    const bullets = c.bullets
      .map((b, i) => `<li>${esc(b)}${i === 0 && link ? ` ${link}` : ''}</li>`)
      .join('');
    return `<div class="xp">
  <div class="xp-top"><div class="xp-role">${esc(e.title[LANG])}</div><div class="xp-period">${esc(e.period[LANG])}</div></div>
  <div class="xp-company">${esc(e.company)} <span class="loc">· ${esc(e.location)}</span></div>
  ${c.subtitle ? `<div class="xp-sub">${esc(c.subtitle)}</div>` : ''}
  <ul>${bullets}</ul>
  ${c.tags.length ? `<div class="tags">${c.tags.map((t, i) => tag(t, i === 0)).join('')}</div>` : ''}
</div>`;
  })
  .join('');

// "Avant le code": the site lists the entries latest first; the CV reads them chronologically.
const lcfirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const startYear = (b) => Number(b.period.slice(0, 4));
const beforeEntries = [...fr.experience.beforeCode].sort((a, b) => startYear(a) - startYear(b));
const beforeText = beforeEntries
  .map((b) => {
    const [role, place] = b.label.split(' · ');
    return `${lcfirst(role)}, ${place} (${b.period})`;
  })
  .join(', puis ');
const beforeRange = `${beforeEntries[0].period.slice(0, 4)}–${beforeEntries.at(-1).period.slice(-4)}`;

const [studyTitle, studyPlace] = fr.education.entry.split(' — ');
const ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14.5 7 22l5-3 5 3-1.5-7.5"/></svg>';
const certs = CERTIFICATIONS.map(
  (c) =>
    `<div class="cert">${ICON}<div style="flex:1;display:flex;justify-content:space-between;align-items:baseline;gap:8px"><div class="cert-name">${esc(c.name)}</div><div class="cert-sub" style="white-space:nowrap">${esc(c.date)} · <a class="cert-verify" href="${c.url}">${esc(fr.certifications.verify)} →</a></div></div></div>`,
).join('');

const heading = (eyebrow, title) =>
  `<div class="eyebrow">${esc(eyebrow)}</div><h2 class="section-title">${esc(title)}</h2>`;

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Remy Parent — CV</title>
<style>
${css}
</style></head><body>
<div class="sheet">
<div class="header" style="flex-wrap:wrap;row-gap:0">
  <div style="flex:1;min-width:0">
    <span class="pill">Disponible · Temps plein · Aix-en-Provence</span>
    <h1 class="name">Remy Parent</h1>
    <div class="headline">${esc(TITLE)}</div>
    <p class="summary">${esc(SUMMARY).replaceAll('back-end', '<span style="white-space:nowrap">back-end</span>')}</p>
  </div>
  <div class="avatar"><img src="${photo}" alt="Remy Parent" /></div>
  <div class="contact" style="flex-basis:100%">${contactItems}</div>
</div>
<div class="section">${heading(fr.techStack.eyebrow, fr.techStack.title)}
<div class="stack">${stack}</div></div>
<div class="section">${heading(fr.experience.eyebrow, fr.experience.title)}
${jobs}</div>
<div class="section grid-2" style="grid-template-columns:.95fr 1.05fr">
  <div class="card"><div class="eyebrow">${esc(fr.education.eyebrow)}</div><h2 class="section-title">Formation</h2>
    <div class="edu-item"><div class="edu-title">${esc(studyTitle)}</div><div class="edu-meta">${esc(studyPlace)} <span class="muted">· ${esc(fr.education.period)}</span></div></div>
    <div class="edu-item"><div class="edu-title">Avant le code (${beforeRange})</div><div class="edu-meta"><span class="muted">${esc(beforeText[0].toUpperCase() + beforeText.slice(1))}.</span></div></div>
  </div>
  <div class="card cert-compact"><div class="eyebrow">${esc(fr.certifications.eyebrow)}</div><h2 class="section-title">Certifications</h2>${certs}</div>
</div>
</div>
</body></html>`;

mkdirSync(path.dirname(output), { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true, path: output });
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  console.log(`wrote ${output}: ${pages} page(s), ${Math.round(pdf.length / 1024)} KB`);
  if (pages > MAX_PAGES) {
    throw new Error(`The PDF has ${pages} pages, over the ${MAX_PAGES} pages limit.`);
  }
} finally {
  await browser.close();
}
