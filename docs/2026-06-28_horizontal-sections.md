# 2026-06-28 — Horizontal full-viewport section rebuild

## What changed
Removed the single-plate cinematic village (rejected) and rebuilt the landing as a horizontal
scroll of full-viewport sections.

- **Removed:** `scene/Plate.tsx`, `scene/StopPanel.tsx`, the `village-wide.webp` plate render,
  `xPct` landmark anchoring, the `.scene-panel` / `.scene-stop` / `.cloud` / `.pixel` CSS, and the
  cloud drift keyframes. The `village-wide.webp` asset and `public/game/art/*` sprites are left on
  disk (no longer imported).
- **Added:** `scene/SectionPanel.tsx` (full-viewport section: number eyebrow, kicker, Bebas headline
  tinted in the section accent, accent rule, body).
- **Rewrote:** `scene/SceneStage.tsx` into a horizontal section deck. It pins the stage and pans a
  flex row of `100vw × 100dvh` sections sideways via GSAP ScrollTrigger (pin + scrub + snap). Seven
  content sections plus the footer ride the same track, so the footer scrolls in horizontally as the
  final panel. Pan distance = `track.scrollWidth - innerWidth`; scroll length = `(PANELS-1) *
  innerWidth`; snap = `1/(PANELS-1)`. Mood lerps across the seven content sections; the footer holds
  the last section's mood.
- **Content:** `content/stops.ts` dropped the village metaphor (Thinking Grove etc.) for direct
  product labels (Overview, The Problem, How It Works, Six Zones, Commands, Open Source, Start) and
  removed `xPct`. Copy tightened so a cold visitor understands: what cognitiveOS is, the problem, how
  it works (ICM), the six zones, the four commands, that it is free/open source, and how to start.
- **Nav:** `HOME_LINKS` remapped to the new section indices (still dispatches `scene:jump`).
- **Footer:** moved out of `page.tsx` as a separate vertical block; it is now the final horizontal
  panel passed into `SceneStage`.

## Mobile / reduced-motion fallback
`<900px` or `prefers-reduced-motion`: sections stack vertically (each one screen tall), mood + active
driven by IntersectionObserver. Timeline is hidden on mobile (`hidden md:block`), unchanged.

## Verification (passed)
- `npm run lint` clean (1 pre-existing warning in `scripts/process-art.mjs`).
- `npm run build` clean, all 12 routes static.
- Playwright QA at 1440×900: nav stays fixed top (top=0) and timeline fixed bottom (bottom=0) across
  the whole scroll; sections pan horizontally and snap; mood morphs per section (headline + timeline
  dot + top progress bar); footer reached as the final panel; 0 horizontal page overflow; no console
  errors.
- Mobile 390×844: vertical stack, 0 horizontal overflow.

## 2026-06-28 (cont.) — Hero enhancement: split + 0xNull mascot + copy

- **`scene/HeroPanel.tsx`** (new): section 01 is now a full-viewport horizontal split. Left = eyebrow
  + kicker + headline + accent rule + body + terminal + CTAs. Right = `Mascot` (`size="hero"`,
  `parallax`). Mobile/reduced-motion stacks (mascot above text via order classes).
- **Mascot reused** (`Mascot.tsx` + `mascot/scene.ts` + `/models/0xnull.glb` + `/0xnull.svg`): flat
  SVG first, lazy-enhances to the Three.js voxel GLB on capable desktop; orb emissive follows
  `--mood`. Verified: canvas enhances (svg opacity 0 / canvas opacity 1) on desktop, SVG only on
  mobile. The "no three.js on landing" ban in DESIGN.md is lifted for this.
- **Copy (via /copywriting):** headline now `A FILESYSTEM THAT REMEMBERS FOR YOU` with FILESYSTEM
  tinted (mood ink) as the selling word (dropped "YOUR SECOND BRAIN"). Kicker leads with "executive
  dysfunction"; one ADHD mention kept in the body. Changed in `content/stops.ts` (stop-01) +
  `page.tsx` (hero body + `heroHeadline` ReactNode passed to SceneStage) + DESIGN.md.
- Verified: lint + build clean; Playwright desktop split + mobile stack read clean; 0 horizontal
  overflow; console warnings benign (THREE.Clock deprecation, WebGL ReadPixels from screenshotting).

## 2026-06-28 (cont.) — Nav-fixed: pin pre-scroll + footer release-jump fix

- Symptom 1: horizontal pan only began after scrolling past the nav (section slid up first).
- Symptom 2: reaching the footer, content jumped up ~57px (the nav-height offset released at pin end).
- Cause: the nav sat in normal flow (`sticky`) above the pinned stage; an interim
  `start: "top top+=navH"` offset fixed the pre-scroll but introduced the release-jump.
- Fix: `Nav.tsx` is now `fixed inset-x-0` on the home page only (`isHome`; stays `sticky` on /docs).
  The stage sits at y=0, so `SceneStage` pins with `start: "top top"` — engages at scroll 0 (no
  pre-scroll) and releases cleanly at the end (no jump). Removed `border-l border-border` from the
  footer panel (stray light line). Verified: hero pins at scroll 0, footer headline top constant
  across the end of scroll, mobile 0 overflow, build clean.

## 2026-06-28 (cont.) — Nav + timeline now match the section

- Symptom: clicking a timeline dot / nav link landed one section off (dot 02 → stop-03, etc.); during
  scroll the active dot + mood led the visible section.
- Cause 1: `jumpRef` used `window.scrollTo({behavior:"smooth"})`; native smooth-scroll momentum made
  ScrollTrigger snap overshoot a panel. Cause 2: `scrub: 1` lagged the section behind the
  scroll-progress-driven highlight.
- Fix (`SceneStage.tsx` only): `scrub: 1` → `scrub: true` (section locked to scroll, highlight + mood
  match frame-for-frame); register `gsap/ScrollToPlugin` and jump via
  `gsap.to(window, { duration: 0.6, ease: "power2.inOut", scrollTo: target })` (ends on the exact snap
  point, zero velocity, no overshoot).
- Verified (Playwright): dots 01..07 land on stop-01..stop-07 exactly (scrollY 0/1440/.../8640); nav
  links land on their sections; mid-scroll center always equals the active dot. Build clean after a
  `.next` wipe (the dir had been corrupted by overlapping dev servers, unrelated to the code).

## 2026-06-28 (cont.) — Polish: morph window, 02 copy, timeline crossfade

- **Mood morph — snap removed** (`SceneStage.tsx`): the morph was invisible because `snap` rushed the
  scroll past the intermediate colors (you only ever saw each section's final color). Fix: removed the
  `snap` config entirely (free scroll) and kept the continuous scroll-driven morph in `apply()` (hold
  current accent for first 25% of the transition, then smoothstep to the next). Now the color morphs
  the whole way as you scroll. Playwright fine-sweep confirms a smooth gradient
  emerald→orange→cyan→purple→pink→emerald across the scroll. The earlier time-based `bloomTo` approach
  was dropped. Tradeoff: sections no longer lock to the viewport (free scroll), per Harry's request.
- **Headline + rule now morph too** (`SectionPanel.tsx`, `HeroPanel.tsx`): they were hardcoded to
  static per-section colors (`style={{color: meta.accentInk}}` / `background: meta.accent`), so the
  big text never morphed (only timeline/moodbar/hero-FILESYSTEM did). Switched to `text-mood-ink` /
  `bg-mood` so the headline + accent rule follow the morphing var. Verified the `#stop-03` headline
  color equals `--mood-ink` across scroll.
- **Section 02 copy** (`page.tsx`): body `15 to 45 minutes` → `15 to 30 minutes` (title stays
  `THE 30-MINUTE TAX`), removing the title/body contradiction.
- **Timeline crossfade** (`TimelineNav.tsx`): added `transition-all duration-300 ease-out` to the
  numbered circle so the active state (filled `bg-mood` + border + text) crossfades between dots; the
  progress line already slides via its width transition. Digits stay static.

## 2026-06-28 (cont.) — Per-section black->accent reveal (replaces global morph)

- The global `--mood` morph made all visible headlines share one color. Switched to a per-section
  reveal: each headline + rule starts black and morphs to its OWN accent.
- `SceneStage.tsx` `apply()`: per-section `reveal(k,seg) = clamp((seg-(k-0.75))/0.75, 0, 1)` (0 until
  25% visible, 1 at center, saturates forward, reverses on scroll-back; hero k=0 always 1). Sets
  `--reveal` on each `section[id^=stop-]`; chrome `--mood`/`--mood-ink = lerp(#0a0a0a, activeAccent,
  reveal_active)` so timeline/progress/orb also bloom black->accent and reverse.
- `SectionPanel.tsx`: headline + rule use `color-mix(in srgb, #0a0a0a (1-reveal), <accent> reveal)`
  inline (each section its own accent). `globals.css`: registered `@property --reveal <number>`.
- Mobile IO branch: sets `--reveal` 1 for sections at/above the active index, 0 otherwise, with a
  `[transition:--reveal_500ms]` ease.
- Verified (Playwright): at stop-03 centered, stop-02=orange / stop-03=cyan / stop-04=black
  simultaneously; forward keeps colored, scroll-back reverses stop-04 then stop-03 to black.

## 2026-06-28 (cont.) — GSAP ScrollSmoother

- Added smooth momentum scroll over the whole deck (eases the horizontal pan + per-section reveal).
- New `app/_components/SmoothScroll.tsx`: lazy-imports `gsap/ScrollSmoother`, wraps `{children}` in
  `#smooth-wrapper > #smooth-content`, `ScrollSmoother.create({ smooth: 1.4, smoothTouch: 0 })`.
  Disabled under `prefers-reduced-motion`.
- `layout.tsx`: `MoodBar` + `Nav` stay OUTSIDE the wrapper (fixed must not be inside the transformed
  content). `TimelineNav` portals itself to `<body>` (it is `fixed`); SSR-safe mount gate via
  `useSyncExternalStore` (no setState-in-effect, no hydration mismatch).
- Jumps keep `gsap.to(window, { scrollTo })` — ScrollSmoother drives native scroll, so it eases.
- Verified: content transform lags scroll then settles (smoothing), pin/pan + reveal intact, dots
  land correct, nav+timeline fixed, mobile native scroll + 0 overflow, no hydration/console errors,
  lint + build clean. (GSAP is fully free post-Webflow; ScrollSmoother ships in the public `gsap` pkg.)

## Open / follow-ups
- Vertical rhythm of section content sits slightly below true center; could nudge to optical center.
- `village-wide.webp` + `public/game/art/*` + village palette tokens in `globals.css` are now dead;
  remove in a cleanup pass once confirmed nothing else references them.
- Supersedes `docs/2026-06-27_single-plate-scene.md` (single-plate model, removed).
