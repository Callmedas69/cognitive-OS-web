# DESIGN.md — cognitiveOS website

Design system lives in `app/globals.css` (Tailwind v4, CSS-first `@theme`). No JS config.

## Type
- **Display:** Bebas Neue (`--font-bebas` → `--font-display`). Tall condensed caps; headings only.
- **Body / code / UI:** Space Mono (`--font-space-mono` → `--font-mono`). Brand-locked (0xDas
  identity + literal CLI product; not a reflex pick).
- Scale tokens: `--text-h1` clamp(56,9vw,128) [hero overrides to clamp(40,6vw,84)], `--text-h2`
  clamp(36,5.5vw,72), `--text-numeral` clamp(56,10vw,120).

## Color (light-only by design)
- Base: `--color-bg` #fafaf7, `--color-surface` #fff, `--color-text` #1a1a1a, `--color-text-muted`
  #6b6b6b, `--color-border` #e8e8e2.
- Brand accents: emerald `--color-emerald` #10b981, coral `--color-coral` #ff6b5c.
- Zone colors (canonical): capture #ff6b35, queue #ffb800, focus #ff3366, projects #10b981,
  ideas #7b61ff, someday #6b7280.
- Village palette tokens: `--color-sky-1..4`, `--color-sun`, `--color-mtn-far`, `--color-hill`,
  `--color-grass`, `--color-path`; sprite palette `--color-wall/-dk/wood/glass/leaf/-dk/trunk/
  stone/blossom/screen`.
- **Mood system:** `--mood` (vivid fill) + `--mood-ink` (AA-safe text) drive `bg-mood` /
  `text-mood` / `text-mood-ink`. Scrubbed continuously by section progress in `scene/SceneStage`
  (GSAP). The per-section accent hex set lives in `content/stops.ts` (kept as literals because GSAP
  interpolates hex, not CSS vars).

## Section deck model (horizontal full-viewport)
The landing is a horizontal scroll of full-viewport sections (no village scene). `scene/SceneStage`
pins the stage and pans a flex row of `100vw × 100dvh` sections sideways (GSAP ScrollTrigger pin +
scrub + snap-per-section). Seven content sections plus the footer ride the same track, so the footer
scrolls in horizontally as the final panel. Each section is rendered by `scene/SectionPanel` (number
eyebrow, kicker, Bebas headline tinted in its accent, accent rule, body). As a section settles, the
global `--mood` / `--mood-ink` morph toward its accent.

This supersedes the single-plate cinematic village (`docs/2026-06-27_single-plate-scene.md`), which
was removed. See `docs/2026-06-28_horizontal-sections.md`.

## Motion
- GSAP ScrollTrigger: horizontal pin + x-translate (whole section row) + snap-per-section
  (`scene/SceneStage`); mood scrub across the seven content sections.
- Signature: blinking terminal cursor (`.cursor`).
- `prefers-reduced-motion` / narrow (<900px): no pin/pan — sections stack vertically, each one
  screen tall; mood + active set discretely by IntersectionObserver. Cursor off. Timeline hidden.

## Key components
- `scene/SceneStage` (horizontal pin + pan engine + reduced-motion/narrow vertical fallback),
  `scene/SectionPanel` (full-viewport section: eyebrow, headline, accent rule, body),
  `village/TimelineNav` (controlled, 44px targets, fixed bottom).
- Content source of truth: `content/stops.ts` (7 sections: id, num, name, accent, bubble, headline
  + ZONES). No `xPct` (no plate to anchor to).
- Reused: `Terminal`, `Nav` (home links dispatch `scene:jump`). `ZoneTree`/`AgentGrid`/`StatBlock`/
  `Callout`/`Mascot` remain for `/docs` and are not on the landing.

## Hero (section 01)
Horizontal split (`scene/HeroPanel.tsx`): editorial text column left (eyebrow, kicker, headline,
accent rule, body, terminal, CTAs), 0xNull mascot right (`Mascot` → flat `/0xnull.svg`, lazy-enhanced
to the Three.js voxel GLB on capable desktop; orb glows the scroll mood). Headline accents the selling
word FILESYSTEM in mood ink. Mobile / reduced-motion: mascot stacks above text, SVG only. The hero
copy leads with "executive dysfunction" (ADHD kept once in the body + meta keywords).

## Bans honored
No dark mode, no audio/music, no side-stripe borders. (The earlier "no 3D/three on the landing" ban is
lifted for the 0xNull hero mascot, by Harry's request; three.js stays lazy-loaded + SVG-fallbacked.)
