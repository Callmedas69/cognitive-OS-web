# Single-plate cinematic village rebuild — 2026-06-27

## What changed

The landing was rebuilt from **seven independent PNG sprites composited on a parallax `World`
backdrop** (the "collage", rejected as awful) to **ONE cohesive pre-composed plate**
(`/assets/scene/village.png`, 2752×1536, delivered by Harry) panned by a cinematic camera.

## How it works

- `scene/SceneStage` (client) pins the scene and runs a GSAP ScrollTrigger scrub that translateX-es
  a track across the plate. Active stop / mood / timeline are driven by **even-spaced** scroll
  progress (a 16:9 plate is not wide enough to bring edge landmarks to true centre, so a
  centre-based mapping collapsed — stops 06/07 never activated).
- `scene/Plate` renders the plate (taller than the viewport so it overflows horizontally → pan room;
  smooth-scaled, no `image-rendering: pixelated`).
- `scene/StopPanel` is a floating speech bubble glued to each landmark via `xPct` in
  `content/stops.ts`. Only the active stop's panel is shown (`.scene-stop` cross-fade); the rest are
  hidden so the scene never clutters. Stop 01 (Home) is told by the hero copy, so it has no panel.
- `content/stops.ts` is the single source of truth: 7 stops (id, num, name, xPct, accent, bubble,
  headline) + canonical `ZONES`. Copy is verbatim from `06_*content.md` (cognitiveos@0.3.0).
- Top `Nav` home links dispatch a `scene:jump` CustomEvent; `SceneStage` routes it through the same
  jump as the bottom `TimelineNav` (a native #anchor can't reach a panel inside the pinned,
  translated track).
- Fallback (`prefers-reduced-motion` or < 900px): no pin/pan — plate sits responsively on top, the
  seven panels stack vertically, mood set discretely by IntersectionObserver.

## Retired

`village/World`, `Landmark`, `LandmarkArt`, `Stop`, `SpeechBubble`, `HorizontalVillage` (deleted).
The old per-landmark sprites in `public/game/art/*` are unused (baked into the plate).
`ZoneTree`/`AgentGrid`/`StatBlock`/`Callout`/`Mascot` are kept for `/docs`, off the landing.

## Supersedes

`ARCHITECTURE.md` and the asset spec say *"never combine the world into one image / keep every
asset independent."* The delivered single plate + the rejected collage supersede that for the
landing scene. Those docs carry a 2026-06-27 override note pointing here.

## Verification

- `npm run lint` clean (1 pre-existing script warning), `npm run build` + tsc clean, 12 static pages.
- Headless-Chrome (motion forced on) screenshots at all 7 even-spaced scroll stops: camera pans
  L→R, exactly one panel shown per stop over its landmark, mood morphs (emerald → orange → cyan →
  purple → emerald → pink → emerald), timeline 01→07 tracks, last panel left-biased so it does not
  clip the right edge. Mobile 390px shows the vertical fallback (plate + stacked panels + hero).

## 2026-06-27 update — wide panorama + "1 card = 1 screen" pacing

- Plate swapped to a **wide panorama** `public/assets/scene/village-wide.webp` (from
  `docs/village_ultra-wide.png`, 3904×1088, 3.588:1; WebP ~400 KB). `Plate` fits it by height
  (`h-[100dvh]`, no crop hack); full sky + lake + underwater band show.
- **Pacing decoupled from image width:** `SceneStage` pin `end` is now
  `(STOPS.length - 1) × innerHeight` (≈ 6 screens), so **each card dwells one full screen of
  scroll**. The camera still pans the whole plate (`x: -distance`), just stretched across more
  scroll. `xPct` re-measured for the panorama layout.
- Test affordance: `?nosnap` disables GSAP snap (deterministic screenshots only; snap on for users).
- **Still gentle travel:** at 3.588:1 the camera only drifts ~300px/card and the library/workshop/
  garden landmarks cluster center-right, so stops 4–6 share framing. The "card fills view then slides
  fully off" drama needs an **ultra-wide plate (~10:1, e.g. 9600×960)** with the 7 landmarks evenly
  spaced ~one screen apart (centres `(i+0.5)/7`). Engine already handles any width — swap is just
  `SRC` + `xPct`. (Tool likely caps width → outpaint/stitch.)

## Open / follow-ups

- `xPct` values are tuned-by-eye; fine-tune against the plate if any panel drifts off its building.
- Plate is a 6.5 MB PNG — convert to optimized WebP/AVIF for production payload.
- Hero subhead contrast over the busy sky is marginal; consider a faint text plate.
- Optional: a small pointer/tail on each speech bubble toward its building.
