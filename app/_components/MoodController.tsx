"use client";

import { useEffect } from "react";

/**
 * Drives the global --mood / --mood-ink vars from scroll position using GSAP
 * ScrollTrigger with `scrub`, so the color morphs seamlessly and continuously
 * as you scroll (no discrete per-section jumps). GSAP interpolates the hex
 * colors in RGB.
 *
 * Reads [data-mood] / [data-mood-ink] off each <Section>. GSAP is lazy-imported
 * so it stays out of the initial bundle; until it loads (and under
 * prefers-reduced-motion) the vars hold their default emerald.
 */
export default function MoodController() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup = () => {};
    let cancelled = false;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        const root = document.documentElement;
        const nodes = Array.from(
          document.querySelectorAll<HTMLElement>("[data-mood]")
        ).filter((n) => n.dataset.mood);
        if (!nodes.length) return;

        // Shared proxy GSAP tweens; written to the CSS vars every frame.
        const proxy = {
          v: nodes[0].dataset.mood!,
          ink: nodes[0].dataset.moodInk || nodes[0].dataset.mood!,
        };
        const write = () => {
          root.style.setProperty("--mood", proxy.v);
          root.style.setProperty("--mood-ink", proxy.ink);
        };
        write();

        // Chain a fromTo per transition: each section morphs the proxy from the
        // PREVIOUS section's color to its own as it crosses the upper viewport.
        // immediateRender:false keeps the recorded `from` accurate (no snap at
        // setup), so colors flow prev→next with no flash-back to the default.
        let prevV = proxy.v;
        let prevInk = proxy.ink;
        const tweens = nodes.slice(1).map((node) => {
          const toV = node.dataset.mood!;
          const toInk = node.dataset.moodInk || toV;
          const tween = gsap.fromTo(
            proxy,
            { v: prevV, ink: prevInk },
            {
              v: toV,
              ink: toInk,
              ease: "none",
              immediateRender: false,
              scrollTrigger: {
                trigger: node,
                start: "top 80%",
                end: "top 45%",
                scrub: true,
              },
              onUpdate: write,
            }
          );
          prevV = toV;
          prevInk = toInk;
          return tween;
        });

        ScrollTrigger.refresh();

        cleanup = () => {
          tweens.forEach((t) => {
            t.scrollTrigger?.kill();
            t.kill();
          });
        };
      })
      .catch(() => {
        /* gsap failed to load — vars keep their default emerald */
      });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
