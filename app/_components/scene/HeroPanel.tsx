"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { StopMeta } from "@/content/stops";
import Mascot from "../Mascot";

/**
 * The hero panel (section 01) — a minimal full-viewport split: the promise and
 * install command on the left, 0xNull centered in the right grid column.
 * Mobile / reduced-motion: the mascot stacks above the text, and the Mascot
 * component itself falls back to the flat SVG.
 */
export default function HeroPanel({
  headline,
  children,
  hideMascot = false,
}: {
  meta: StopMeta;
  /** Display headline with the selling word emphasised. */
  headline: ReactNode;
  /** Body: terminal command only after the simplification pass. */
  children: ReactNode;
  /** True in horizontal mode — SceneStage renders the mascot as a fixed overlay instead. */
  hideMascot?: boolean;
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

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex h-full w-full items-center px-6 py-4 lg:px-12">
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        {/* Left: promise + command */}
        <div className="order-2 lg:order-1">
          <h1 className="js-entrance-hide font-display text-[clamp(44px,6.8vw,104px)] leading-[0.9] tracking-wide text-balance text-text">
            {headline}
          </h1>
          <span
            data-hero-scatter="up"
            className="js-entrance-hide mt-6 block h-1 w-14 rounded-full bg-mood"
            aria-hidden
          />
          <div data-hero-scatter="left" className="js-entrance-hide mt-7 max-w-[500px]">
            {children}
          </div>

          {/* Scroll cue — arrow only. The pinned horizontal deck is a
              non-obvious scroll surface, so the affordance stays; the
              redundant "Scroll to explore" label was the AI-slop tell, not
              the arrow itself. */}
          <div
            data-hero-scatter="up"
            className={`mt-10 hidden text-base font-bold text-text-muted transition-opacity duration-500 ease-out select-none md:flex ${
              hasScrolled ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            aria-hidden="true"
          >
            <span className="animate-pulse">→</span>
          </div>
        </div>

        {/* Right: mascot placeholder — the real mascot renders in a fixed
            overlay (SceneStage) so it can dock to the corner independent of
            this grid; horizontal mode reserves the slot so layout doesn't
            shift, vertical/reduced-motion fallback renders it inline. */}
        <div className="order-1 flex items-center justify-center lg:order-2">
          {hideMascot ? (
            <div
              data-mascot-slot
              className="h-[175px] w-[175px] sm:h-[238px] sm:w-[238px] lg:h-[288px] lg:w-[288px]"
              aria-hidden
            />
          ) : (
            <div className="js-entrance-hide" data-entrance-mascot>
              <Mascot size="hero" parallax />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
