"use client";

import { useEffect, useState } from "react";

/**
 * Always-visible scroll-progress bar pinned at the viewport top. Its width
 * tracks scroll progress; its color follows the live --mood var (vivid fill —
 * a bar, not text, so no contrast concern). Color lerps via the html
 * transition in globals.css.
 */
export default function MoodBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-[60] h-[3px] bg-mood transition-[width] duration-150 ease-out"
      style={{ width: `${pct}%` }}
      aria-hidden
    />
  );
}
