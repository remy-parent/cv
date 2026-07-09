---
paths:
  - 'src/**/*.{tsx,css}'
  - 'index.html'
---

# Design system

**Source of truth: the `@theme` block in `src/index.css`.** Read it for the current
token values — never hardcode them here or in components.

## Colors

- **ALWAYS** use the token utilities (`bg-bg`, `bg-bg-raised`, `text-text`,
  `text-text-muted`, `text-accent`, `border-border`, …). **NEVER** hardcode a
  hex/rgb value in a component or in CSS.
- Every color ships in **both themes**. Dark is the default in `@theme`; light
  overrides live in `html[data-theme='light']` in `src/index.css`. A new color
  token **MUST** be added to both blocks, or one theme breaks.
- The accent is amber (`--color-accent` / `--color-accent-soft`). Use `text-accent`
  / `bg-accent-soft` — don't introduce a second accent color.

## Fonts

- Only two families: `font-heading` (Outfit 800 — headings) and `font-mono`
  (DM Mono — eyebrows, labels, mono bits). Body copy uses the default sans.
- Adding or changing a font = update the `@theme` block in `src/index.css` **AND**
  the Google Fonts `<link>` in `index.html`. Both, or the font silently falls back.

## Components

- Reuse the shared primitives in `src/components/ui/` (`Tag`, `Button`,
  `SectionHeading`) before writing a new one — don't rebuild a styled button.
