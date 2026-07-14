"use client";

import { useSyncExternalStore, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

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

export type Stop = { id: string; num: string; name: string; icon: string };

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

  // Portal to <body> so this fixed bar lives outside ScrollSmoother's transformed
  // #smooth-content (a fixed child of a transformed element scrolls with it).
  const mounted = useMounted();
  const iconsRef = useRef<(HTMLImageElement | null)[]>([]);
  const containerRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!mounted || !containerRef.current || !lineRef.current) return;
    const ol = containerRef.current;
    const totalStops = stops.length;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const quickToVars = { duration: prefersReduced ? 0 : 0.15, ease: "power2.out" };

    const scaleXTo = iconsRef.current.map((icon) =>
      icon ? gsap.quickTo(icon, "scaleX", quickToVars) : null
    );
    const scaleYTo = iconsRef.current.map((icon) =>
      icon ? gsap.quickTo(icon, "scaleY", quickToVars) : null
    );
    const yTo = iconsRef.current.map((icon) =>
      icon ? gsap.quickTo(icon, "y", quickToVars) : null
    );
    const setIcon = (i: number, scale: number, y: number) => {
      scaleXTo[i]?.(scale);
      scaleYTo[i]?.(scale);
      yTo[i]?.(y);
    };
    const resetIcons = () => {
      iconsRef.current.forEach((icon, i) => icon && setIcon(i, 1, 0));
    };

    let lastProgress = "";
    const onTick = () => {
      const progressStr = document.documentElement.style.getPropertyValue("--village-progress");
      if (!progressStr || progressStr === lastProgress) return;
      lastProgress = progressStr;
      const lineSeg = parseFloat(progressStr) * totalStops;
      const lineP = gsap.utils.clamp(0, 1, lineSeg / Math.max(1, totalStops - 1));
      gsap.set(lineRef.current, { scaleX: lineP });
    };

    onTick();
    gsap.ticker.add(onTick);

    const onRefresh = () => {
      lastProgress = "";
      onTick();
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const onMouseMove = (e: MouseEvent) => {
      iconsRef.current.forEach((icon, i) => {
        if (!icon) return;
        const rect = icon.getBoundingClientRect();
        const dist = Math.abs(e.clientX - (rect.x + rect.width / 2));
        const scale = Math.max(1, Math.min(1.6, gsap.utils.mapRange(0, 150, 1.6, 1, dist)));
        const y = Math.min(0, Math.max(-10, gsap.utils.mapRange(0, 150, -10, 0, dist)));
        setIcon(i, scale, y);
      });
    };

    const onFocusIn = (e: FocusEvent) => {
      const button = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-timeline-index]");
      if (!button) return;
      const focused = Number(button.dataset.timelineIndex);
      iconsRef.current.forEach((icon, i) =>
        icon && setIcon(i, i === focused ? 1.35 : 1, i === focused ? -7 : 0)
      );
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!ol.contains(e.relatedTarget as Node | null)) resetIcons();
    };

    ol.addEventListener("mousemove", onMouseMove);
    ol.addEventListener("mouseleave", resetIcons);
    ol.addEventListener("focusin", onFocusIn);
    ol.addEventListener("focusout", onFocusOut);

    return () => {
      gsap.ticker.remove(onTick);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      ol.removeEventListener("mousemove", onMouseMove);
      ol.removeEventListener("mouseleave", resetIcons);
      ol.removeEventListener("focusin", onFocusIn);
      ol.removeEventListener("focusout", onFocusOut);
    };
  }, [mounted, stops.length]);

  const nav = (
    <nav
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
                className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-1 font-mono text-[10px] transition-all duration-200 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald ${
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
                    className="h-full w-full object-contain pointer-events-none"
                  />
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
