"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import TimelineNav from "../village/TimelineNav";
import SectionPanel from "./SectionPanel";
import HeroPanel from "./HeroPanel";
import { STOPS } from "@/content/stops";

/**
 * Horizontal full-viewport section deck. On a wide viewport with motion allowed
 * it pins the stage and pans a row of full-viewport sections sideways (GSAP
 * ScrollTrigger pin + scrub + snap). Each section fills the screen; as it
 * settles, the global --mood / --mood-ink morph toward that section's accent.
 * The footer is the final panel in the same track, so it scrolls in
 * horizontally too.
 *
 * Fallback (narrow viewport or prefers-reduced-motion): no pin, no pan. The
 * sections stack vertically, each one screen tall; an IntersectionObserver
 * drives the active section + mood discretely. Same content, same order.
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

  // Total panels = the seven content sections plus the footer.
  const PANELS = STOPS.length + 1;

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
            const m = Math.min(i, last);
            setMood(STOPS[m].accent, STOPS[m].accentInk);
            root.style.setProperty(
              "--village-progress",
              String(PANELS > 1 ? i / (PANELS - 1) : 0)
            );
          }
        },
        { threshold: 0.5 }
      );
      cards.forEach((c) => obs.observe(c));
      jumpRef.current = (i) => cards[i]?.scrollIntoView({ behavior: "smooth" });
      return () => obs.disconnect();
    }

    // ── Horizontal pin + scrub pan ─────────────────────────────────
    let cancelled = false;
    let cleanup = () => {};

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/ScrollToPlugin"),
    ])
      .then(([{ gsap }, { ScrollTrigger }, { ScrollToPlugin }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        const lerp = gsap.utils.interpolate;
        const track = trackRef.current;
        const pin = pinRef.current;
        if (!track || !pin) return;

        // Pan the whole row sideways: distance = how far the track overflows the
        // viewport (= (PANELS - 1) screen widths).
        const distance = () => Math.max(track.scrollWidth - window.innerWidth, 0);

        const apply = (p: number) => {
          const cl = Math.min(Math.max(p, 0), 1);
          const seg = cl * (PANELS - 1);
          commit(Math.min(Math.round(seg), PANELS - 1));
          // Continuous scroll-driven morph: hold the current section's color for
          // the first 25% of the transition, then smoothstep to the next over the
          // remaining 75%. With snap removed, this is visible as you scroll.
          const k = Math.min(Math.floor(seg), last);
          if (k >= last) {
            setMood(STOPS[last].accent, STOPS[last].accentInk);
          } else {
            const t = seg - k;
            const HOLD = 0.25;
            let u = t <= HOLD ? 0 : (t - HOLD) / (1 - HOLD);
            u = u * u * (3 - 2 * u); // smoothstep
            setMood(
              lerp(STOPS[k].accent, STOPS[k + 1].accent, u) as string,
              lerp(STOPS[k].accentInk, STOPS[k + 1].accentInk, u) as string
            );
          }
          root.style.setProperty("--village-progress", String(cl));
        };

        // On the home page the nav is `fixed` (out of flow), so the pinned stage
        // starts at the very top: "top top" pins at scroll 0 (no vertical
        // pre-scroll) and releases cleanly at the end (no nav-height jump).
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            // 1 section = 1 screen: stretch the pan over (PANELS-1)
            // viewport-widths of scroll so each section dwells a full screen.
            end: () => "+=" + Math.max((PANELS - 1) * window.innerWidth, 1),
            pin: true,
            // Lock the section to scroll position (no lag) so the timeline dot
            // and mood always match the visible section. A scrub delay would
            // make the highlight lead the section during scrolling.
            scrub: true,
            invalidateOnRefresh: true,
            // No snap: free scroll so the color morph between sections is visible
            // as you scroll (snap rushed past the intermediate colors).
            onUpdate: (self) => apply(self.progress),
          },
        });
        apply(0);

        const st = tween.scrollTrigger!;
        jumpRef.current = (i) => {
          const p = i / (PANELS - 1);
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
          st.kill();
          tween.kill();
        };
      })
      .catch(() => {
        /* gsap failed — content still flows in document order */
      });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [horizontal, PANELS]);

  // Top-nav jumps (CustomEvent from Nav).
  useEffect(() => {
    const onJump = (e: Event) => {
      const i = (e as CustomEvent).detail as number;
      if (typeof i === "number") jumpRef.current(i);
    };
    window.addEventListener("scene:jump", onJump);
    return () => window.removeEventListener("scene:jump", onJump);
  }, []);

  return (
    <>
      {horizontal ? (
        <div ref={pinRef} className="relative h-[100dvh] overflow-hidden">
          <div
            ref={trackRef}
            className="flex h-[100dvh] w-max flex-nowrap will-change-transform"
          >
            {STOPS.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className="h-[100dvh] w-screen shrink-0"
              >
                {i === 0 ? (
                  <HeroPanel meta={s} headline={heroHeadline}>
                    {panels[i]}
                  </HeroPanel>
                ) : (
                  <SectionPanel meta={s}>{panels[i]}</SectionPanel>
                )}
              </section>
            ))}
            {/* Footer — the final horizontal panel. */}
            <section className="h-[100dvh] w-screen shrink-0">{footer}</section>
          </div>
        </div>
      ) : (
        <div ref={pinRef} className="relative flex flex-col">
          {STOPS.map((s, i) => (
            <section key={s.id} id={s.id} data-stop className="min-h-[100dvh] w-full">
              {i === 0 ? (
                <HeroPanel meta={s} headline={heroHeadline}>
                  {panels[i]}
                </HeroPanel>
              ) : (
                <SectionPanel meta={s}>{panels[i]}</SectionPanel>
              )}
            </section>
          ))}
          <section data-stop className="min-h-[100dvh] w-full">
            {footer}
          </section>
        </div>
      )}

      <TimelineNav stops={STOPS} active={active} onJump={(i) => jumpRef.current(i)} />
    </>
  );
}
