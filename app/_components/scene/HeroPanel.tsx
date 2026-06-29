"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { StopMeta } from "@/content/stops";
import Mascot from "../Mascot";

/**
 * The hero panel (section 01) — a full-viewport horizontal split: the editorial
 * text column on the left, the 0xNull mascot on the right. The headline is a
 * ReactNode so the selling word (FILESYSTEM) can be tinted in the mood ink.
 * Mobile / reduced-motion: the mascot stacks above the text (order classes), and
 * the Mascot component itself falls back to the flat SVG.
 */
export default function HeroPanel({
  meta,
  headline,
  children,
}: {
  meta: StopMeta;
  /** Display headline with the selling word emphasised. */
  headline: ReactNode;
  /** Body: kicker handled here, this is the paragraph + terminal + CTAs. */
  children: ReactNode;
}) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const mqWide = window.matchMedia("(min-width: 900px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isHorizontal = mqWide.matches && !mqMotion.matches;
    if (!isHorizontal) return;

    const onScroll = () => {
      if (window.scrollY > 20) {
        setHasScrolled(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex h-full w-full items-center px-6 py-4 lg:px-12">
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        {/* Left: text */}
        <div className="order-2 lg:order-1">
          <p className="font-mono text-xs tracking-[0.15em] text-text-muted">
            {meta.num} / {meta.name}
          </p>
          <p className="mt-4 font-mono text-sm leading-snug text-text-muted">{meta.bubble}</p>
          <h1 className="mt-2 font-display text-[clamp(40px,6.2vw,96px)] leading-[0.92] tracking-wide text-balance text-text">
            {headline}
          </h1>
          <span className="mt-5 block h-1 w-14 rounded-full bg-mood" aria-hidden />
          <div className="mt-6 max-w-[46ch] text-base leading-relaxed text-text">{children}</div>

          {/* Scroll cue (T-008) */}
          <div
            className={`mt-10 md:flex hidden items-center gap-2 text-xs font-bold text-text-muted transition-opacity duration-500 ease-out select-none ${
              hasScrolled ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            aria-hidden="true"
          >
            <span>Scroll to explore</span>
            <span className="animate-pulse">→</span>
          </div>
        </div>

        {/* Right: mascot */}
        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <Mascot size="hero" parallax />
        </div>
      </div>
    </div>
  );
}
