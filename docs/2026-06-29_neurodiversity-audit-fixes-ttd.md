# cognitiveOS Website — Neurodiversity Fixes TTD

**Version:** 1.0
**Author:** 0xDas (plan by Eve)
**Based on:** [cognitiveos-neurodiversity-audit.md](file:///D:/Harry/00_THE-VAULT/01_INBOX/processed/cognitiveos-neurodiversity-audit.md) (2026-06-29, score 13/22 PASS)
**Status:** Not started
**Last Updated:** 2026-06-29

---

## How to Use This Document (read every session)

1. Open this file
2. Find the first unchecked task
3. Do ONLY that task
4. Verify the "done when", check it off, commit
5. Stuck >30 min → note blocker, skip to next unblocked task

**Rules:**
- Tasks ordered by audit priority (CRITICAL → IMPORTANT → NICE). No skipping unless blocked.
- One task = one sitting. Too big mid-way → split it, update this doc.
- ⛔ = hard gate. Do not pass without meeting the condition.
- Every task has a "done when" — if you can't verify it, it isn't done.
- Stack reminder: Next.js 16.2.9 + React 19.2 + Tailwind v4 (CSS-first, tokens in `globals.css @theme`). `inert` is a native React 19 attribute — no polyfill needed.

---

## SESSION 1 — CRITICAL (blocks usability)

- [ ] **T-001** · Add `inert` to off-screen sections in horizontal mode · `app/_components/scene/SceneStage.tsx` · 30 min
  Keyboard focus currently reaches links/buttons in off-screen sections (translated, not hidden). Wire the existing `active` state into the section render (line ~240-256). Content sections: `inert={i !== active ? true : undefined}`. Footer section (index = `STOPS.length`): `inert={active !== STOPS.length ? true : undefined}`. Do NOT add `inert` in the vertical fallback branch (line ~260+) — all sections are reachable there.
  done when: Tab through the page at 1440px — focus never lands on a control in an off-screen panel (verify with Playwright/keyboard or DevTools focus inspector); reduced-motion vertical mode still tabs through everything.

- [ ] **T-002** · Fix coral text contrast (3.4:1 → AA) · `app/globals.css` + `app/page.tsx:46` · 20 min
  `#ff6b5c` on `#fafaf7` fails AA for normal text. Add token in the `@theme` block (near line 18): `--color-coral-ink: #c2410c;`. Change `page.tsx:46` `text-coral` → `text-coral-ink`. Leave the decorative coral border/bg box at `page.tsx:53` as-is (non-text, passes).
  done when: "15 to 30 minutes" measures ≥ 4.5:1 against the page bg; lint + build clean.

- [ ] **T-003** · Add skip-to-content link · `app/layout.tsx` + `app/page.tsx:172` · 20 min
  No skip link — keyboard users can't bypass the nav. Add as the FIRST child of `<body>` in `layout.tsx`:
  ```tsx
  <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded-lg focus:bg-emerald focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#06281d]">
    Skip to main content
  </a>
  ```
  Add `id="main-content"` to the `<main>` in `page.tsx`. Confirm `sr-only` / `not-sr-only` exist in the Tailwind v4 build (they ship by default).
  done when: Load page, press Tab once — skip link appears focused; Enter moves focus into `<main>`.

⛔ **GATE:** All 3 CRITICAL fixes verified before moving to Session 2.

---

## SESSION 2 — IMPORTANT (causes friction)

- [ ] **T-004** · Dark mode via `prefers-color-scheme` · `app/globals.css` · 60 min
  Product targets neurodivergent devs (heavy dark-mode users); site is light-only. Add a `@media (prefers-color-scheme: dark)` block overriding the base tokens. Tailwind v4 note: `@theme` tokens are static at build — override the underlying CSS custom properties at `:root` inside the media query, not inside `@theme`. Start with:
  ```css
  @media (prefers-color-scheme: dark) {
    :root {
      --color-bg: #0f0f0f;
      --color-surface: #1a1a1f;
      --color-text: #e8e8e2;
      --color-text-muted: #9ca3af;
      --color-border: #2a2a2f;
    }
  }
  ```
  Audit every hard-coded hex used as text/bg in components (e.g. the `#06281d` CTA ink, terminal colors) and the per-section mood accents for AA contrast in dark. The terminal element is already dark — verify it still reads.
  done when: Toggle OS to dark — full page renders dark, all body/muted/link/CTA text ≥ 4.5:1, terminal still legible, mood accents still distinguishable; lint + build clean.

- [ ] **T-005** · Show timeline nav (dots) on mobile · `app/_components/village/TimelineNav.tsx:45` · 30 min
  `hidden md:block` removes the only position indicator on mobile — users can't tell which section / how many remain. Drop `hidden md:block` so the bar shows at all widths; hide the text labels below `md` so only dots render (label spans → `hidden md:inline`). Keep it `fixed bottom-0`, ensure it doesn't overlap content on small screens.
  done when: At 390px the dot strip is visible and the active dot tracks the current section; no horizontal overflow; labels reappear ≥ `md`.

- [ ] **T-006** · Add mobile nav menu · `app/_components/Nav.tsx` · 60 min
  Desktop nav links are `hidden lg:flex` (line ~51) with no mobile alternative. Add a hamburger button (`<button type="button">`, descriptive `aria-label`, `aria-expanded`) visible below `lg` that toggles a simple menu exposing Docs + GitHub + Get Started. All controls keyboard-reachable; Esc closes; focus returns to the toggle. Reuse existing link handlers/`scene:jump` dispatch.
  done when: At 390px the hamburger opens/closes via mouse AND keyboard, exposes all nav targets, `aria-expanded` flips, Esc closes; lint + build clean.

- [ ] **T-007** · Remove `uppercase` from eyebrow text · `app/_components/scene/SectionPanel.tsx:20` + `app/_components/scene/HeroPanel.tsx:28` · 15 min
  Small functional eyebrow text loses word-silhouette readability in ALL CAPS. Remove the `uppercase` class on both eyebrows; soften tracking (`tracking-[0.2em]` → `tracking-[0.15em]`). Leave Bebas Neue display headlines as-is (deliberate brand, all ≤ 5 words). The literal hero headline string stays uppercase by font design.
  done when: Eyebrows render in source-case (e.g. "Overview" not "OVERVIEW"); headlines unchanged; visual spot-check across sections.

---

## SESSION 3 — NICE-TO-HAVE (enhancement)

- [ ] **T-008** · Horizontal-scroll orientation cue · `app/_components/scene/HeroPanel.tsx` · 30 min
  The horizontal-pan paradigm is unconventional. Add a subtle one-time "Scroll to explore →" hint on section 01 only (horizontal mode). Gate behind `prefers-reduced-motion: no-preference` (vertical fallback doesn't need it); fade/hide after first scroll. `aria-hidden` (decorative).
  done when: Hint shows on first paint at desktop widths, disappears after scrolling, absent in reduced-motion + vertical fallback.

- [ ] **T-009** · Font customization toggle (OpenDyslexic + size) · new component · HIGH effort, scope first
  Strong signal for the target audience. Small accessibility popover in the nav: font-family (default / OpenDyslexic) + size (S/M/L), persisted to `localStorage`, applied via a `data-` attribute on `<html>` + CSS var swap. Self-host OpenDyslexic (no CDN). **Scope/estimate before building — split into sub-tasks (UI, persistence, font load, CSS wiring) if it exceeds one sitting.**
  done when: Toggle switches body font + size, persists across reload, no layout break, no CLS spike.

- [ ] **T-010** · Sans-serif option for docs body · `app/globals.css` (+ docs scope) · 30 min
  Space Mono body increases reading load for sustained text. Add a readable sans stack as a token and apply to docs MDX body copy (keep mono for the brand/terminal/code). Either a hard switch for `/docs` or fold into the T-009 toggle.
  done when: Docs paragraphs render in the sans stack; terminal/code/brand still mono; contrast + line-height (1.7) preserved.

---

## SESSION 4 — VERIFY ⛔

- [ ] **T-011** · Full regression + re-audit · all touched files · 45 min
  `npm run lint` clean, `npm run build` clean (all routes static). Playwright pass at 1440×900 AND 390×844: keyboard tab-order sane (no off-screen focus), skip link works, coral text passes contrast, dark mode renders (toggle OS), mobile timeline + hamburger usable, 0 horizontal overflow, no console errors. Re-run the 4 FAIL + 4 PARTIAL audit items and confirm each now PASS (or consciously deferred).
  ⛔ done when: lint + build clean AND the 3 CRITICAL items + chosen IMPORTANT items verified PASS; record results in this repo's `docs/` (append a "Verification" section here).

---

## Task Summary

| Session | Tasks | Priority | Gate |
|---------|-------|----------|------|
| 1 | T-001 → T-003 | 🔴 CRITICAL | ⛔ all 3 verified |
| 2 | T-004 → T-007 | 🟡 IMPORTANT | — |
| 3 | T-008 → T-010 | 🟢 NICE | — |
| 4 | T-011 | Verify | ⛔ lint+build+re-audit |

**Total: 11 tasks. Most under 45 min. T-009 is the only HIGH-effort item (scope before starting).**

### Decisions still open for Harry
- **Dark mode (T-004):** `prefers-color-scheme` only (Phase 1) vs. also a manual toggle (Phase 2)? Plan assumes auto-only first.
- **Font toggle (T-009/T-010):** build the OpenDyslexic toggle, or skip and rely on browser zoom? It's HIGH effort.
- **ALL-CAPS headlines:** keeping Bebas display caps as a brand choice (audit accepts this for ≤5-word headlines). Confirm.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-29 | Initial TTD from neurodiversity audit (4 FAIL + 4 PARTIAL → 11 tasks across 4 sessions). |

---

*Find the first unchecked box. Do only that. Check it off.*
