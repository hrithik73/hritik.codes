# Design

## Theme

Fountain ink on a bright page. Light mode is pure white; dark mode is near-black with a whisper of blue. Warmth is carried by the apricot accent and the bookish serif, never by a tinted background. Color strategy: **Restrained** — ink neutrals + one warm accent at ≤10% of the surface.

## Color palette

Tokens live in `src/app/globals.css` (`:root` / `.dark`, exposed to Tailwind via `@theme inline` as `bg`, `surface`, `ink`, `muted`, `primary`, `accent`, `line`). OKLCH only.

| Role | Light | Dark | Use |
|---|---|---|---|
| bg | `oklch(1 0 0)` | `oklch(0.15 0.012 250)` | Page background |
| surface | `oklch(0.965 0.008 245)` | `oklch(0.2 0.015 250)` | Hover rows, code blocks, quotes |
| ink | `oklch(0.28 0.045 245)` | `oklch(0.9 0.015 245)` | Body text, headings (14.5:1) |
| muted | `oklch(0.5 0.035 245)` | `oklch(0.7 0.025 245)` | Secondary text (≥5.4:1 everywhere) |
| primary | `oklch(0.47 0.13 245)` | `oklch(0.72 0.1 245)` | Links, "view all" actions, focus rings |
| accent | `oklch(0.72 0.14 65)` | `oklch(0.76 0.13 65)` | Decoration only in light mode: squiggle, link underlines, hover arrows, wordmark period |

Never use `accent` for text in light mode (2.6:1). `::selection` is accent with dark-warm text.

## Typography

- **Display** (`font-display`): Young Serif 400 — headings, wordmark, article titles.
- **Body/UI** (`font-sans`): Hanken Grotesk — everything else. Body at 16px, `leading-[1.75]`; secondary at 14–15px.
- Loaded via `next/font/google` in `src/app/layout.tsx` as `--font-young-serif` / `--font-hanken`.
- `text-wrap: balance` on h1–h3 (global). Section headings are sentence-case serif — no uppercase tracked eyebrows anywhere.

## Organic details

One gesture per surface, hand-drawn SVG paths with `strokeLinecap="round"`:
- Home hero: accent squiggle under the name, draws in like a pen stroke (`.squiggle-draw`).
- Projects page: one wavy rule (`text-line`) dividing work history from side projects.
- Inline links: accent underline (`decoration-accent`, 1.5px, offset 3px) that darkens to primary on hover.

Do not repeat these as section grammar.

## Motion

Ease-out only (`cubic-bezier(0.22, 1, 0.36, 1)`). Home gets the one orchestrated entrance (`.anim-1`–`.anim-4` stagger + squiggle draw); every other page uses a single `.anim-page` fade. Theme icon uses `.theme-icon-turn` (rotate-in, no bounce). The `prefers-reduced-motion` block zeroes durations **and delays** — keep both when adding animations.

## Layout & components

- Single column, `max-w-2xl`, `px-6`, generous vertical rhythm (`py-14`–`py-16`).
- List rows (work, posts, side projects): full-row link, `-mx-3 px-3 rounded-lg hover:bg-surface`, metadata right-aligned in `text-muted tabular-nums`.
- Focus: `focus-visible:ring-2 focus-visible:ring-primary/60` everywhere.
- Header: sticky, `bg-bg/90 backdrop-blur-sm border-line`, serif wordmark `hritik` + accent period.
- Code blocks: Shiki dual-theme on `surface` with `line` border; highlighted lines get an accent tint background (no border-left stripes).
