#!/usr/bin/env node --experimental-strip-types
// check-i18n — audits FR/EN parity for the remyparent-cv project.
//
// Three classes of bug this catches (none are caught by `tsc`):
//   1. Locale JSON parity — a key present in one locale file but not the other.
//   2. t() key validity     — a t('a.b.c') call whose path doesn't resolve in a locale.
//   3. Bilingual data gaps  — a { fr, en } field that is empty, whose fr/en arrays
//                             differ in length, or whose long prose is identical in
//                             both languages (a likely un-translated copy/paste).
//
// Run with:  node --experimental-strip-types scripts/check-i18n.mjs
// Optional:  --repo <path>  (defaults to cwd)
//
// Exit code is non-zero when any ERROR is found (warnings never fail the run), so
// this doubles as a CI gate if you ever wire it into a script.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const repoIdx = args.indexOf('--repo');
const REPO = repoIdx !== -1 ? args[repoIdx + 1] : process.cwd();

const LOCALES_DIR = join(REPO, 'src/i18n/locales');
const DATA_DIR = join(REPO, 'src/data');
const SRC_DIR = join(REPO, 'src');

// Prose fr===en shorter than this (or without a space) is almost always a legit
// shared token — brand names, "Front-end", "E-commerce & CMS". We only flag prose
// long enough to be a real sentence/bullet that was copy/pasted without translating.
const PROSE_DUP_MIN_LEN = 25;

const errors = [];
const warnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);
const rel = (p) => relative(REPO, p);

// ── helpers ────────────────────────────────────────────────────────────────

function walkFiles(dir, exts) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walkFiles(full, exts));
    else if (exts.includes(extname(name))) out.push(full);
  }
  return out;
}

// Flatten a JSON object into leaf paths: { a: { b: 1 } } -> ["a.b"].
function leafPaths(obj, prefix = '') {
  const paths = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') paths.push(...leafPaths(v, path));
    else paths.push(path);
  }
  return paths;
}

// Does a dotted path resolve to *anything* (leaf, object, or array) in obj?
function pathExists(obj, dotted) {
  let cur = obj;
  for (const seg of dotted.split('.')) {
    if (cur && typeof cur === 'object' && seg in cur) cur = cur[seg];
    else return false;
  }
  return true;
}

// ── check 1: locale JSON parity ──────────────────────────────────────────────

const localeFiles = walkFiles(LOCALES_DIR, ['.json']);
const locales = {}; // name -> parsed json
for (const f of localeFiles) {
  const name = f
    .replace(/\.json$/, '')
    .split('/')
    .pop();
  locales[name] = JSON.parse(readFileSync(f, 'utf8'));
}
const localeNames = Object.keys(locales);

if (localeNames.length < 2) {
  warn(
    `Only ${localeNames.length} locale file(s) found in ${rel(LOCALES_DIR)} — nothing to compare.`,
  );
}

const leafSets = {};
for (const name of localeNames) leafSets[name] = new Set(leafPaths(locales[name]));

// Union of every key seen anywhere, then report which locales are missing it.
const allKeys = new Set();
for (const name of localeNames) for (const k of leafSets[name]) allKeys.add(k);

for (const key of [...allKeys].sort()) {
  const missingIn = localeNames.filter((n) => !leafSets[n].has(key));
  if (missingIn.length > 0 && missingIn.length < localeNames.length) {
    const present = localeNames.filter((n) => leafSets[n].has(key));
    err(
      `Locale key "${key}" exists in [${present.join(', ')}] but is MISSING in [${missingIn.join(', ')}].`,
    );
  }
}

// ── check 2: t() key validity + dead keys ────────────────────────────────────

const T_CALL = /\bt\(\s*['"]([^'"]+)['"]/g;
// Dynamic keys like t(`languageToggle.${option}`) — capture the static prefix so we
// can treat the whole subtree under it as "used" and avoid false dead-key warnings.
const T_TEMPLATE = /\bt\(\s*`([^`$]*)/g;
const usedKeys = new Set();
const usedPrefixes = new Set();
for (const f of walkFiles(SRC_DIR, ['.ts', '.tsx'])) {
  if (f.endsWith('.test.ts') || f.endsWith('.test.tsx')) continue;
  const code = readFileSync(f, 'utf8');
  let m;
  while ((m = T_CALL.exec(code)) !== null) usedKeys.add(m[1]);
  while ((m = T_TEMPLATE.exec(code)) !== null) {
    const prefix = m[1].replace(/\.$/, '');
    if (prefix) usedPrefixes.add(prefix);
  }
}

for (const key of [...usedKeys].sort()) {
  const missingIn = localeNames.filter((n) => !pathExists(locales[n], key));
  if (missingIn.length > 0) {
    err(
      `t("${key}") is used in the code but the key does not resolve in [${missingIn.join(', ')}].`,
    );
  }
}

// A leaf key is "used" if it, or any ancestor path, was referenced by a t() call.
// (Ancestors matter because t('experience.beforeCode', {returnObjects:true}) pulls
// a whole subtree at once.)
function isCovered(leaf) {
  const segs = leaf.split('.');
  for (let i = segs.length; i >= 1; i--) {
    const ancestor = segs.slice(0, i).join('.');
    if (usedKeys.has(ancestor) || usedPrefixes.has(ancestor)) return true;
  }
  return false;
}
for (const key of [...allKeys].sort()) {
  if (!isCovered(key))
    warn(`Locale key "${key}" is never referenced by a t() call — possible dead translation.`);
}

// ── check 3: Bilingual data completeness ─────────────────────────────────────

// A Bilingual<T> node is any object whose keys are exactly {fr, en}.
function isBilingual(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
  const keys = Object.keys(v);
  return keys.length === 2 && keys.includes('fr') && keys.includes('en');
}

function isEmpty(v) {
  if (typeof v === 'string') return v.trim() === '';
  if (Array.isArray(v))
    return v.length === 0 || v.some((x) => typeof x === 'string' && x.trim() === '');
  return v == null;
}

// Recursively find every Bilingual node in an imported data value and validate it.
function auditBilingual(value, where, path = '') {
  if (isBilingual(value)) {
    const { fr, en } = value;
    if (isEmpty(fr)) err(`${where}: bilingual field ${path || '(root)'} has an empty "fr" value.`);
    if (isEmpty(en)) err(`${where}: bilingual field ${path || '(root)'} has an empty "en" value.`);
    if (Array.isArray(fr) && Array.isArray(en) && fr.length !== en.length) {
      err(
        `${where}: bilingual field ${path || '(root)'} has ${fr.length} fr item(s) but ${en.length} en item(s) — they must match.`,
      );
    }
    if (
      typeof fr === 'string' &&
      typeof en === 'string' &&
      fr.trim() !== '' &&
      fr === en &&
      fr.length >= PROSE_DUP_MIN_LEN &&
      fr.includes(' ')
    ) {
      warn(
        `${where}: bilingual field ${path || '(root)'} is identical in fr and en ("${fr}") — likely not translated.`,
      );
    }
    return; // don't recurse into fr/en themselves
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => auditBilingual(item, where, `${path}[${i}]`));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      auditBilingual(v, where, path ? `${path}.${k}` : k);
    }
  }
}

const dataFiles = walkFiles(DATA_DIR, ['.ts']).filter((f) => !f.endsWith('.test.ts'));
for (const f of dataFiles) {
  let mod;
  try {
    mod = await import(pathToFileURL(f).href);
  } catch (e) {
    err(
      `Could not import ${rel(f)} (${e.message}). Run this script with: node --experimental-strip-types`,
    );
    continue;
  }
  for (const [exportName, value] of Object.entries(mod)) {
    auditBilingual(value, rel(f), exportName);
  }
}

// ── report ───────────────────────────────────────────────────────────────────

const line = '─'.repeat(60);
console.log(line);
console.log('i18n parity check — FR / EN');
console.log(line);
console.log(
  `Locales : ${localeNames.length ? localeNames.join(', ') : '(none)'}  ·  Data files: ${dataFiles.length}  ·  t() keys used: ${usedKeys.size}`,
);
console.log('');

if (errors.length === 0 && warnings.length === 0) {
  console.log(
    '✅ All good — FR and EN are in sync, every t() key resolves, no empty bilingual fields.',
  );
  process.exit(0);
}

if (errors.length) {
  console.log(`❌ ${errors.length} error(s) — these break the bilingual experience:`);
  for (const e of errors) console.log(`   • ${e}`);
  console.log('');
}
if (warnings.length) {
  console.log(`⚠️  ${warnings.length} warning(s) — worth a look, not necessarily broken:`);
  for (const w of warnings) console.log(`   • ${w}`);
  console.log('');
}

console.log(line);
console.log(`Result: ${errors.length} error(s), ${warnings.length} warning(s).`);
process.exit(errors.length > 0 ? 1 : 0);
