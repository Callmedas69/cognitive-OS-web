# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Critical: Next.js 16 version drift

This project runs **Next.js 16.2.9** and **React 19.2**, which have breaking changes vs. older training data. Before writing any Next.js/React code, read the relevant guide under `node_modules/next/dist/docs/` (App Router docs live in `01-app/`). Heed deprecation notices. Do not assume APIs, conventions, or file structure from memory.

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run start    # serve production build (run build first)
npm run lint     # eslint (flat config)
```

No test framework is configured yet. If adding tests, pick the runner and document the invocation here.

## Architecture

Next.js **App Router** project. Currently a near-stock `create-next-app` scaffold — most structure is still to be built.

- `app/` — routes, layouts, pages. `app/layout.tsx` is the root layout (sets fonts + html/body shell); `app/page.tsx` is `/`. Components are React Server Components by default; add `"use client"` only when client interactivity is needed.
- `app/globals.css` — global styles **and** Tailwind theme config.
- Path alias: `@/*` maps to repo root (e.g. `import X from "@/app/..."`).

### Styling — Tailwind v4 (CSS-first, no JS config)

There is **no `tailwind.config.js`**. Tailwind v4 is configured entirely in CSS:
- `globals.css` starts with `@import "tailwindcss";`.
- Theme tokens (colors, fonts) are declared in the `@theme inline { ... }` block in `globals.css`, wired to CSS custom properties. Add/adjust design tokens there, not in a JS config.
- Dark mode currently uses `@media (prefers-color-scheme: dark)` via CSS variables.
- PostCSS uses `@tailwindcss/postcss` (`postcss.config.mjs`).

### Fonts

Geist Sans / Geist Mono loaded via `next/font/google` in `app/layout.tsx`, exposed as `--font-geist-sans` / `--font-geist-mono` and mapped to Tailwind `--font-sans` / `--font-mono` in `globals.css`.

### TypeScript / ESLint

- `tsconfig.json`: strict mode on, `moduleResolution: "bundler"`.
- ESLint uses flat config (`eslint.config.mjs`) extending `eslint-config-next` core-web-vitals + typescript.
