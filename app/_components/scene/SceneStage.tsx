"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import TimelineNav from "../village/TimelineNav";
import SectionPanel from "./SectionPanel";
import HeroPanel from "./HeroPanel";
import Mascot from "../Mascot";
import { STOPS } from "@/content/stops";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// SSR-safe "are we on the client yet" flag — same pattern as TimelineNav's
// body portal (a fixed child of a transformed ancestor scrolls with it, so
// the mascot dock overlay must portal to <body> too).
const emptySubscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

// Scroll choreography tunables — one place to retune pacing/scale.
const MASCOT_DOCK = { right: 32, bottom: 72 }; // px padding from viewport edges
const MASCOT_DOCK_SCALE = 0.45; // ~288px hero box -> ~130px docked

/**
 * Horizontal full-viewport section deck. On a wide viewport with motion allowed
 * it pins the stage and pans a row of full-viewport sections sideways (GSAP
 * ScrollTrigger pin + scrub + snap) through the hero + the six numbered stops.
 * Each section fills the screen; as it settles, the global --mood / --mood-ink
 * morph toward that section's accent. The last stop (07) never pans away —
 * the footer is a separate fixed overlay that curtain-slides over it from the
 * right instead, a hard cut rather than a cross-fade. --mood/--mood-ink keep
 * morphing through that cut on their own dedicated tween even though the
 * section content underneath has frozen.
 *
 * Fallback (narrow viewport or prefers-reduced-motion): no pin, no pan, no
 * curtain. The sections stack vertically, each one screen tall, footer
 * included as the final card; an IntersectionObserver drives the active
 * section + mood discretely. Same content, same order.
 *
 * Cross-component nav: the top Nav dispatches a `scene:jump` CustomEvent with
 * the section index; we route it through the same jump used by the bottom
 * timeline.
 */
export default function SceneStage({
  panels,
  footer,
  heroHeadline,
}: {
  /** One node per stop, aligned to STOPS — the section's body content. */
  panels: ReactNode[];
  /** The footer body — rendered as the final horizontal panel. */
  footer: ReactNode;
  /** Hero (section 01) headline, with the selling word emphasised. */
  heroHeadline: ReactNode;
}) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const jumpRef = useRef<(i: number) => void>(() => {});
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [horizontal, setHorizontal] = useState(false);
  const mascotOverlayRef = useRef<HTMLDivElement>(null);
  const footerCurtainRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();

  // Total panels = the seven content sections plus the footer.
  const PANELS = STOPS.length + 1;

  // Whether the footer curtain has started covering the deck. `active` caps
  // at the last real stop now (07 never advances past it — see the engine
  // below), so it can't drive this; a dedicated flip is needed to hand
  // interactivity from the stops (inert once the curtain covers them) to the
  // footer (inert until then) at the same moment the curtain starts closing.
  const footerOpenRef = useRef(false);
  const [footerOpen, setFooterOpen] = useState(false);
  const commitFooterOpen = (v: boolean) => {
    if (v === footerOpenRef.current) return;
    footerOpenRef.current = v;
    setFooterOpen(v);
  };
  const panelLayout = (id: string) => {
    if (id === "stop-02") return "numeral" as const;
    if (id === "stop-04") return "split" as const;
    if (id === "stop-05") return "leftAnchor" as const;
    if (id === "stop-06") return "statement" as const;
    return "center" as const;
  };

  const commit = (i: number) => {
    if (i === activeRef.current) return;
    activeRef.current = i;
    setActive(i);
  };

  // Decide the mode from media queries (kept separate so the engine effect can
  // re-run with the correct DOM mounted when the mode flips).
  useEffect(() => {
    const mqWide = window.matchMedia("(min-width: 900px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const upd = () => setHorizontal(mqWide.matches && !mqMotion.matches);
    upd();
    mqWide.addEventListener("change", upd);
    mqMotion.addEventListener("change", upd);
    return () => {
      mqWide.removeEventListener("change", upd);
      mqMotion.removeEventListener("change", upd);
    };
  }, []);

  // The engine — re-runs when the mode flips (refs match the rendered tree).
  useEffect(() => {
    const root = document.documentElement;
    const last = STOPS.length - 1;
    const setMood = (v: string, ink: string) => {
      root.style.setProperty("--mood", v);
      root.style.setProperty("--mood-ink", ink);
    };

    // ── Vertical fallback ──────────────────────────────────────────
    if (!horizontal) {
      const pin = pinRef.current;
      if (!pin) return;
      const cards = Array.from(pin.querySelectorAll<HTMLElement>("[data-stop]"));
      const obs = new IntersectionObserver(
        (entries) => {
          const vis = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!vis) return;
          const i = cards.indexOf(vis.target as HTMLElement);
          if (i >= 0) {
            commit(i);
            const m = Math.min(i, PANELS - 1);
            const FOOTER_BG = "#1a1a1f";
            const FOOTER_ACCENT = "#e8e8e8";
            const BG_COLOR = "#fafaf7";
            
            const accent = m <= last ? STOPS[m].accent : FOOTER_ACCENT;
            const ink = m <= last ? STOPS[m].accentInk : FOOTER_ACCENT;
            setMood(accent, ink);
            
            if (m === PANELS - 1) {
              root.style.setProperty("--deck-surface", FOOTER_BG);
            } else {
              const bgSource = Math.max(1, Math.min(i, last));
              const surfaceAccent = i <= 0 ? BG_COLOR : STOPS[bgSource].accent;
              root.style.setProperty(
                "--deck-surface",
                `color-mix(in oklab, ${BG_COLOR} 94%, ${surfaceAccent})`
              );
            }
            
            cards.forEach((c, idx) => {
              c.style.setProperty("--reveal", idx <= i ? "1" : "0");
            });
            root.style.setProperty("--footer-reveal", i >= PANELS - 1 ? "1" : "0");
            // Vertical fallback has no pan/dwell distinction — both the
            // continuous progress line and the section-tracking icon scale
            // read the same discrete per-section value.
            const discreteProgress = String(PANELS > 1 ? i / (PANELS - 1) : 0);
            root.style.setProperty("--village-progress", discreteProgress);
            root.style.setProperty("--village-icons", discreteProgress);
          }
        },
        { threshold: 0.5 }
      );
      cards.forEach((c) => obs.observe(c));
      jumpRef.current = (i) => cards[i]?.scrollIntoView({ behavior: "smooth" });
      return () => obs.disconnect();
    }

    // ── Horizontal pin + scrub master timeline ──────────────────────
    // One gsap.timeline drives the whole deck: a pinned hero-exit hold
    // (T6/T8 fill in the word-scatter + mascot dock tweens here), then for
    // each section a pan (ease:"none", per ScrollTrigger skill rules) and a
    // pinned dwell (T9 fills in entrance tweens here). ScrollTrigger lives
    // only on this top-level timeline, never on a child tween.
    let cancelled = false;
    let cleanup = () => {};

    if (cancelled) return;
    const lerp = gsap.utils.interpolate;
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin) return;

        // Read once (not per scroll frame — getComputedStyle forces a style
        // recalc) from the actual CSS tokens instead of re-typed hex, so this
        // engine can't silently drift from globals.css if those are retuned.
        const rootStyle = getComputedStyle(root);
        const BG_COLOR = rootStyle.getPropertyValue("--color-bg").trim() || "#fafaf7";
        const FOOTER_BG = rootStyle.getPropertyValue("--color-term-bg").trim() || "#1a1a1f";
        const FOOTER_ACCENT = rootStyle.getPropertyValue("--color-term-text").trim() || "#e8e8e8";
        const INITIAL_COLOR = rootStyle.getPropertyValue("--reveal-initial").trim() || "#0A0D0D";

        const heroSection = track.querySelector<HTMLElement>("#stop-01");

        // The content sections (hero + 02..07), index-aligned to STOPS. Each gets
        // a per-section `--reveal` (0..1) so its headline + rule morph black->accent.
        const sectionEls = Array.from(
          track.querySelectorAll<HTMLElement>('section[id^="stop-"]')
        );

        // Mascot dock overlay: starts glued exactly over HeroPanel's reserved
        // slot (measured via its rect — a FLIP-style handoff), then T8's dock
        // tween carries it to the bottom-right corner. Re-measured on every
        // ScrollTrigger refresh (covers resize) so it never drifts from the
        // hero slot before the hold begins. Initial reveal (autoAlpha) is
        // owned by the shared entrance timeline below, not here — keeps a
        // single writer for the overlay's opacity instead of two tweens
        // racing each other on mount.
        const positionMascotOverlay = () => {
          const overlay = mascotOverlayRef.current;
          const slot = heroSection?.querySelector<HTMLElement>("[data-mascot-slot]");
          if (!overlay || !slot) return;
          const r = slot.getBoundingClientRect();
          gsap.set(overlay, { x: r.left, y: r.top, scale: 1 });
        };
        positionMascotOverlay();
        ScrollTrigger.addEventListener("refresh", positionMascotOverlay);

        // Section k is centered at seg=k. Reveal ramps 0->1 as the section goes
        // from 45% visible (seg=k-0.55) to centered (seg=k), saturates at 1 when
        // it exits forward, and reverses on scroll-back. Hero (k=0) is always 1.
        const WINDOW = 0.55; // start morphing once the section is 45% visible
        const reveal = (k: number, seg: number) =>
          k === 0 ? 1 : Math.min(Math.max((seg - (k - WINDOW)) / WINDOW, 0), 1);

        // seg (0..PANELS-1) = current section position, derived straight from
        // the track's actual x so it stays correct through pans AND dwells
        // (dwells hold x constant, so seg holds too — that's the "reveal ramps
        // during the pan, rests during the dwell" behavior).
        const apply = () => {
          const trackX = (gsap.getProperty(track, "x") as number) || 0;
          const seg = -trackX / window.innerWidth;
          commit(Math.min(Math.round(seg), PANELS - 1));

          const bgSeg = Math.min(Math.max(seg, 0), PANELS - 1);
          let deckSurface = "";

          if (bgSeg < 1) {
            const accent = lerp(BG_COLOR, STOPS[1].accent, bgSeg) as string;
            deckSurface = `color-mix(in oklab, ${BG_COLOR} 94%, ${accent})`;
          } else if (bgSeg < last) {
            const from = Math.floor(bgSeg);
            const to = from + 1;
            const t = bgSeg - from;
            const accent = lerp(STOPS[from].accent, STOPS[to].accent, t) as string;
            deckSurface = `color-mix(in oklab, ${BG_COLOR} 94%, ${accent})`;
          } else {
            const t = bgSeg - last;
            const lastAccent = STOPS[last].accent;
            deckSurface = `color-mix(in oklab, ${FOOTER_BG} ${t * 100}%, color-mix(in oklab, ${BG_COLOR} 94%, ${lastAccent}))`;
          }

          root.style.setProperty("--deck-surface", deckSurface);

          sectionEls.forEach((el, k) => {
            const ra = reveal(k, seg);
            el.style.setProperty("--reveal", String(ra));
            const stop = STOPS[k];
            if (!stop) return;
            const targetAccent = stop.accent;
            const targetInk = stop.accentInk;
            el.style.setProperty("--local-accent", lerp(INITIAL_COLOR, targetAccent, ra) as string);
            el.style.setProperty("--local-ink", lerp(INITIAL_COLOR, targetInk, ra) as string);
          });
          // Chrome (timeline dot, progress bar, mascot orb) blooms black->the
          // active section's accent and reverses with scroll. Only while
          // we're before the curtain — once it starts, a dedicated tween
          // (built after the loop below) owns mood exclusively so it can
          // keep morphing smoothly toward the footer's tone while 07 itself
          // sits frozen behind the curtain (both would otherwise fight over
          // --mood on every frame).
          if (master.time() < CURTAIN_START) {
            const a = Math.min(Math.max(Math.round(seg), 0), last);
            const ra = reveal(a, seg);
            setMood(
              lerp(INITIAL_COLOR, STOPS[a].accent, ra) as string,
              lerp(INITIAL_COLOR, STOPS[a].accentInk, ra) as string
            );
          }
          commitFooterOpen(master.time() >= CURTAIN_START);
          // village-icons feeds TimelineNav's icon scale (section-tracking):
          // seg alone caps at `last` once 07 settles (the track never pans
          // further), so the curtain+reveal phase adds its own 0..1 progress
          // on top, reaching a full 1.0 exactly when the reveal ends — icon
          // growth keeps advancing right through the curtain close, even
          // though the section content underneath has stopped morphing.
          const curtainT = gsap.utils.clamp(0, 1, (master.time() - CURTAIN_START) / CURTAIN_SPAN);
          root.style.setProperty(
            "--village-icons",
            String(gsap.utils.clamp(0, 1, (seg + curtainT) / (PANELS - 1)))
          );
          // village-progress feeds TimelineNav's progress line: a piecewise-
          // linear map of master.time() across each stop's timeline label,
          // continuous through the pinned hold and every dwell (not just the
          // pans) instead of freezing whenever seg (derived from the track's
          // x position) holds still. Falls back to the seg+curtain formula
          // above if the stop labels are ever missing or out of order.
          root.style.setProperty(
            "--village-progress",
            String(stopTimesValid ? villageProgressFromTime(master.time()) : gsap.utils.clamp(0, 1, (seg + curtainT) / (PANELS - 1)))
          );
        };
        // Timeline units: 1 hero-exit hold, then per section a 1-unit pan +
        // 1-unit dwell. TOTAL_UNITS * UNIT_PX() is the scroll distance.
        const HOLD = 1;
        const DWELL = 1;
        const TOTAL_UNITS = HOLD + (PANELS - 1) * (1 + DWELL);
        const UNIT_PX = () => 0.6 * window.innerWidth;

        // The track only ever pans through the real stops (hero + 02..07,
        // i.e. up to `last`) — footer isn't a track panel anymore, so it
        // reuses the two units that final pan+dwell used to occupy as its
        // own curtain-close + reveal-hold instead. 07 stays put (never pans
        // away) and the curtain slides over it.
        const CURTAIN_START = HOLD + last * (1 + DWELL);
        const CURTAIN_DURATION = 1;
        const CURTAIN_SPAN = CURTAIN_DURATION + DWELL;

        // Zero-duration placeholder used only to pin the timeline's total
        // duration to TOTAL_UNITS before T6/T8/T9 add real content into the
        // hold/dwell slots — otherwise gsap.timeline's duration would end at
        // the last real tween instead of the full scroll range.
        const durationProxy = {};

        // On the home page the nav is `fixed` (out of flow), so the pinned stage
        // starts at the very top: "top top" pins at scroll 0 (no vertical
        // pre-scroll) and releases cleanly at the end (no nav-height jump).
        const master = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => "+=" + Math.max(TOTAL_UNITS * UNIT_PX(), 1),
            pin: true,
            // Lock the section to scroll position (no lag) so the timeline dot
            // and mood always match the visible section. A scrub delay would
            // make the highlight lead the section during scrolling.
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: apply,
          },
        });

        master.addLabel("hero-exit", 0);

        // Hero word-scatter: pieces of the headline/terminal fly out in three
        // directions during the pinned hold, staggered within each group so
        // they don't move in lockstep. Scoped to the hero section only.
        const scatterEls = (dir: "up" | "left" | "down") =>
          Array.from(
            heroSection?.querySelectorAll<HTMLElement>(`[data-hero-scatter="${dir}"]`) ?? []
          );
        const SCATTER_DUR = HOLD * 0.9;
        master
          .to(
            scatterEls("up"),
            { y: "-120vh", stagger: 0.06, duration: SCATTER_DUR, ease: "power2.in" },
            0
          )
          .to(
            scatterEls("left"),
            { x: "-120vw", stagger: 0.06, duration: SCATTER_DUR, ease: "power2.in" },
            0.05
          )
          .to(
            scatterEls("down"),
            { y: "120vh", stagger: 0.06, duration: SCATTER_DUR, ease: "power2.in" },
            0.1
          );
        // Mascot dock: glides from the hero slot (set by positionMascotOverlay)
        // to the bottom-right corner, shrinking on the way. Target x/y are
        // function-based (recomputed on invalidateOnRefresh) since they depend
        // on the overlay's own box size and the viewport.
        if (mascotOverlayRef.current) {
          const overlay = mascotOverlayRef.current;
          const dockTarget = () => {
            const w = overlay.offsetWidth;
            const h = overlay.offsetHeight;
            return {
              x: window.innerWidth - MASCOT_DOCK.right - w * MASCOT_DOCK_SCALE,
              y: window.innerHeight - MASCOT_DOCK.bottom - h * MASCOT_DOCK_SCALE,
            };
          };
          master.to(
            overlay,
            {
              x: () => dockTarget().x,
              y: () => dockTarget().y,
              scale: MASCOT_DOCK_SCALE,
              duration: SCATTER_DUR,
              ease: "power2.inOut",
            },
            0
          );
        }

        // Per-section entrances: each dwell wipes its [data-enter] children in
        // out of an invisible baseline (clip-path mask + translate — same
        // family as FooterTagline's own char reveal, which is untouched and
        // stays driven by --footer-reveal). No fade, fully opaque throughout.
        // Direction cycles per section (up/left/down/right/up/left across
        // 02-07) so the six dwells don't all read as the same move; each
        // clip-path sweeps from the edge the content is translated toward.
        // Always fromTo (never `from` — a scrubbed timeline re-renders from
        // whatever state exists on resize/refresh, and `from` would snap-hide
        // content that's already visible). Hidden state is set per-section
        // (not blanket) since it depends on that section's direction.
        const enterEls = (el: HTMLElement | null) =>
          el ? Array.from(el.querySelectorAll<HTMLElement>("[data-enter]")) : [];

        // Footer tagline reveal — GSAP can't tween a CSS custom property
        // directly, so a plain object is the value source and onUpdate writes
        // it to --footer-reveal (FooterTagline reads it every rAF tick).
        const footerReveal = { v: 0 };
        root.style.setProperty("--footer-reveal", "0");

        const ENTER_DIRECTIONS = ["up", "left", "down", "right"] as const;
        type EnterDir = (typeof ENTER_DIRECTIONS)[number];
        const enterVars = (dir: EnterDir, hidden: boolean) => {
          const amt = hidden ? 40 : 0;
          switch (dir) {
            case "up":
              return { yPercent: amt, clipPath: hidden ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 0% 0%)" };
            case "down":
              return { yPercent: -amt, clipPath: hidden ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)" };
            case "left":
              return { xPercent: -amt, clipPath: hidden ? "inset(0% 0% 0% 100%)" : "inset(0% 0% 0% 0%)" };
            case "right":
              return { xPercent: amt, clipPath: hidden ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 0%)" };
          }
        };

        for (let k = 1; k <= last; k++) {
          const panStart = HOLD + (k - 1) * (1 + DWELL);
          master.to(
            track,
            { x: () => -k * window.innerWidth, ease: "none", duration: 1 },
            panStart
          );
          master.addLabel(`stop-${k}`, panStart + 1);

          const els = enterEls(sectionEls[k]);
          if (els.length) {
            const dir = ENTER_DIRECTIONS[(k - 1) % ENTER_DIRECTIONS.length];
            gsap.set(els, enterVars(dir, true));
            master.fromTo(
              els,
              enterVars(dir, true),
              {
                ...enterVars(dir, false),
                stagger: 0.08,
                duration: DWELL * 0.8,
                ease: "power3.out",
              },
              panStart + 1
            );
          }
        }

        // Footer curtain: 07 stays put (the loop above never pans past it) —
        // the footer slides over it from the right instead of the two
        // cross-fading via a shared pan, so there's a hard cut between them
        // rather than a blended dissolve.
        master.addLabel(`stop-${PANELS - 1}`, CURTAIN_START + CURTAIN_DURATION);

        // Absolute timeline times for every stop label (hero at 0, then
        // stop-1..stop-(PANELS-1) — the last of which is the footer curtain
        // fully closed). Read now that every label above has been added.
        // Used by villageProgressFromTime() (apply(), above) to derive the
        // continuous progress line straight from master.time() instead of
        // the track's x position, which holds still through every hold/dwell.
        const stopLabelTimes: number[] = [0];
        for (let k = 1; k <= PANELS - 1; k++) {
          const t = master.labels[`stop-${k}`];
          if (typeof t !== "number") {
            stopLabelTimes.length = 0;
            break;
          }
          stopLabelTimes.push(t);
        }
        const stopTimesValid =
          stopLabelTimes.length === PANELS &&
          stopLabelTimes.every((t, i) => i === 0 || t > stopLabelTimes[i - 1]);
        const villageProgressFromTime = (t: number): number => {
          const totalTime = stopLabelTimes[stopLabelTimes.length - 1];
          const clampedT = gsap.utils.clamp(0, totalTime, t);
          let k = 0;
          while (k < PANELS - 2 && clampedT >= stopLabelTimes[k + 1]) k++;
          const segStart = stopLabelTimes[k];
          const segEnd = stopLabelTimes[k + 1];
          const frac = segEnd > segStart ? (clampedT - segStart) / (segEnd - segStart) : 0;
          return gsap.utils.clamp(0, 1, (k + frac) / (PANELS - 1));
        };

        if (footerCurtainRef.current) {
          // `x: 0` is pinned at BOTH ends on purpose: the element carries a
          // class-based `transform: translateX(100%)` (first-paint hiding),
          // and GSAP parses that into its internal px `x` when it first reads
          // the element. Animating xPercent alone would leave that parsed px
          // offset in place and the curtain would never reach the viewport.
          master.fromTo(
            footerCurtainRef.current,
            { xPercent: 100, x: 0 },
            { xPercent: 0, x: 0, ease: "none", duration: CURTAIN_DURATION },
            CURTAIN_START
          );
        }
        // Chrome keeps morphing through the cut (only the content underneath
        // freezes): --mood/--mood-ink glide from 07's settled accent to the
        // footer's tone across the same span the curtain takes to close, then
        // hold there — apply()'s own setMood is gated off past CURTAIN_START
        // so the two don't fight over the same frame.
        const moodToFooter = { t: 0 };
        master.fromTo(
          moodToFooter,
          { t: 0 },
          {
            t: 1,
            duration: CURTAIN_DURATION,
            ease: "none",
            onUpdate: () => {
              setMood(
                lerp(STOPS[last].accent, FOOTER_ACCENT, moodToFooter.t) as string,
                lerp(STOPS[last].accentInk, FOOTER_ACCENT, moodToFooter.t) as string
              );
            },
          },
          CURTAIN_START
        );
        // Footer tagline: starts only once the curtain has fully closed
        // (100% covering), then rises across nearly the whole hold that
        // follows — a deliberate, unhurried close rather than a snap.
        master.fromTo(
          footerReveal,
          { v: 0 },
          {
            v: 1,
            duration: DWELL * 0.9,
            ease: "power2.out",
            onUpdate: () => root.style.setProperty("--footer-reveal", String(footerReveal.v)),
          },
          CURTAIN_START + CURTAIN_DURATION
        );

        master.set(durationProxy, {}, TOTAL_UNITS);

        const st = master.scrollTrigger!;
        apply();
        jumpRef.current = (i) => {
          const label = i === 0 ? 0 : (master.labels[`stop-${i}`] ?? 0);
          const p = label / master.duration();
          // Smoothly tween the scroll to the section's exact position (GSAP, not
          // native smooth-scroll, so it lands precisely).
          gsap.to(window, {
            duration: 0.6,
            ease: "power2.inOut",
            scrollTo: st.start + p * (st.end - st.start),
          });
        };

        // Re-measure after the horizontal layout has actually painted.
        ScrollTrigger.refresh();
        requestAnimationFrame(() => ScrollTrigger.refresh());

    cleanup = () => {
      ScrollTrigger.removeEventListener("refresh", positionMascotOverlay);
      master.kill();
    };

    return () => {
      cancelled = true;
      cleanup();
    };
    // `mounted` is included so that if it flips true after `horizontal` (the
    // mascot overlay / footer curtain portals weren't in the DOM yet on the
    // first horizontal pass), the engine rebuilds and picks up
    // mascotOverlayRef.current / footerCurtainRef.current.
  }, [horizontal, mounted, PANELS]);

  // Top-nav jumps (CustomEvent from Nav).
  useEffect(() => {
    const onJump = (e: Event) => {
      const i = (e as CustomEvent).detail as number;
      if (typeof i === "number") jumpRef.current(i);
    };
    window.addEventListener("scene:jump", onJump);
    return () => window.removeEventListener("scene:jump", onJump);
  }, []);

  // ── Entrance animation ──────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tl: gsap.core.Timeline | undefined;
    // TimelineNav portals in behind a useSyncExternalStore mounted flag, so its
    // nav isn't in the DOM on this first effect pass — defer one frame so GSAP's
    // synchronous selector lookup finds it instead of silently skipping it.
    const raf = requestAnimationFrame(() => {
      tl = gsap.timeline({
        defaults: { ease: "power2.out", duration: 0.6 }
      });

      tl.to("header.js-entrance-hide", { opacity: 1, y: 0, duration: 0.5 })
        .to("#stop-01 h1.js-entrance-hide", { opacity: 1, y: 0 }, "-=0.35")
        .to("span[data-hero-scatter='up'].js-entrance-hide", { opacity: 1, y: 0 }, "-=0.45");

      // Ref only, not the `horizontal` state: this effect has an empty dep
      // array (runs once), so it'd otherwise capture `horizontal`'s stale
      // useState(false) initial value forever. The ref itself is null
      // whenever the horizontal-mode overlay portal isn't rendered, so
      // checking it directly is both correct and mode-agnostic.
      if (mascotOverlayRef.current) {
        tl.to(mascotOverlayRef.current, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, "-=0.3");
      }

      tl.to("[data-hero-scatter='left'].js-entrance-hide", { opacity: 1, y: 0 }, "-=0.3")
        .fromTo(
          "div[data-hero-scatter='up']",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, clearProps: "opacity,transform" },
          "-=0.3"
        )
        .to("[data-entrance-mascot].js-entrance-hide", { opacity: 1, y: 0 }, "-=0.4");
    });

    return () => {
      cancelAnimationFrame(raf);
      tl?.kill();
    };
  }, []);

  return (
    <>
      {horizontal ? (
        <div ref={pinRef} className="deck-bg relative h-[100dvh] overflow-hidden">
          <div
            ref={trackRef}
            className="flex h-[100dvh] w-max flex-nowrap will-change-transform"
          >
            {STOPS.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                inert={i !== active || footerOpen ? true : undefined}
                className="h-[100dvh] w-screen shrink-0 pt-14 pb-20"
                style={{
                  "--accent-light": s.accent,
                  "--accent-ink-light": s.accentInk,
                  "--local-accent": s.accent,
                  "--local-ink": s.accentInk,
                } as React.CSSProperties}
              >
                {i === 0 ? (
                  <HeroPanel meta={s} headline={heroHeadline} hideMascot>
                    {panels[i]}
                  </HeroPanel>
                ) : (
                  <SectionPanel meta={s} layout={panelLayout(s.id)}>{panels[i]}</SectionPanel>
                )}
              </section>
            ))}
          </div>
        </div>
      ) : (
        <div ref={pinRef} className="deck-bg deck-bg--eased relative flex flex-col">
          {STOPS.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              data-stop
              className="min-h-[100dvh] w-full [transition:--reveal_500ms_ease-out] pt-14 pb-20"
              style={{
                "--accent-light": s.accent,
                "--accent-ink-light": s.accentInk,
                "--local-accent": s.accent,
                "--local-ink": s.accentInk,
              } as React.CSSProperties}
            >
              {i === 0 ? (
                <HeroPanel meta={s} headline={heroHeadline}>
                  {panels[i]}
                </HeroPanel>
              ) : (
                <SectionPanel meta={s} layout={panelLayout(s.id)}>{panels[i]}</SectionPanel>
              )}
            </section>
          ))}
          <section data-stop className="min-h-[100dvh] w-full pt-14 pb-20">
            {footer}
          </section>
        </div>
      )}

      <TimelineNav stops={STOPS} active={active} onJump={(i) => jumpRef.current(i)} />

      {/* Mascot dock overlay — horizontal mode only. Portal to <body> for the
          same reason as TimelineNav: a fixed child of a transformed ancestor
          (GSAP's pin wrapper) scrolls with it instead of staying fixed.
          Starts glued over the hero's reserved slot, then T8's dock tween
          carries it to the bottom-right corner where it stays pinned. */}
      {horizontal && mounted &&
        createPortal(
          <div
            ref={mascotOverlayRef}
            // `invisible` until GSAP's positionMascotOverlay() places it over
            // the hero slot (autoAlpha:1 inline overrides the class) — the
            // overlay sits at raw viewport top-left until that first gsap.set
            // runs, and painting it there flashes the mascot snapping across
            // the screen on load. Class not inline style: same lesson as the
            // footer curtain below.
            className="pointer-events-none invisible fixed left-0 top-0 z-30 h-[175px] w-[175px] origin-top-left sm:h-[238px] sm:w-[238px] lg:h-[288px] lg:w-[288px]"
            aria-hidden
          >
            <Mascot size="hero" />
          </div>,
          document.body
        )}

      {/* Footer curtain — horizontal mode only. Portal to <body> for the same
          reason as TimelineNav/the mascot overlay. Slides in from the right
          over the pinned, static 07 section (which never pans away) instead
          of both cross-fading via a shared pan — a hard cut, not a dissolve.
          z-20: under the mascot (z-30, stays visible throughout) and the
          timeline (z-40, keeps morphing through the cut). `inert` flips with
          `footerOpen` so its links aren't keyboard/AT-reachable while it's
          still off-screen, and 07's are not reachable once it's covered. */}
      {horizontal && mounted &&
        createPortal(
          <div
            ref={footerCurtainRef}
            inert={!footerOpen ? true : undefined}
            // [transform:translateX(100%)]: off-screen at first paint, before
            // GSAP's dynamic import resolves (no-JS gap otherwise flashes the
            // curtain at rest). Must be the `transform` PROPERTY, not
            // Tailwind's translate-x-full — v4's translate utilities set the
            // standalone CSS `translate` property, which composes ADDITIVELY
            // with the `transform` GSAP animates, permanently offsetting the
            // curtain one viewport right no matter what the tween does. A
            // class transform instead gets overridden by GSAP's inline
            // transform once the tween runs (and the tween pins x:0 to kill
            // the px offset GSAP parses out of this initial matrix).
            className="fixed inset-0 z-20 h-[100dvh] w-screen [transform:translateX(100%)] overflow-hidden bg-term-bg pt-14 pb-20 will-change-transform"
          >
            {footer}
          </div>,
          document.body
        )}
    </>
  );
}
