import type { ReactNode } from "react";
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
  return (
    <div className="flex h-full w-full items-center px-6 py-24 lg:px-12">
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        {/* Left: text */}
        <div className="order-2 lg:order-1">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
            {meta.num} / {meta.name}
          </p>
          <p className="mt-4 font-mono text-sm leading-snug text-text-muted">{meta.bubble}</p>
          <h1 className="mt-2 font-display text-[clamp(40px,6.2vw,96px)] leading-[0.92] tracking-wide text-balance text-text">
            {headline}
          </h1>
          <span className="mt-5 block h-1 w-14 rounded-full bg-mood" aria-hidden />
          <div className="mt-6 max-w-[46ch] text-base leading-relaxed text-text">{children}</div>
        </div>

        {/* Right: mascot */}
        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <Mascot size="hero" parallax />
        </div>
      </div>
    </div>
  );
}
