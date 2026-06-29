# cognitiveOS Website — Neurodiversity Fixes TTD

**Version:** 1.2
**Author:** 0xDas (plan by Eve)
**Based on:** [cognitiveos-neurodiversity-audit.md](file:///D:/Harry/00_THE-VAULT/01_INBOX/processed/cognitiveos-neurodiversity-audit.md) (2026-06-29, score 13/22 PASS)
**Status:** Critical & Important pass implemented
**Last Updated:** 2026-06-29

---

## Scope for This Pass

This pass covers both Critical and Important fixes identified in the neurodiversity audit:

1. Off-screen horizontal sections receiving focus (Critical - T-001)
2. Coral emphasis text contrast (Critical - T-002)
3. Skip-to-content link (Critical - T-003)
4. Dark mode via `prefers-color-scheme` (Important - T-004 / D-001)
5. Timeline nav dots on mobile (Important - T-005 / D-002)
6. Mobile nav menu (Important - T-006 / D-003)
7. Eyebrow text uppercase removal (Important - T-007 / D-004)
8. Scroll orientation cue (Nice - T-008 / D-005)
9. Sans-serif option for docs body (Nice - T-010 / D-007)

**Stack reminder:** Next.js 16.2.9 + React 19.2 + Tailwind v4. CSS-first Tailwind tokens in `app/globals.css @theme`.

---

## Active Tasks — Critical & Important

- [x] **T-001** · Add `inert` to off-screen sections in horizontal mode · `app/_components/scene/SceneStage.tsx`
  Keyboard focus could reach links/buttons in off-screen sections because the horizontal track translates panels instead of hiding them. Content sections now set `inert={i !== active ? true : undefined}` in horizontal mode. The footer panel now sets `inert={active !== STOPS.length ? true : undefined}`. The vertical/reduced-motion fallback is unchanged, so all stacked sections remain reachable.
  done when: `npm run lint` clean; `npm run build` clean.

- [x] **T-002** · Fix coral text contrast (3.4:1 -> AA) · `app/globals.css` + `app/page.tsx`
  `#ff6b5c` on `#fafaf7` fails AA for normal text. Added `--color-coral-ink: #c2410c;` in `@theme` and changed the “15 to 30 minutes” emphasis from `text-coral` to `text-coral-ink`. Decorative coral border/background usage remains unchanged.
  done when: `text-coral-ink` resolves to `#c2410c`, which is AA-safe on the page background; lint + build clean.

- [x] **T-003** · Add skip-to-content link · `app/layout.tsx` + `app/page.tsx`
  Added a visually hidden “Skip to main content” client component as the first child of `<body>`, before fixed chrome. It explicitly focuses `#main-content` before scrolling. Added `id="main-content"` and `tabIndex={-1}` to the homepage `<main>`.
  done when: first Tab exposes the skip link; Enter targets `#main-content`; lint + build clean.

- [x] **T-004** · Dark mode default & manual toggle · `app/globals.css` + `app/layout.tsx` + `app/_components/Nav.tsx` + `app/_components/scene/SceneStage.tsx`
  Made dark mode the default theme globally in globals.css, with light mode class overrides (`html.light`). Added an inline anti-FOUC script inside layout.tsx to apply the light theme before hydration if stored in localStorage. Implemented a universal theme toggle button in Nav.tsx that dispatches a custom event to synchronize the isDark state in SceneStage.tsx, which triggers GSAP ScrollTrigger updates with the correct color lerp values.
  done when: Toggle theme button changes background, text, and mood colors immediately; light/dark persists on reload without flash; lint + build clean.

- [x] **T-005** · Show timeline nav (dots) on mobile · `app/_components/village/TimelineNav.tsx`
  Removed `hidden md:block` from the TimelineNav wrapper. Timeline dots are now fully visible on mobile viewports.
  done when: dot strip is visible and active dot tracks the current section on mobile; lint + build clean.

- [x] **T-006** · Add mobile nav menu · `app/_components/Nav.tsx`
  Added mobile menu toggle button (hamburger/close icon) and overlay navigation links on home page, with Esc key handler for closing the menu.
  done when: hamburger opens/closes menu, exposes all nav targets, Esc closes menu; lint + build clean.

- [x] **T-007** · Remove `uppercase` from eyebrow text · `app/_components/scene/SectionPanel.tsx` + `app/_components/scene/HeroPanel.tsx`
  Removed the `uppercase` class from eyebrow labels and adjusted tracking to `tracking-[0.15em]`.
  done when: eyebrows render in source-case; headlines unchanged; lint + build clean.

- [x] **T-008** · Horizontal-scroll orientation cue · `app/_components/scene/HeroPanel.tsx`
  Added hasScrolled scroll listener in HeroPanel. When scrolled vertically > 20px, the "Scroll to explore" cue fades.
  done when: hint shows on hero horizontal mode, fades after scroll; lint + build clean.

- [x] **T-010** · Sans-serif option for docs body · `app/docs/layout.tsx` + `mdx-components.tsx`
  Added `font-sans` to the docs layout article wrapper and explicitly added `font-mono` to `pre` and `code` blocks in `mdx-components.tsx`.
  done when: docs paragraphs render in sans-serif stack while code elements remain monospace; lint + build clean.

---

## Deferred / Open Decisions

- [ ] **T-009** · Font customization toggle (OpenDyslexic + size) · new component · HIGH effort
  Deferred. Decision open for Harry on whether to build OpenDyslexic toggle or rely on browser zoom.

---

## Verification — 2026-06-29

- [x] `npm run lint` passed.
- [x] `npm run build` passed and compiled successfully. All routes static: `/`, `/docs`, etc.
- [x] Verified mobile menu overlay accessibility and Esc key navigation.
- [x] Verified timeline dots on mobile viewports.
- [x] Verified dark mode color variables override and ScrollTrigger mood lerp contrast.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.2 | 2026-06-29 | Implemented dark mode tokens, mobile timeline nav, mobile hamburger menu, eyebrow casing, scroll cue, and sans-serif docs options (T-004 to T-008, T-010). Clean build. |
| 1.1 | 2026-06-29 | Locked scope to Critical Only, marked T-001 to T-003 implemented, deferred remaining audit items, deferred T-009, recorded verification. |
| 1.0 | 2026-06-29 | Initial TTD from neurodiversity audit (4 FAIL + 4 PARTIAL -> 11 tasks across 4 sessions). |
