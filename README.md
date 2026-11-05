# remyparent-cv

[![CI](https://github.com/xyphoide/cv/actions/workflows/ci.yml/badge.svg)](https://github.com/xyphoide/cv/actions/workflows/ci.yml)

Bilingual (FR/EN) personal CV and portfolio site: a single page, built to static HTML and deployed on Vercel.

Live site: <https://cv.remyparent.com>

## Stack

- React, TypeScript and Vite
- Tailwind CSS
- React Router for path-based locales
- i18next with react-i18next for UI strings
- react-helmet-async for head tags
- Vitest and Testing Library for unit and component tests, Playwright for end-to-end tests
- ESLint and Prettier, run on commit through Husky and lint-staged
- Vercel for hosting, with Vercel Speed Insights

## Getting started

You need Node.js and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The only environment variable is `VITE_SITE_URL` (see [.env.example](.env.example)). It is read at build time and is the base of the canonical and hreflang links set in [src/pages/Home.tsx](src/pages/Home.tsx). If it is unset, the code falls back to a default.

## Scripts

| Script                  | What it does                                                                      |
| ----------------------- | --------------------------------------------------------------------------------- |
| `npm run dev`           | Starts the Vite dev server.                                                       |
| `npm run build`         | Typechecks with `tsc -b`, builds the production bundle, then runs `prerender`.    |
| `npm run prerender`     | Builds the server entry and writes static HTML for `/fr` and `/en` into `dist/`.  |
| `npm run preview`       | Serves the production build locally.                                              |
| `npm run lint`          | Runs ESLint.                                                                      |
| `npm run lint:fix`      | Runs ESLint and applies automatic fixes.                                          |
| `npm run format`        | Formats the repository with Prettier.                                             |
| `npm run format:check`  | Checks formatting with Prettier without writing.                                  |
| `npm run test`          | Runs Vitest, in watch mode when started from a terminal.                          |
| `npm run test:run`      | Runs Vitest once.                                                                 |
| `npm run test:coverage` | Runs Vitest once with a coverage report.                                          |
| `npm run typecheck`     | Runs `tsc --noEmit`.                                                              |
| `npm run check:i18n`    | Audits FR/EN parity: locale keys, `t()` keys that do not resolve, bilingual data. |
| `npm run prepare`       | Installs the Husky git hooks. npm runs it automatically after `npm install`.      |

## How it's built

- **Locale routing.** [src/App.tsx](src/App.tsx) declares `/`, `/:lang` and `/404`. `/` redirects to `/fr` or `/en` from a stored preference or the browser language ([src/routes/RootRedirect.tsx](src/routes/RootRedirect.tsx)). `/:lang` validates the segment and keeps i18next and `<html lang>` in sync ([src/routes/LocaleLayout.tsx](src/routes/LocaleLayout.tsx)).
- **Two kinds of copy.** UI strings live in [src/i18n/locales/](src/i18n/locales/) and are read with `t()`. Structured CV content lives in typed data files in [src/data/](src/data/), where each translatable field is a `Bilingual<T>` ([src/types/content.ts](src/types/content.ts)) read with the route language from [src/hooks/useCurrentLang.ts](src/hooks/useCurrentLang.ts).
- **Prerendering.** `npm run build` renders `/fr` and `/en` to static HTML, so crawlers that do not run JavaScript still get the full page content. [src/entry-server.tsx](src/entry-server.tsx) renders the app to a string and [scripts/prerender.mjs](scripts/prerender.mjs) writes `dist/fr/index.html` and `dist/en/index.html`. [src/main.tsx](src/main.tsx) hydrates those pages and mounts a fresh app on every other path.
- **Design tokens.** Colors and fonts are declared once in the Tailwind theme block of [src/index.css](src/index.css) and used as ordinary utilities. Dark is the default; the light theme overrides the same color tokens.
- **Scroll reveal.** [src/hooks/useScrollReveal.ts](src/hooks/useScrollReveal.ts) is an `IntersectionObserver` hook, and [src/components/layout/AnimatedSection.tsx](src/components/layout/AnimatedSection.tsx) uses it to fade each section in the first time it enters the viewport.

[CLAUDE.md](CLAUDE.md) has the details.

## Quality gates

- **CI** ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs on every pull request and on pushes to `master`. In order: `typecheck`, `lint`, `format:check`, `check:i18n`, `test:run`.
- **Git hooks** are managed by Husky. The pre-commit hook runs lint-staged: ESLint with fixes and Prettier on staged TypeScript and JavaScript files, Prettier on staged JSON, CSS and Markdown files. The pre-push hook runs the unit tests.
- **End-to-end tests** run in a separate workflow ([.github/workflows/playwright.yml](.github/workflows/playwright.yml)) on pull requests to `master` and on pushes to it. It runs `npx playwright test` against the Chromium, Firefox and WebKit projects defined in [playwright.config.ts](playwright.config.ts), and uploads the HTML report.

Unit and component tests sit next to the code they cover in `src/`; end-to-end tests are in [tests/](tests/).

## Built with Claude Code

This repository is developed with [Claude Code](https://claude.com/claude-code). What lives in the repo for it:

- [CLAUDE.md](CLAUDE.md): project guidance for Claude Code, covering commands, architecture and deployment notes.
- [.claude/commands/change.md](.claude/commands/change.md): the `/change` command. It creates a work branch from an up-to-date `origin/master` and asks what to do with uncommitted changes first.
- [.claude/commands/submit.md](.claude/commands/submit.md): the `/submit` command. It runs lint and tests, rebases on `origin/master`, pushes the branch and opens the pull request. It never merges.
- [.claude/hooks/block-master-edit.sh](.claude/hooks/block-master-edit.sh): a hook that blocks file edits while `master` is checked out.
- [.claude/hooks/confirm-git-push.sh](.claude/hooks/confirm-git-push.sh): a hook that asks for confirmation before any `git push`.
- [.claude/skills/check-i18n/](.claude/skills/check-i18n/): a skill that runs `npm run check:i18n`, explains the report and offers fixes.
- [.github/workflows/claude-code-review.yml](.github/workflows/claude-code-review.yml): a workflow that runs an automated Claude code review on each pull request.

## Content and reuse

The source is published for reference.

- **Content.** The texts of the site (in [src/data/](src/data/), [src/i18n/locales/](src/i18n/locales/) and the section components), the photo ([src/assets/profile.jpg](src/assets/profile.jpg)), the Open Graph image ([public/og-image.png](public/og-image.png)) and the identity they carry are © Rémy Parent, all rights reserved. They are not licensed for copying, reuse or republishing.
- **Code.** No open-source license is granted for the code either. If you want to reuse part of it, get in touch through the Contact section of the [live site](https://cv.remyparent.com).
