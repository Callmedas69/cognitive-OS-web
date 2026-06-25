/**
 * Numbered editorial row (replaces the banned 3-equal-card grid). A big display
 * numeral anchors each principle; label + constrained body sit beside it in an
 * asymmetric band. Different layout family from every other section.
 */
type PrincipleRowProps = {
  index: string; // "01"
  label: string;
  children: React.ReactNode;
  last?: boolean;
};

export default function PrincipleRow({
  index,
  label,
  children,
  last = false,
}: PrincipleRowProps) {
  return (
    <div
      className={`grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-3 py-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-x-12 ${
        last ? "" : "border-b border-border"
      }`}
    >
      <span
        className="font-display text-[length:var(--text-h1)] leading-[0.8] tracking-tight text-mood/70"
        aria-hidden
      >
        {index}
      </span>
      <div className="pt-2 sm:pt-4">
        <h3 className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-mood-ink">
          {label}
        </h3>
        <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-text-muted">
          {children}
        </p>
      </div>
    </div>
  );
}
