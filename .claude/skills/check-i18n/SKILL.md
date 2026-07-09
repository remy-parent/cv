---
name: check-i18n
description: >-
  Audits FR/EN translation parity for this bilingual CV — catches missing locale
  keys, broken t() references, and incomplete bilingual data before they ship as
  an untranslated page. Use this whenever the user asks to check, verify, or audit
  translations / i18n / the bilingual site, when they mention /fr or /en content
  being out of sync, after editing anything under src/i18n/locales/ or src/data/,
  or before opening a PR that touches copy. Trigger on phrases like "check the
  translations", "vérifie les traductions", "is the English up to date", "il manque
  une trad", "audit i18n", "FR/EN parity", or any doubt about whether both languages
  render fully. Prefer this over a manual eyeball pass — the checks TypeScript can't
  do (JSON key parity, empty bilingual fields) are exactly the ones that silently
  break the page.
---

# check-i18n

This project ships a bilingual CV at `/fr` and `/en`. The two languages come from
two independent sources, and each has a failure mode that `tsc` and the test suite
do **not** catch:

- **UI strings** live in `src/i18n/locales/fr.json` and `en.json`, read via
  `t('some.key')`. These are plain JSON, so a key added to one file but forgotten
  in the other compiles fine and renders the raw key string (or falls back) at
  runtime.
- **CV content** (experience, tech stack, value props) lives in typed
  `Bilingual<T>` fields (`{ fr, en }`) under `src/data/*.ts`. TypeScript forces
  both keys to _exist_, but not to be _filled_ — an empty string, a fr/en array
  length mismatch, or a copy/paste that never got translated all pass the build.

The checker (`scripts/check-i18n.mjs`, also run in CI) inspects all three at once.
Your job is to run it, explain the results in the user's language (they work in
French — report in French unless they switch), and offer to fix.

## Step 1 — Run the checker

From the repo root:

```bash
npm run check:i18n
```

Under the hood this is `node --experimental-strip-types scripts/check-i18n.mjs` —
the flag lets Node import the `.ts` data files with no extra dependency (the project
has neither `tsx` nor `ts-node`). It exits non-zero when there is at least one
**error**, so it's also the CI gate. **Warnings never fail it** — they're advisory.

## Step 2 — Read the report

The output is grouped into errors (things that break the bilingual experience) and
warnings (worth a look, not necessarily broken):

| What you see                                                | What it means                                                                                            | How to fix                                                                                                     |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `Locale key "x.y" exists in [fr] but is MISSING in [en]`    | A UI string was added to one locale only.                                                                | Add the same key to the other locale JSON with a translation.                                                  |
| `t("x.y") is used in the code but does not resolve in [en]` | A `t()` call points at a key that's absent (typo or missing translation).                                | Fix the typo, or add the key to the failing locale(s).                                                         |
| `bilingual field …[i].description has an empty "en" value`  | A `{ fr, en }` field in `src/data/*.ts` is blank on one side.                                            | Fill in the missing translation.                                                                               |
| `… has N fr item(s) but M en item(s)`                       | A `Bilingual<string[]>` (e.g. `bullets`) has a different number of lines per language.                   | Add/remove lines so both arrays line up.                                                                       |
| ⚠️ `… is identical in fr and en (…)`                        | Long prose is byte-for-byte the same in both languages — usually a copy/paste that was never translated. | Translate it, or ignore if it's genuinely language-neutral.                                                    |
| ⚠️ `Locale key "x.y" is never referenced by a t() call`     | A translation exists but nothing uses it — possibly dead.                                                | Remove it, or confirm it's used dynamically (the checker already understands ``t(`prefix.${var}`)`` patterns). |

## Step 3 — Offer to fix, but don't invent copy silently

For **errors**, propose the fix and apply it once the user is on board. Structural
fixes (adding a missing key, aligning array lengths) are safe to do directly.

Translating is a **content decision**, not a mechanical one — this is someone's CV,
and tone matters. When a translation is missing, draft a proposal and show the
user the fr↔en pair before writing it, so they can adjust the wording. Don't quietly
machine-translate and move on.

After applying fixes, **re-run the checker** to confirm it's green, then run
`npm run test:run` if you touched anything the component tests cover.

## Notes

- The checker (`scripts/check-i18n.mjs`) auto-discovers every `*.json` under
  `src/i18n/locales/` and every `*.ts` under `src/data/`, so new locales or data
  files are picked up with no edits to the script. It finds `Bilingual` nodes
  structurally (any object whose keys are exactly `fr` and `en`), so new bilingual
  fields are validated automatically too.
- It's read-only — it never modifies the repo. All fixes are yours to make and
  confirm with the user.
