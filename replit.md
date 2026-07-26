# Avalanche — avalanchemusic.com

A luxury digital vinyl record website for the album "Avalanche" by Sumair (Cypher Ghost). Single-page music experience with a full-featured interactive audio player.

## Run & Operate

- `pnpm --filter @workspace/avalanche run dev` — run the frontend (port 25862)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (artifacts/avalanche)
- Styling: Tailwind CSS v4, Playfair Display + Inter (Google Fonts)
- Icons: Lucide React
- Contact form: @formspree/react (endpoint: mjgnpadd)
- Audio: native HTML5 `<audio>` element via useRef

## Where things live

- `artifacts/avalanche/src/App.tsx` — main single-page app with all state, player logic, and all sections
- `artifacts/avalanche/src/index.css` — full Old Money theme (charcoal #0d0d0d, cream #F8F4E9, gold #c9a84c)
- `attached_assets/` — all 14 MP3 track files + generated cover.jpg album art
- `artifacts/avalanche/index.html` — OG/Twitter meta tags for link previews

## Product

**Sections:**
1. **Hero** — Full-viewport "Avalanche" serif headline with scroll-down cue
2. **I. The Record** — Tracklist of 14 tracks with play/pause, download per-track, and "Download All"
3. **II. The Curator** — Artist bio centered column
4. **III. Leave a Mark** — Formspree contact form
5. **Footer** — "Stay Cool ❄️" sign-off, © 2026

**Interactive Player:**
- Mini sticky bar slides up when a track plays; entire bar is clickable to open expanded view
- Full-screen expanded player with blurred album art background, spinning vinyl animation, draggable progress bar, skip/shuffle controls, volume slider, and "Up Next" list
- Auto-advances to next track on end; shuffle support

## User preferences

- Design: Old Money & Professional — charcoal, cream, antique gold, Playfair Display serif headings, no drop-shadows, 1px borders, massive negative space
- No emojis anywhere in UI except footer and Formspree success message

## Gotchas

- Audio files in attached_assets/ have long timestamp-suffixed filenames — do not rename them, they are imported via `@assets/` Vite alias
- Google Fonts `@import url(...)` must be the very first line in index.css — PostCSS fails silently if placed after other imports
- Formspree form ID: mjgnpadd (endpoint: https://formspree.io/f/mjgnpadd)
- OG image URL is hardcoded to https://avalanchemusic--sumair.replit.app/attached_assets/cover.jpg in index.html

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
