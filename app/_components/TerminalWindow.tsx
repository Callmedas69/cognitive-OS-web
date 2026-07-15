import type { ReactNode } from "react";

type TerminalWindowProps = {
  /** Centered mono title in the chrome strip. */
  title?: string;
  /** Terminal body content (prompt line, output, etc). */
  children: ReactNode;
  /** Extra classes for the outer window. */
  className?: string;
  "aria-label"?: string;
  "data-enter"?: boolean;
};

/**
 * macOS-style terminal chrome: traffic-light dots + title strip over a dark
 * mono body. No state, no client JS — pure presentation.
 */
export default function TerminalWindow({
  title = "cognitiveos start",
  children,
  className = "",
  "aria-label": ariaLabel,
  "data-enter": dataEnter,
}: TerminalWindowProps) {
  return (
    <div
      data-enter={dataEnter}
      aria-label={ariaLabel}
      className={`w-full overflow-hidden rounded-xl bg-term-bg shadow-xl ${className}`}
    >
      <div className="relative flex items-center gap-1.5 bg-white/5 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden />
        <span className="absolute inset-x-0 text-center font-mono text-xs text-term-muted">
          {title}
        </span>
      </div>
      <div className="overflow-x-auto whitespace-pre px-4 py-3.5 font-mono text-[11px] leading-relaxed text-term-text sm:text-sm">
        {children}
      </div>
    </div>
  );
}
