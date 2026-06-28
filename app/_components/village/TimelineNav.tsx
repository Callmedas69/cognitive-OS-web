"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

// SSR-safe "are we on the client yet" flag — false during SSR + first hydration
// render (matches server), true afterwards. Avoids a hydration mismatch when the
// portal mounts, without a setState-in-effect.
const emptySubscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

export type Stop = { id: string; num: string; name: string };

type TimelineNavProps = {
  stops: Stop[];
  /** Active stop index (controlled by HorizontalVillage). */
  active: number;
  /** Jump to stop i (engine maps it to the right scroll position). */
  onJump: (i: number) => void;
};

/**
 * Fixed bottom timeline (01-07) with progress line + active-stop highlight.
 * Presentational/controlled: the HorizontalVillage engine owns active state and
 * the jump behavior (scroll position differs between horizontal pin and the
 * vertical fallback).
 */
export default function TimelineNav({ stops, active, onJump }: TimelineNavProps) {
  // Active may exceed the last stop (e.g. the footer panel) — clamp to range.
  const a = Math.min(Math.max(active, 0), stops.length - 1);
  const pct = stops.length > 1 ? (a / (stops.length - 1)) * 100 : 0;

  // Portal to <body> so this fixed bar lives outside ScrollSmoother's transformed
  // #smooth-content (a fixed child of a transformed element scrolls with it).
  const mounted = useMounted();

  const nav = (
    <nav
      aria-label="Journey stops"
      className="fixed inset-x-0 bottom-0 z-40 hidden border-t border-border bg-bg/85 backdrop-blur-sm md:block"
    >
      <div className="relative mx-auto max-w-[1100px] px-6 py-3">
        <div className="absolute left-6 right-6 top-[1.15rem] h-px bg-border" aria-hidden />
        <div
          className="absolute left-6 top-[1.15rem] h-px bg-mood transition-[width] duration-300"
          style={{ width: `calc(${pct} * (100% - 3rem) / 100)` }}
          aria-hidden
        />
        <ol className="relative flex items-center justify-between">
          {stops.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onJump(i)}
                aria-current={i === a ? "step" : undefined}
                title={s.name}
                className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-1 font-mono text-[10px] transition-colors ${
                  i === a ? "text-mood-ink" : "text-text-muted hover:text-text"
                }`}
              >
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full border text-[10px] transition-all duration-300 ease-out ${
                    i === a
                      ? "border-transparent bg-mood text-white"
                      : "border-border bg-surface"
                  }`}
                >
                  {s.num}
                </span>
                <span className="hidden lg:block">{s.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );

  if (!mounted) return null;
  return createPortal(nav, document.body);
}
