# cognitiveOS Website — Anti-Slop Redesign (AWWWARDS elevation)

Date: 2026-06-25
Skill: `design-taste-frontend` (taste-skill audit) · Dials: DESIGN_VARIANCE 8 / MOTION_INTENSITY 6 / VISUAL_DENSITY 3
Lead device: **big editorial typography** (Harry's call). Mode: Redesign-Preserve.

## Verdict that triggered the work
Site was clean and slop-free but **safe (B+)**, not award-tier. Slop-absence is the floor.
7 gaps fixed: centered-stack hero, layout monotony, full-measure mono body, near-zero
visual richness, flat 4-cell agent grid, 3-equal principle cards, motion underused.

## Preserved (brand signatures, untouched logic)
- Mood-morph scroll color spine (`MoodController.tsx`, GSAP scrub, `@property --mood`). Verified
  still scrubbing emerald→red→cyan→violet→emerald→amber after section recomposition.
- 0xNull voxel mascot (Three.js + 2D SVG fallback).
- Terminal identity, honest copy, IA, reduced-motion + no-JS safety.

## What shipped (lever order: type → layout → richness → motion)
- **Typography** (`globals.css`): `--text-display`, raised `--text-h1/h2`, `--text-numeral`.
  Body mono capped to ~44–56ch + relaxed leading (kills full-width mono).
- **Hero** (`HeroSplit.tsx`): asymmetric editorial split, 2-line oversized headline, mascot on
  large anchored stage with scroll-parallax, terminal + both CTAs above fold, magnetic primary
  CTA (ref + transform, reduced-motion gated). `min-h-[100dvh]`, `padY={false}`.
- **Problem** (`StatBlock.tsx`): giant `15–45 minutes` display numeral, editorial family.
- **Filesystem**: split layout, ZoneTree promoted to framed colored centerpiece.
- **Principles** (`PrincipleRow.tsx`): numbered editorial rows (01/02/03), killed 3-equal cards.
- **Agents** (`AgentGrid.tsx`): varied bento, Claude Code emphasis tile, per-agent tinted
  monogram marks (no off-brand stock logos).
- **Quickstart**: numbered display-numeral steps + terminal stack.

## Infra changes
- `Section.tsx`: added `width` (default/wide/full) + `padY` props; still emits `data-mood`
  so MoodController triggers map onto the new roots.
- `Mascot.tsx`: `size` (default/hero) + `parallax` props.
- Deleted dead `PrincipleCard.tsx`.

## Verification (all pass)
- `npm run lint` clean · `npm run build` clean (compiled + TypeScript + 12 static routes).
- Hero fits 1440×900 fold, both CTAs above fold.
- Mood-morph scrubs across recomposed sections (critical regression check).
- Mobile 390×844: single-column collapse, horizontal overflow = 0.
- Body measure ≤ ~56ch everywhere.
- New motion (hero parallax, magnetic CTA) gated by `prefers-reduced-motion`.

## Out of scope / open
- Display font kept as Bebas (lower risk, brand continuity); grotesk swap not done.
- Optional single pinned filesystem scroll-walk: not implemented (kept motion budget tight).
- Lighthouse LCP/CLS not measured this session.
