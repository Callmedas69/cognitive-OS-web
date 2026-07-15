"use client";

import { useEffect, useRef } from "react";

/**
 * Always-visible scroll-progress bar pinned at the viewport top. Its width
 * tracks native scroll progress; its color follows the live --mood var.
 * Kept GSAP-free because it is persistent chrome, not scene choreography.
 */
export default function MoodBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(window.scrollY / max, 0), 1);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed left-0 top-0 z-[60] h-[3px] bg-mood origin-left scale-x-0 w-full"
      aria-hidden
    />
  );
}
