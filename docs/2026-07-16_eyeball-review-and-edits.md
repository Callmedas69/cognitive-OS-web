# Eyeball Review + Edits — 2026-07-16

Source: `vault/04_PROJECTS/01_development/cognitiveos-website/finding/eyeball.md` (4 edits + 3 questions).
Method: message-fidelity review grounded in the thesis + shipped `cognitiveos@0.10.6` source + live render, cross-checked by an independent opus reasoner (Codex attempted, failed on network reconnect). Both passes converged.

## Review answers

- **Q2 (message / value prop):** Delivered, better-argued than most dev-tool landings. Strong on WHAT + WHO. "Never lose context between sessions" lands. Panel 03 already patched the prior drift-audit differentiation gap.
- **Q3 (stay-on-path + maintain workspace):** Nailed the **memory** half; the **self-maintenance** half was asserted, never shown. `check --fix`, the staleness-honesty detector, the anti-hyperfocus forced-stop, and the keeper were absent or buried. Biggest gap = the differentiator ("maintains itself") had no proof on the landing.
- **Q1 (village timeline):** Keep it. It delivers orientation + jump-nav (ADHD-positive wayfinding on an 8-panel horizontal deck), not message. Real defects: arbitrary landmark icons (only 2 of 8 semantically map) and labels `hidden lg:block` (below `lg` = 8 mystery icons, no text). Fix legibility, not engagement.

## Decisions

1. Cursor/Codex are agents, not commands: added a "works with" agent row to panel 06, NOT entries in the command list. Preserved the hook asymmetry (hooks = Claude Code + Antigravity; skill files + keeper = all four).
2. Differentiator surfaced as **0xnull the Keeper's workscope** (Harry's reframe), not an abstract self-maintain claim. The mascot already floating the deck IS 0xnull but was unnamed; the Keeper story lived only in `/docs/keeper`.
3. Timeline: fixed legibility now (active label visible at all breakpoints + stronger active state); deferred the arbitrary-icon rethink.

## Shipped (lint + build green, not yet committed)

| # | Edit | File |
|---|------|------|
| 1 | One scroll-animated accent keyword per panel (01/04/05/07), reusing the existing `--local-ink`/`text-mood-ink` scrub, no new code | `app/page.tsx` |
| 2 | `FOOTER_REVEAL_DELAY = 0.6` added to the footer-tagline reveal position so it plays later | `app/_components/scene/SceneStage.tsx` |
| 3 | Panel-06 "works with" agent row (Claude Code, Codex, Cursor, Antigravity) with honest hook asymmetry | `app/page.tsx` |
| 4 | 0xnull the Keeper surfaced: mascot caption `0xnull · the keeper` + one keeper line on panel 03 | `SceneStage.tsx`, `app/page.tsx` |
| 5 | Removed Farcaster footer link + `FARCASTER_URL` const | `app/page.tsx` |
| 6 | Timeline active stop label visible + bold at all breakpoints | `app/_components/village/TimelineNav.tsx` |

## Deferred (logged)
- Rethink the arbitrary village landmark icons (number+label or meaningful icons).
- Fuller differentiator beats (staleness-honesty / forced-stop as their own panels) beyond the 0xnull surfacing.
- Motion budget: PRODUCT.md promises "no overstimulation" yet the deck stacks mascot-walk + mood-morph + pan + word-scatter. Worth a calm-pass audit.
