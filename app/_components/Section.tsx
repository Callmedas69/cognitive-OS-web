"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Disable the fade-up reveal (e.g. hero, which is above the fold). */
  noReveal?: boolean;
  /** When this section is centered in the viewport, drive the global --mood
   *  accent to this color (scroll-driven 0xNull mood). */
  mood?: string;
};

/**
 * Content container — enforces max-width 1100px + generous vertical rhythm,
 * fades content up ONCE on scroll into view (spec §0: no repeat), and
 * optionally sets the scroll-driven --mood accent while centered.
 */
export default function Section({
  children,
  id,
  className = "",
  noReveal = false,
  mood,
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

  // Persistent mood driver — sets --mood when this section crosses the
  // viewport center. Skipped under reduced-motion (mood stays at default).
  useEffect(() => {
    if (!mood) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          document.documentElement.style.setProperty("--mood", mood);
        }
      },
      // Only the section nearest the vertical center is "intersecting".
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [mood]);

  return (
    <section
      ref={ref}
      id={id}
      className={`mx-auto w-full max-w-[1100px] px-6 py-[var(--spacing-section)] ${
        noReveal ? "" : `reveal ${visible ? "is-visible" : ""}`
      } ${className}`}
    >
      {children}
    </section>
  );
}
