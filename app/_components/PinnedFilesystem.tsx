"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ZoneTree from "./ZoneTree";

export default function PinnedFilesystem() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Check if the user prefers reduced motion. If so, skip pinning and animation.
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>('.tree-row');
      
      if (rows.length === 0) return;

      // Dim all rows initially
      gsap.set(rows, { opacity: 0.3 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          start: "center center",
          end: "+=250%",
          scrub: 1,
        }
      });

      // Walk through each row sequentially
      rows.forEach((row, i) => {
        // Brighten the current row
        tl.to(row, { opacity: 1, duration: 0.5 }, i);
        // Dim the previous row, unless it's the first one being shown
        if (i > 0) {
          tl.to(rows[i - 1], { opacity: 0.3, duration: 0.5 }, i);
        }
      });

      // Stay on the last item for a moment
      tl.to({}, { duration: 1 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] w-full">
      <div>
        <h2 className="font-display text-[length:var(--text-h2)] leading-[0.9] tracking-wide text-mood-ink">
          The filesystem is the fix
        </h2>
        <span className="mt-4 block h-1 w-12 rounded-full bg-mood" aria-hidden />
        <p className="mt-8 max-w-[44ch] text-base leading-relaxed text-text-muted">
          Each folder is one cognitive mode. Your agent reads it
          automatically. You never decide where to look.
        </p>
      </div>
      <ZoneTree />
    </div>
  );
}
