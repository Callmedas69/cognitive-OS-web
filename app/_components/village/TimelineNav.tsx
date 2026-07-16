"use client";

import { useEffect, useSyncExternalStore, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

const emptySubscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

export type Stop = { id: string; num: string; name: string; icon: string };

type TimelineNavProps = {
  stops: Stop[];
  /** Active stop index (controlled by SceneStage). */
  active: number;
  /** Jump to stop i (engine maps it to the right scroll position). */
  onJump: (i: number) => void;
};

const clamp = (min: number, max: number, value: number) => Math.min(Math.max(value, min), max);
const mapRange = (inMin: number, inMax: number, outMin: number, outMax: number, value: number) => {
  const p = clamp(0, 1, (value - inMin) / Math.max(inMax - inMin, 1));
  return outMin + (outMax - outMin) * p;
};

/** Fixed bottom timeline with progress line + active-stop highlight. */
export default function TimelineNav({ stops, active, onJump }: TimelineNavProps) {
  const a = Math.min(Math.max(active, 0), stops.length - 1);
  const mounted = useMounted();
  const iconsRef = useRef<(HTMLImageElement | null)[]>([]);
  const containerRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mounted || !containerRef.current || !lineRef.current) return;
    const ol = containerRef.current;
    const totalStops = stops.length;
    let raf = 0;
    let lastProgress = "";

    const setIcon = (i: number, scale: number, y: number) => {
      const icon = iconsRef.current[i];
      if (!icon) return;
      icon.style.transform = `translateY(${y}px) scale(${scale})`;
    };

    const resetIcons = () => {
      iconsRef.current.forEach((icon) => {
        if (icon) icon.style.transform = "translateY(0) scale(1)";
      });
    };

    const tick = () => {
      const progressStr = document.documentElement.style.getPropertyValue("--village-progress");
      if (progressStr && progressStr !== lastProgress) {
        lastProgress = progressStr;
        const lineSeg = parseFloat(progressStr) * totalStops;
        const lineP = clamp(0, 1, lineSeg / Math.max(1, totalStops - 1));
        if (lineRef.current) lineRef.current.style.transform = `scaleX(${lineP})`;
      }
      // Fade the nav out as the footer curtain closes (--chrome-hide, driven
      // by SceneStage's scrubbed master timeline) and drop pointer events
      // once it's fully hidden, since it's fixed + z-40 and would otherwise
      // still intercept clicks on the footer links behind it.
      const hide = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--chrome-hide")) || 0;
      if (navRef.current) {
        navRef.current.style.opacity = String(1 - hide);
        navRef.current.style.pointerEvents = hide > 0.99 ? "none" : "";
      }
      raf = requestAnimationFrame(tick);
    };

    const onMouseMove = (e: MouseEvent) => {
      iconsRef.current.forEach((icon, i) => {
        if (!icon) return;
        const rect = icon.getBoundingClientRect();
        const dist = Math.abs(e.clientX - (rect.x + rect.width / 2));
        const scale = clamp(1, 1.6, mapRange(0, 150, 1.6, 1, dist));
        const y = clamp(-10, 0, mapRange(0, 150, -10, 0, dist));
        setIcon(i, scale, y);
      });
    };

    const onFocusIn = (e: FocusEvent) => {
      const button = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-timeline-index]");
      if (!button) return;
      const focused = Number(button.dataset.timelineIndex);
      iconsRef.current.forEach((icon, i) => icon && setIcon(i, i === focused ? 1.35 : 1, i === focused ? -7 : 0));
    };

    const onFocusOut = (e: FocusEvent) => {
      if (!ol.contains(e.relatedTarget as Node | null)) resetIcons();
    };

    raf = requestAnimationFrame(tick);
    ol.addEventListener("mousemove", onMouseMove);
    ol.addEventListener("mouseleave", resetIcons);
    ol.addEventListener("focusin", onFocusIn);
    ol.addEventListener("focusout", onFocusOut);

    return () => {
      cancelAnimationFrame(raf);
      ol.removeEventListener("mousemove", onMouseMove);
      ol.removeEventListener("mouseleave", resetIcons);
      ol.removeEventListener("focusin", onFocusIn);
      ol.removeEventListener("focusout", onFocusOut);
    };
  }, [mounted, stops.length]);

  const nav = (
    <nav
      ref={navRef}
      aria-label="Journey stops"
      className="chrome-glass fixed inset-x-0 bottom-0 z-40 backdrop-blur-sm"
    >
      <div className="relative mx-auto max-w-[1100px] px-6 py-3">
        <div className="absolute left-6 right-6 top-8 h-0.5 bg-border" aria-hidden />
        <div
          ref={lineRef}
          className="absolute left-6 right-6 top-8 h-0.5 bg-mood origin-left scale-x-0"
          aria-hidden
        />
        <ol ref={containerRef} className="relative z-10 flex items-center justify-between">
          {stops.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                data-timeline-index={i}
                onClick={() => onJump(i)}
                aria-current={i === a ? "step" : undefined}
                title={s.name}
                className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-1 font-mono text-[11px] transition-all duration-200 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald ${
                  i === a ? "text-mood-ink" : "text-text-muted hover:text-text"
                }`}
              >
                <span className="relative flex h-10 w-10 place-items-center justify-center transition-transform duration-300 ease-out">
                  <Image
                    ref={(el) => { iconsRef.current[i] = el; }}
                    src={s.icon}
                    alt={s.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-contain pointer-events-none transition-transform duration-200 ease-out"
                  />
                </span>
                <span className={i === a ? "block font-bold" : "hidden lg:block"}>{s.name}</span>
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
