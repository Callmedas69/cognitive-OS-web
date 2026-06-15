"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Disable the fade-up reveal (e.g. hero, which is above the fold). */
  noReveal?: boolean;
};

/**
 * Content container — enforces max-width 1100px + generous vertical rhythm,
 * and fades content up ONCE on scroll into view (spec §0: no repeat).
 */
export default function Section({ children, id, className = "", noReveal = false }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(noReveal);

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
      className={`mx-auto w-full max-w-[1100px] px-6 py-[var(--spacing-section)] ${
        noReveal ? "" : `reveal ${visible ? "is-visible" : ""}`
      } ${className}`}
    >
      {children}
    </section>
  );
}
