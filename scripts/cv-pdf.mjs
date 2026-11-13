/**
 * Renders the French CV as an A4 PDF (2 pages max) from the same content as the site:
 * the typed data files in src/data/ and the UI strings in src/i18n/locales/fr.json.
 *
 * Usage: npm run cv:pdf -- [output.pdf]        (default: out/cv-remy-parent.pdf, git-ignored)
 *
 * Optional environment variable CV_PHONE adds a phone number to the contact block. It is read
 * from the environment on purpose: the number must not be committed to this public repository.
 *
 * Needs network access (Google Fonts) and a local Chromium (`npx playwright install chromium`).
 * Like og:image, it is not part of the build.
 */
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { experience } from '../src/data/experience.ts';
import { techStack } from '../src/data/techStack.ts';

const LANG = 'fr';
const MAX_PAGES = 2;
const REQUIRED_FONTS = ['Outfit 800', 'DM Mono 400', 'DM Mono 500'];

const EMAIL = 'remy.email@icloud.com';
const LINKEDIN = 'linkedin.com/in/remyparent';
const GITHUB = 'github.com/remy-parent';
const SITE = 'cv.remyparent.com'; // host of VITE_SITE_URL (.env.example)
const CITY = 'Aix-en-Provence (13100)';

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
const photo = `data:image/jpeg;base64,${readFileSync(path.join(root, 'src/assets/profile.jpg')).toString('base64')}`;

const esc = (s) =>
  String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const pick = (v) => (typeof v === 'string' ? v : v[LANG]);
const tags = (list) => list.map((x) => `<span class="tag">${esc(pick(x))}</span>`).join('');

const phone = process.env.CV_PHONE;
const contact = [
  `<a href="mailto:${EMAIL}">${EMAIL}</a>`,
  phone ? `<a class="nowrap" href="tel:${phone.replaceAll(/\s/g, '')}">${esc(phone)}</a>` : null,
  `<span class="nowrap">${esc(CITY)}</span>`,
  `<a href="https://${LINKEDIN}">${LINKEDIN}</a>`,
  `<a href="https://${GITHUB}">${GITHUB}</a>`,
  `<a href="https://${SITE}">${SITE}</a>`,
]
  .filter(Boolean)
  .join(' <span class="sep">·</span> ');

const stack = techStack
  .filter((g) => g.category.fr !== 'Langues')
  .map(
    (g) =>
      `<div class="stack-row"><b>${esc(g.category[LANG])}</b><div>${tags(g.skills)}</div></div>`,
  )
  .join('');
const languages = techStack.find((g) => g.category.fr === 'Langues').skills.join(' · ');

const jobs = experience
  .map((e) => {
    const links = (e.links ?? [])
      .map((l) => `<a class="job-link" href="${l.url}">${esc(l.label[LANG])} →</a>`)
      .join('');
    return `<section class="job">
  <div class="job-head"><h3>${esc(e.title[LANG])}</h3><span class="period">${esc(e.period[LANG])}</span></div>
  <p class="company">${esc(e.company)} · ${esc(e.location)}</p>
  <ul>${e.bullets[LANG].map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
  ${links ? `<p>${links}</p>` : ''}
  ${e.tags ? `<div class="job-tags">${tags(e.tags)}</div>` : ''}
</section>`;
  })
  .join('');

const before = fr.experience.beforeCode.map((b) => `${b.period} ${b.label}`).join(' · ');

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Remy Parent — CV</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Outfit:wght@800&display=swap" rel="stylesheet">
<style>
@page { size: A4; margin: 10mm 11mm; }
:root { --bg:#fff; --raised:#f7f7f5; --border:#e4e3df; --text:#16171b; --muted:#62636b; --accent:#b9770d; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin:0; background:var(--bg); color:var(--text); font-family:'DM Mono',monospace; font-size:7.6pt; line-height:1.38; }
h1,h2,h3 { font-family:'Outfit',sans-serif; font-weight:800; margin:0; }
a { color:inherit; text-decoration:none; }
header { display:flex; gap:14px; align-items:center; }
header .text { flex:1; min-width:0; }
.avail { display:inline-block; border:1px solid var(--border); border-radius:99px; padding:1px 8px; font-size:6.2pt; letter-spacing:.12em; text-transform:uppercase; color:var(--accent); }
h1 { font-size:25pt; line-height:1.05; margin-top:4px; }
.hook { color:var(--accent); font-size:10.5pt; margin:2px 0 3px; font-weight:500; }
.summary { color:var(--muted); margin:0; }
.photo { flex:none; width:21mm; height:21mm; border-radius:50%; border:1.5px solid var(--accent); object-fit:cover; object-position:center 22%; }
.contact { margin:5px 0 0; font-size:7pt; color:var(--muted); }
.contact a { color:var(--accent); white-space:nowrap; }
.sep { margin:0 1px; }
.nowrap { white-space:nowrap; }
h2 { font-size:11pt; margin:9px 0 4px; padding-top:6px; border-top:1px solid var(--border); }
h2 small { font-family:'DM Mono',monospace; font-weight:400; font-size:6pt; letter-spacing:.14em; text-transform:uppercase; color:var(--accent); margin-right:7px; vertical-align:2px; }
.stack-row { display:flex; gap:6px; margin-bottom:2px; align-items:baseline; }
.stack-row > b { flex:0 0 92px; font-weight:500; }
.tag { display:inline-block; border:1px solid var(--border); background:var(--raised); border-radius:99px; padding:0 5px; margin:0 2px 2px 0; font-size:6.3pt; color:var(--muted); }
.job { break-inside:avoid; margin-bottom:6px; padding:5px 8px; border:1px solid var(--border); border-radius:6px; background:var(--raised); }
.job-head { display:flex; justify-content:space-between; gap:8px; align-items:baseline; }
h3 { font-size:9pt; }
.period { color:var(--muted); font-size:6.8pt; white-space:nowrap; }
.company { margin:0; color:var(--accent); }
.job ul { margin:2px 0 0; padding-left:12px; color:var(--muted); }
.job li { margin-bottom:1px; }
.job p { margin:2px 0 0; }
.job-link { color:var(--accent); }
.job-tags { margin-top:2px; }
.certs { display:grid; grid-template-columns:1fr 1fr; gap:2px 14px; margin:0; padding:0; list-style:none; }
.certs span, .muted { color:var(--muted); }
.line { margin:2px 0 0; }
</style></head><body>
<header>
  <div class="text">
    <span class="avail">${esc(fr.hero.availability)}</span>
    <h1>Remy Parent</h1>
    <p class="hook">${esc(fr.hero.hook)}</p>
    <p class="summary">${esc(fr.hero.description)}</p>
    <p class="contact">${contact}</p>
  </div>
  <img class="photo" src="${photo}" alt="Remy Parent" />
</header>
<h2><small>${esc(fr.experience.eyebrow)}</small>${esc(fr.experience.title)}</h2>
${jobs}
<p class="muted line">${esc(fr.experience.beforeCodeToggle)} ${esc(before)}</p>
<h2><small>${esc(fr.techStack.eyebrow)}</small>${esc(fr.techStack.title)}</h2>
${stack}
<div class="stack-row"><b>Langues</b><div class="muted">${esc(languages)}</div></div>
<h2><small>${esc(fr.education.eyebrow)}</small>Formation &amp; certifications</h2>
<p class="line">${esc(fr.education.entry)} <span class="muted">· ${esc(fr.education.period)}</span></p>
<p class="line muted">${esc(fr.certifications.issuedBy)} :</p>
<ul class="certs">${CERTIFICATIONS.map(
  (c) => `<li><a href="${c.url}">${esc(c.name)}</a> <span>· ${esc(c.date)}</span></li>`,
).join('')}</ul>
</body></html>`;

mkdirSync(path.dirname(output), { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  const loaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts]
      .filter((f) => f.status === 'loaded')
      .map((f) => `${f.family.replaceAll(/["']/g, '')} ${f.weight}`);
  });
  const missing = REQUIRED_FONTS.filter((f) => !loaded.includes(f));
  if (missing.length > 0) {
    throw new Error(`Fonts not loaded: ${missing.join(', ')}. Nothing was written.`);
  }
  const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true, path: output });
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  console.log(`wrote ${output}: ${pages} page(s), ${Math.round(pdf.length / 1024)} KB`);
  if (pages > MAX_PAGES) {
    throw new Error(`The PDF has ${pages} pages, over the ${MAX_PAGES} pages limit.`);
  }
} finally {
  await browser.close();
}
