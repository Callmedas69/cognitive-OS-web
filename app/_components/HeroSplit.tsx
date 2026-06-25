"use client";

import Link from "next/link";
import { useRef } from "react";
import Mascot from "./Mascot";
import Terminal from "./Terminal";

type HeroSplitProps = {
  githubUrl: string;
};

/**
 * Asymmetric editorial hero (anti-slop: breaks the centered vertical stack).
 * Left column = oversized display headline + eyebrow + terminal + CTAs (all
 * above the fold). Right column = the 0xNull mascot on a large anchored stage
 * with scroll-parallax. Primary CTA is magnetic (pointer-follow via ref +
 * transform, NOT useState — no re-render per move), gated by reduced-motion.
 */
export default function HeroSplit({ githubUrl }: HeroSplitProps) {
  const magnetRef = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = magnetRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.35;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.35;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => {
    const el = magnetRef.current;
    if (el) el.style.transform = "translate(0,0)";
  };

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
      {/* ── Left: headline + actions ── */}
      <div className="order-2 lg:order-1">
        <p className="mb-6 text-sm font-bold tracking-wide text-mood-ink">
          {"// the thinking is free."}
        </p>

        <h1 className="font-display text-[clamp(44px,8vw,104px)] leading-[0.86] tracking-tight">
          Stop relearning
          <br />
          <span className="text-mood-ink">your own project</span>
        </h1>

        <p className="mt-8 max-w-[46ch] text-base leading-relaxed text-text-muted">
          An AI filesystem for developers with executive dysfunction. Open your
          laptop and know exactly what to do.
        </p>

        <div className="mt-10 max-w-md">
          <Terminal command="npx cognitiveos init" cursor />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            ref={magnetRef}
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onPointerMove={onMove}
            onPointerLeave={reset}
            className="inline-block rounded-[6px] bg-emerald px-7 py-3.5 text-sm font-bold text-[#06281d] transition-[transform,opacity] duration-200 ease-out will-change-transform hover:opacity-90"
          >
            View on GitHub →
          </a>
          <Link
            href="/docs"
            className="text-sm text-mood-ink underline-offset-4 hover:underline"
          >
            Read the docs
          </Link>
        </div>
      </div>

      {/* ── Right: mascot stage ── */}
      <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
        <Mascot size="hero" parallax />
      </div>
    </div>
  );
}
