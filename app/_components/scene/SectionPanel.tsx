import type { ReactNode } from "react";
import type { StopMeta } from "@/content/stops";

/**
 * One full-viewport section of the horizontal deck: a numbered eyebrow, a
 * one-line kicker, the display headline tinted in the section's accent ink, an
 * accent rule, then the section body. Self-tinted from `meta` so each panel
 * reads on its own. The scroll engine (SceneStage) owns layout + motion.
 */
export default function SectionPanel({
  meta,
  children,
}: {
  meta: StopMeta;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center px-6 py-4">
      <div className="w-full max-w-[680px]">
        <p className="font-mono text-xs tracking-[0.15em] text-text-muted">
          {meta.num} / {meta.name}
        </p>
        <p className="mt-4 font-mono text-sm leading-snug text-text-muted">{meta.bubble}</p>
        <h2
          className="mt-2 font-display text-[clamp(40px,6vw,92px)] leading-[0.92] tracking-wide text-balance"
          style={{
            color: `color-mix(in srgb, var(--reveal-initial) calc((1 - var(--reveal, 0)) * 100%), ${meta.accentInk} calc(var(--reveal, 0) * 100%))`,
          }}
        >
          {meta.headline}
        </h2>
        <span
          className="mt-5 block h-1 w-14 rounded-full"
          style={{
            background: `color-mix(in srgb, var(--reveal-initial) calc((1 - var(--reveal, 0)) * 100%), ${meta.accent} calc(var(--reveal, 0) * 100%))`,
          }}
          aria-hidden
        />
        <div className="mt-6 text-base leading-relaxed text-text">{children}</div>
      </div>
    </div>
  );
}
