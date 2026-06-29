"use client";

import { useState } from "react";

type TerminalProps = {
  /** The command shown after the emerald prompt. */
  command: string;
  /** Optional muted label to the right (e.g. "one-time setup"). */
  label?: string;
  /** Show the blinking cursor after the command (hero use). */
  cursor?: boolean;
};

/**
 * The signature element: dark contrast block, mono, emerald prompt,
 * copy-to-clipboard with "copied ✓" feedback. Reused in hero + quickstart.
 */
export default function Terminal({ command, label, cursor = false }: TerminalProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — no-op, command is still visible */
    }
  };

  return (
    <div className="group flex w-full items-center gap-3 overflow-x-auto rounded-[10px] bg-term-bg px-4 py-3.5 text-term-text">
      <code className="flex-1 whitespace-nowrap text-sm">
        <span className="text-term-green select-none">$ </span>
        {command}
        {cursor && <span className="cursor" aria-hidden />}
      </code>
      {label && (
        <span className="hidden shrink-0 text-xs text-term-text/40 sm:inline">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : `Copy command: ${command}`}
        className="shrink-0 rounded-[6px] px-2 py-1 text-xs text-term-text/60 transition-colors hover:bg-white/10 hover:text-term-text"
      >
        {copied ? "copied ✓" : "copy"}
      </button>
    </div>
  );
}
