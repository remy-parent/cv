# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is `remyparent.com`, Remy Parent's bilingual (FR/EN) personal CV/portfolio site. Single-page layout with path-based locale routing, deployed as a static build (no Node process) to an Nginx-served VPS.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — typecheck (`tsc -b`) then build for production
- `npm run preview` — preview the production build locally
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run format` / `npm run format:check` — Prettier
- `npm run typecheck` — `tsc --noEmit`
- `npm run test` — Vitest in watch mode
- `npm run test:run` — Vitest single run (use this in CI/non-interactive contexts)
- `npm run test:coverage` — Vitest with coverage
- Run a single Vitest test file: `npx vitest run path/to/file.test.tsx`
- Playwright e2e: `npx playwright test` (config in `playwright.config.ts`, tests in `tests/`)
- Run a single Playwright test: `npx playwright test tests/example.spec.ts`

CI (`.github/workflows/ci.yml`) runs, in order: `typecheck`, `lint`, `format:check`, `test:run`. A separate workflow runs Playwright against chromium/firefox/webkit. Match these locally before pushing.

A Husky `pre-commit` hook runs `npx lint-staged`, which runs `eslint --fix` + `prettier --write` on staged `.ts`/`.tsx` files and `prettier --write` on staged `.json`/`.css`/`.md` files.

## Architecture

- **Routing**: `react-router-dom`, path-based locales. `/` → `RootRedirect` (detects `navigator.language` or a stored preference, redirects to `/fr` or `/en`). `/:lang` → `LocaleLayout` (validates the segment, calls `i18n.changeLanguage`, sets `<html lang>`, persists the choice) → `Home`. Invalid lang segments and unknown paths both end up at `/404` → `NotFound`.
- **i18n**: `react-i18next`, initialized in `src/i18n/i18n.ts` with locally-imported JSON resources (`src/i18n/locales/{fr,en}.json`) — no HTTP backend, so there's no runtime fetch or flash-of-untranslated-content. These resources hold **UI strings only** (nav labels, buttons, eyebrows). CV content (experience, stats, skills) lives in typed bilingual data files under `src/data/`, shaped by `Bilingual<T>` in `src/types/content.ts`, and is read via `useCurrentLang()` (derived from the `:lang` route param, not from i18next's active language) rather than through `t()`.
- **Content vs UI string split**: when adding new copy, ask whether it's structural CV content (→ `data/*.ts` with `{fr, en}` fields) or generic UI text (→ `i18n/locales/*.json` + `t()`).
- **Styling**: Tailwind v4 via `@tailwindcss/vite`. Design tokens (`--color-bg`, `--color-accent`, `--font-heading` (Syne 800), `--font-mono` (DM Mono)) are declared in a `@theme` block in `src/index.css` and consumed as ordinary Tailwind utilities (`bg-bg`, `text-accent`, `font-heading`, etc.). Fonts are loaded via Google Fonts `<link>` tags in `index.html`.
- **Scroll animations**: `useScrollReveal` (`src/hooks/useScrollReveal.ts`) is an `IntersectionObserver` hook; `AnimatedSection` (`src/components/layout/AnimatedSection.tsx`) wraps each page section to apply the fade-up transition. Tests mock `IntersectionObserver` globally in `src/test/setup.ts`.
- **Section composition**: `src/pages/Home.tsx` assembles the section components (`src/components/sections/`) in order — Hero, StatsBar, TechStack, Experience, ValueProposition, CurrentlyWorkingOn, Contact — wrapped by `Nav`/`Footer` from `src/components/layout/`. Shared primitives (`Tag`, `Button`, `SectionHeading`) live in `src/components/ui/`.
- **SEO**: `react-helmet-async` wraps the app in `main.tsx`; `Home.tsx` sets title/description/canonical (canonical uses `VITE_SITE_URL`, see `.env.example`).
- Unit/component tests (Vitest + Testing Library) are colocated as `Component.test.tsx` next to the component, per project convention. `src/test/setup.ts` wires up `@testing-library/jest-dom`, initializes i18next (resources must be loaded for `t()` calls to resolve in tests), and stubs `IntersectionObserver`.
- End-to-end tests (Playwright) live in `tests/` and are configured separately via `playwright.config.ts`; not run by Vitest (`vite.config.ts` excludes `tests/**`).
- TypeScript is split into `tsconfig.json` (solution/references root), `tsconfig.app.json` (app source, targets ES2023/DOM), and `tsconfig.node.json` (build tooling config files like `vite.config.ts`).
- ESLint config (`eslint.config.js`) is flat-config based: `@eslint/js` recommended + `typescript-eslint` recommended + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` (Vite preset) + `eslint-plugin-jsx-a11y` recommended. Prettier integration is via `eslint-config-prettier` (lint and formatting are kept separate, not via `eslint-plugin-prettier`).

## Deployment notes

- Production build (`dist/`) is meant to be served directly by Nginx, no Node process. Because routing is client-side (`BrowserRouter`), Nginx needs a SPA fallback (`try_files $uri /index.html;`) so that `/fr`, `/en`, etc. don't 404 on a hard refresh.
- `VITE_` prefix is required for any env var exposed to the client (Vite convention). See `.env.example` for the currently used `VITE_SITE_URL`.
