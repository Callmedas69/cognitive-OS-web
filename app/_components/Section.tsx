"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Disable the fade-up reveal (e.g. hero, which is above the fold). */
  noReveal?: boolean;
  /** Vivid mood color (decorative fills) — read by MoodController via the
   *  data-mood attribute and scrubbed into --mood by GSAP ScrollTrigger. */
  mood?: string;
  /** AA-safe text variant of the mood, drives --mood-ink. */
  moodInk?: string;
  /** Content measure. default = 1100 editorial column; wide = 1280 for
   *  asymmetric splits; full = edge-to-edge (own inner padding). */
  width?: "default" | "wide" | "full";
  /** Emit the standard section vertical padding. Hero sets false to own its
   *  full-viewport centering. */
  padY?: boolean;
};

const WIDTHS = {
  default: "max-w-[1100px]",
  wide: "max-w-[1280px]",
  full: "max-w-none",
} as const;

/**
 * Content container — enforces max-width 1100px + generous vertical rhythm
 * and fades content up ONCE on scroll into view (spec §0: no repeat).
 * Mood colors are emitted as data-mood attributes; MoodController scrubs them
 * into the global --mood / --mood-ink vars with GSAP for a seamless morph.
 */
export default function Section({
  children,
  id,
  className = "",
  noReveal = false,
  mood,
  moodInk,
  width = "default",
  padY = true,
}: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(noReveal);

  // One-shot fade-up reveal.
  useEffect(() => {
    if (noReveal) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [noReveal]);

  return (
    <section
      ref={ref}
      id={id}
      data-mood={mood}
      data-mood-ink={moodInk}
      className={`mx-auto w-full ${WIDTHS[width]} px-6 ${
        padY ? "py-[var(--spacing-section)]" : ""
      } ${
        noReveal ? "" : `reveal ${visible ? "is-visible" : ""}`
      } ${className}`}
    >
      {children}
    </section>
  );
}
