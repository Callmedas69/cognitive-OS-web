/**
 * Big-numeral editorial stat (anti-slop: distinct family from the text-column
 * sections). The "15-45 minutes" tax rendered as an oversized display figure,
 * with the context line set tight beside it. Server component — no motion state.
 */
type StatBlockProps = {
  value: string;
  unit: string;
  caption: string;
};

export default function StatBlock({ value, unit, caption }: StatBlockProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-6">
      <span
        className="font-display leading-[0.8] tracking-tight text-mood-ink text-[length:var(--text-numeral)]"
        aria-hidden
      >
        {value}
      </span>
      <span className="mb-2 flex flex-col">
        <span className="font-display text-[length:var(--text-h2)] leading-none tracking-wide">
          {unit}
        </span>
        <span className="mt-3 max-w-[34ch] text-sm leading-relaxed text-text-muted">
          {caption}
        </span>
      </span>
    </div>
  );
}
