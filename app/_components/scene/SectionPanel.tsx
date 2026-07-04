import type { ReactNode } from "react";
import type { StopMeta } from "@/content/stops";

type SectionLayout = "center" | "split" | "numeral" | "leftAnchor" | "statement";

const shellByLayout: Record<SectionLayout, string> = {
  center: "items-center justify-center px-6 py-4",
  split: "items-center justify-center px-6 py-4 lg:px-12",
  numeral: "items-center justify-center px-6 py-4 lg:px-12",
  // Asymmetric: content hugs the left edge instead of sitting centered.
  leftAnchor: "items-center justify-start px-6 py-4 lg:px-16",
  // Bottom-anchored: the headline reads as a closing statement, not a
  // vertically-centered stack.
  statement: "items-end justify-start px-6 pb-14 lg:px-16",
};

const innerByLayout: Record<SectionLayout, string> = {
  center: "max-w-[680px]",
  split: "grid max-w-[1180px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16",
  numeral: "grid max-w-[1120px] items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14",
  leftAnchor: "max-w-[760px]",
  statement: "max-w-[1400px]",
};

// The body content wrapper (below the shared num/kicker/headline/rule
// metaBlock) — varies by layout so the six sections don't all read as the
// same centered stack.
const contentByLayout: Record<SectionLayout, string> = {
  center: "mt-6 max-w-[58ch] font-body text-lg font-medium leading-[1.75] tracking-[-0.01em] text-text",
  split: "font-body text-lg font-medium leading-[1.75] tracking-[-0.01em] text-text lg:pt-8",
  numeral: "font-body text-lg font-medium leading-[1.75] tracking-[-0.01em] text-text lg:pt-8",
  leftAnchor: "mt-6 font-body text-lg font-medium leading-[1.75] tracking-[-0.01em] text-text",
  statement: "mt-8 max-w-[62ch] font-body text-base font-medium leading-[1.6] tracking-[-0.01em] text-text-muted",
};

// Kicker is dropped only where the headline already says it — "statement"
// (06's "FREE. OPEN SOURCE. YOURS." vs its bubble "MIT. Local files. Your
// machine." is a near-restatement). Every other section's bubble carries
// real distinct information, so it stays. The num/name eyebrow above it
// stays everywhere — it mirrors the timeline nav's real ordered stops.
const kickerVisibleByLayout: Record<SectionLayout, boolean> = {
  center: true,
  split: true,
  numeral: true,
  leftAnchor: true,
  statement: false,
};

// Accent-rule placement varies on the two re-laid sections so the scaffold
// cadence isn't identical six times: leftAnchor moves it above the headline,
// statement drops it (a thin 56px rule reads as token under a full-width
// dominant headline).
const rulePositionByLayout: Record<SectionLayout, "before" | "after" | "none"> = {
  center: "after",
  split: "after",
  numeral: "after",
  leftAnchor: "before",
  statement: "none",
};

/**
 * One full-viewport section of the horizontal deck. Layout stays owned by this
 * component, but panels can opt into a small set of variants so the landing
 * does not repeat the same centered text block six times.
 */
export default function SectionPanel({
  meta,
  children,
  layout = "center",
}: {
  meta: StopMeta;
  children: ReactNode;
  layout?: SectionLayout;
}) {
  const showKicker = kickerVisibleByLayout[layout];
  const rulePosition = rulePositionByLayout[layout];
  const rule = (
    <span
      className="block h-1 w-14 rounded-full"
      style={{ background: "var(--local-accent)" }}
      aria-hidden
    />
  );
  const headlineTopClass = rulePosition === "before" ? "mt-5" : showKicker ? "mt-2" : "mt-5";

  const metaBlock = (
    <div>
      <p data-enter className="font-mono text-xs tracking-[0.15em] text-text-muted">
        {meta.num} / {meta.name}
      </p>
      {showKicker && (
        <p data-enter className="mt-4 max-w-[36ch] font-mono text-sm leading-snug text-text-muted">
          {meta.bubble}
        </p>
      )}
      {rulePosition === "before" && <div className="mt-5">{rule}</div>}
      <h2
        data-enter
        className={`${headlineTopClass} font-display text-[clamp(40px,6vw,92px)] leading-[0.92] tracking-wide text-balance`}
        style={{ color: "var(--local-ink)" }}
      >
        {meta.headline}
      </h2>
      {rulePosition === "after" && <div className="mt-5">{rule}</div>}
    </div>
  );

  return (
    <div className={`flex h-full w-full ${shellByLayout[layout]}`}>
      <div className={`w-full ${innerByLayout[layout]}`}>
        {metaBlock}
        <div data-enter className={contentByLayout[layout]}>
          {children}
        </div>
      </div>
    </div>
  );
}
