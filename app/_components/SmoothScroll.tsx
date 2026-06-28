"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * GSAP ScrollSmoother wrapper. Smooths the native scroll (momentum/lerp) which
 * eases the horizontal pan + the per-section color reveal driven by ScrollTrigger.
 *
 * ScrollSmoother transforms #smooth-content, so any `position: fixed` UI must live
 * OUTSIDE this wrapper: the top Nav + MoodBar are rendered in layout.tsx (siblings
 * of this component) and the bottom TimelineNav portals itself to <body>.
 *
 * Disabled when prefers-reduced-motion is set (native scroll, and SceneStage uses
 * its vertical fallback there anyway).
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let smoother: { kill: () => void } | null = null;

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/ScrollSmoother"),
    ])
      .then(([{ gsap }, { ScrollTrigger }, { ScrollSmoother }]) => {
        if (cancelled || !wrapper.current || !content.current) return;
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
        smoother = ScrollSmoother.create({
          wrapper: wrapper.current,
          content: content.current,
          smooth: 1.4,
          smoothTouch: 0, // native scroll on touch (smoothing feels laggy there)
          effects: false,
          normalizeScroll: false,
        });
      })
      .catch(() => {
        /* gsap failed — native scroll still works */
      });

    return () => {
      cancelled = true;
      smoother?.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper" ref={wrapper}>
      <div id="smooth-content" ref={content}>
        {children}
      </div>
    </div>
  );
}
