# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is `remyparent-cv`, Remy Parent's bilingual (FR/EN) personal CV/portfolio site. Single-page layout with path-based locale routing, deployed as a static build on Vercel.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — typecheck (`tsc -b`), build for production, then prerender `/fr` and `/en` to static HTML (`npm run prerender`: SSR build of `src/entry-server.tsx` + `scripts/prerender.mjs` writes `dist/{fr,en}/index.html` so crawlers without JS see full pages)
- `npm run preview` — preview the production build locally
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run format` / `npm run format:check` — Prettier
- `npm run typecheck` — `tsc -b` (type-checks every project referenced by `tsconfig.json`: app source, build tooling config and e2e files; nothing is emitted)
- `npm run test` — Vitest in watch mode
- `npm run test:run` — Vitest single run (use this in CI/non-interactive contexts)
- `npm run test:coverage` — Vitest with coverage
- Run a single Vitest test file: `npx vitest run path/to/file.test.tsx`
- Playwright e2e: `npx playwright test` (config in `playwright.config.ts`, tests in `tests/`). The config's `webServer` builds the site and serves the production build with `vite preview`, so the tests run against the production build, prerendered pages included. Install the browsers once with `npx playwright install`.
- Run a single Playwright test: `npx playwright test tests/routing.spec.ts`

CI (`.github/workflows/ci.yml`) runs, in order: `typecheck`, `lint`, `format:check`, `check:i18n`, `test:run`. A separate workflow runs Playwright against chromium/firefox/webkit. Match these locally before pushing.

- `npm run check:i18n` — audits FR/EN parity (`scripts/check-i18n.mjs`): locale key parity between `src/i18n/locales/{fr,en}.json`, `t()` keys that don't resolve, and incomplete `Bilingual<T>` fields in `src/data/*.ts` (empty sides, fr/en array-length mismatch, untranslated duplicates). Zero-dependency: uses `node --experimental-strip-types` to read the `.ts` data files. Exits non-zero on errors; warnings don't fail. The `/check-i18n` skill wraps the same script.
- `npm run cv:pdf -- [out.pdf]` — renders the French CV as a 2-page A4 PDF from `src/data/*.ts` and `fr.json` (`scripts/cv-pdf.mjs`, Playwright). Default output `out/cv-remy-parent.pdf` (git-ignored). Set `CV_PHONE` to add a phone number to the contact line (never committed). Needs network (Google Fonts) and a local Chromium. Not part of the build; the certificate list is duplicated in the script, keep it in sync with `Certifications.tsx`.
- `npm run og:image` — regenerates `public/og-image.png`, the share card behind the `og:image` tag, by rendering `scripts/og-image/template.html` with Playwright (`scripts/og-image.mjs`). It needs network access (Google Fonts) and a local Chromium (`npx playwright install chromium`), and refuses to write the image if a font did not load. It is not part of the build: run it after editing the template and commit the PNG.

A Husky `pre-commit` hook runs `npx lint-staged`, which runs `eslint --fix` + `prettier --write` on staged `.ts`/`.tsx` files and `prettier --write` on staged `.json`/`.css`/`.md` files.

## Architecture

- **Routing**: `react-router-dom`, path-based locales. `/` → `RootRedirect` (detects `navigator.language` or a stored preference, redirects to `/fr` or `/en`). `/:lang` → `LocaleLayout` (validates the segment, calls `i18n.changeLanguage`, sets `<html lang>`, persists the choice) → `Home`. Invalid lang segments and unknown paths both end up at `/404` → `NotFound`.
- **i18n**: `react-i18next`, initialized in `src/i18n/i18n.ts` with locally-imported JSON resources (`src/i18n/locales/{fr,en}.json`) — no HTTP backend, so there's no runtime fetch or flash-of-untranslated-content. These resources hold **UI strings only** (nav labels, buttons, eyebrows). CV content (experience, stats, skills) lives in typed bilingual data files under `src/data/`, shaped by `Bilingual<T>` in `src/types/content.ts`, and is read via `useCurrentLang()` (derived from the `:lang` route param, not from i18next's active language) rather than through `t()`.
- **Content vs UI string split**: when adding new copy, ask whether it's structural CV content (→ `data/*.ts` with `{fr, en}` fields) or generic UI text (→ `i18n/locales/*.json` + `t()`).
- **Styling**: Tailwind v4 via `@tailwindcss/vite`. Design tokens (`--color-bg`, `--color-accent`, `--font-heading` (Outfit 800), `--font-mono` (DM Mono)) are declared in a `@theme` block in `src/index.css` and consumed as ordinary Tailwind utilities (`bg-bg`, `text-accent`, `font-heading`, etc.). Fonts are loaded via Google Fonts `<link>` tags in `index.html`.
- **Scroll animations**: `useScrollReveal` (`src/hooks/useScrollReveal.ts`) is an `IntersectionObserver` hook; `AnimatedSection` (`src/components/layout/AnimatedSection.tsx`) wraps each page section to apply the fade-up transition. Tests mock `IntersectionObserver` globally in `src/test/setup.ts`.
- **Section composition**: `src/pages/Home.tsx` assembles the section components (`src/components/sections/`) in order — Hero, StatsBar, TechStack, Experience, ValueProposition, Certifications, Education, Contact — wrapped by `Nav`/`Footer` from `src/components/layout/`. Shared primitives (`Tag`, `Button`, `SectionHeading`) live in `src/components/ui/`.
- **SEO**: `react-helmet-async` wraps the app in `main.tsx`; `Home.tsx` sets title/description/canonical/hreflang (canonical uses `VITE_SITE_URL`, see `.env.example`).
- **Prerendering**: `/fr` and `/en` are rendered to static HTML at build time (`src/entry-server.tsx` via `renderToString` + `scripts/prerender.mjs`). On React 19, head tags are hoisted to the start of the `renderToString` output and the script splits them from the body. `main.tsx` hydrates (`hydrateRoot`) when `#root` has children, otherwise mounts fresh (SPA fallback for `/` and `/404`). `src/i18n/i18n.ts` picks the initial language from `location.pathname` so hydration of `/en` matches the prerendered English HTML — keep these in sync when touching i18n init.
- Unit/component tests (Vitest + Testing Library) are colocated as `Component.test.tsx` next to the component, per project convention. `src/test/setup.ts` wires up `@testing-library/jest-dom`, initializes i18next (resources must be loaded for `t()` calls to resolve in tests), and stubs `IntersectionObserver`.
- End-to-end tests (Playwright) live in `tests/` and are configured separately via `playwright.config.ts`; not run by Vitest (`vite.config.ts` excludes `tests/**`).
- TypeScript is split into `tsconfig.json` (solution/references root), `tsconfig.app.json` (app source, targets ES2023/DOM), `tsconfig.node.json` (build tooling config files like `vite.config.ts`), and `tsconfig.e2e.json` (`tests/` and `playwright.config.ts`).
- ESLint config (`eslint.config.js`) is flat-config based: `@eslint/js` recommended + `typescript-eslint` recommended + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` (Vite preset) + `eslint-plugin-jsx-a11y` recommended. Prettier integration is via `eslint-config-prettier` (lint and formatting are kept separate, not via `eslint-plugin-prettier`).

## Deployment notes

- Deployed to Vercel (auto-detected Vite preset: `npm run build`, output `dist/`). Because routing is client-side (`BrowserRouter`), `vercel.json` rewrites all paths to `/index.html` so that `/fr`, `/en`, etc. don't 404 on a hard refresh or direct link.
- `VITE_` prefix is required for any env var exposed to the client (Vite convention). See `.env.example` for the currently used `VITE_SITE_URL` — set it in the Vercel project's Environment Variables.
