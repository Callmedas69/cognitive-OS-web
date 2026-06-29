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
  const [isDark, setIsDark] = useState(true);

  // Synchronize isDark state from theme toggle events
  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    if (isLight) {
      setTimeout(() => setIsDark(false), 0);
    }

    const onThemeChange = (e: Event) => {
      setIsDark((e as CustomEvent).detail.isDark);
    };
    window.addEventListener("theme:change", onThemeChange);
    return () => window.removeEventListener("theme:change", onThemeChange);
  }, []);

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
            setMood(STOPS[m].accent, isDark ? STOPS[m].accent : STOPS[m].accentInk);
            // Per-section reveal: sections at/above the active one are colored,
            // the rest stay black (reverses as you scroll back up). The CSS
            // transition on the section eases the black<->accent fade.
            cards.forEach((c, idx) =>
              c.style.setProperty("--reveal", idx <= i ? "1" : "0")
            );
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

        // The content sections (hero + 02..07), index-aligned to STOPS. Each gets
        // a per-section `--reveal` (0..1) so its headline + rule morph black->accent.
        const sectionEls = Array.from(
          track.querySelectorAll<HTMLElement>('section[id^="stop-"]')
        );

        const INITIAL_COLOR = isDark ? "#ffffff" : "#0a0a0a";
        // Section k is centered at seg=k. Reveal ramps 0->1 as the section goes
        // from 45% visible (seg=k-0.55) to centered (seg=k), saturates at 1 when
        // it exits forward, and reverses on scroll-back. Hero (k=0) is always 1.
        const WINDOW = 0.55; // start morphing once the section is 45% visible
        const reveal = (k: number, seg: number) =>
          k === 0 ? 1 : Math.min(Math.max((seg - (k - WINDOW)) / WINDOW, 0), 1);

        const apply = (p: number) => {
          const cl = Math.min(Math.max(p, 0), 1);
          const seg = cl * (PANELS - 1);
          commit(Math.min(Math.round(seg), PANELS - 1));
          // Per-section reveal: each section's own black->accent fade.
          sectionEls.forEach((el, k) =>
            el.style.setProperty("--reveal", String(reveal(k, seg)))
          );
          // Chrome (timeline dot, progress bar, mascot orb) blooms black->the
          // active section's accent and reverses with scroll.
          const a = Math.min(Math.max(Math.round(seg), 0), last);
          const ra = reveal(a, seg);
          setMood(
            lerp(INITIAL_COLOR, STOPS[a].accent, ra) as string,
            lerp(INITIAL_COLOR, isDark ? STOPS[a].accent : STOPS[a].accentInk, ra) as string
          );
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
        const st = tween.scrollTrigger!;
        apply(st.progress);
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
  }, [horizontal, PANELS, isDark]);

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
        <div ref={pinRef} className="relative h-[100dvh] overflow-hidden bg-bg">
          <div
            ref={trackRef}
            className="flex h-[100dvh] w-max flex-nowrap will-change-transform"
          >
            {STOPS.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                inert={i !== active ? true : undefined}
                className="h-[100dvh] w-screen shrink-0"
                style={{
                  "--accent-light": s.accent,
                  "--accent-ink-light": s.accentInk,
                } as React.CSSProperties}
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
            <section
              inert={active !== STOPS.length ? true : undefined}
              className="h-[100dvh] w-screen shrink-0"
            >
              {footer}
            </section>
          </div>
        </div>
      ) : (
        <div ref={pinRef} className="relative flex flex-col">
          {STOPS.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              data-stop
              className="min-h-[100dvh] w-full [transition:--reveal_500ms_ease-out]"
              style={{
                "--accent-light": s.accent,
                "--accent-ink-light": s.accentInk,
              } as React.CSSProperties}
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
          <section data-stop className="min-h-[100dvh] w-full">
            {footer}
          </section>
        </div>
      )}

      <TimelineNav stops={STOPS} active={active} onJump={(i) => jumpRef.current(i)} />
    </>
  );
}
