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
  const isHovering = useRef(false);

  useGSAP(() => {
    if (!mounted || !containerRef.current || !lineRef.current) return;
    const ol = containerRef.current;
    const totalStops = stops.length;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const quickToVars = { duration: prefersReduced ? 0 : 0.15, ease: "power2.out" };

    // Per-icon quickTo setters for scale + y, created once — shared by both
    // the scroll-driven onTick below and the mousemove hover path, instead
    // of firing a fresh gsap.to() per icon on every frame/mousemove.
    // scaleX/scaleY, NOT the "scale" alias: quickTo's resetTo() looks up the
    // PropTween by name, and CSSPlugin splits "scale" into scaleX+scaleY
    // internally — quickTo(icon, "scale") silently writes nothing.
    const scaleXTo = iconsRef.current.map((icon) =>
      icon ? gsap.quickTo(icon, "scaleX", quickToVars) : null
    );
    const scaleYTo = iconsRef.current.map((icon) =>
      icon ? gsap.quickTo(icon, "scaleY", quickToVars) : null
    );
    const yTo = iconsRef.current.map((icon) => (icon ? gsap.quickTo(icon, "y", quickToVars) : null));
    const setIcon = (i: number, scale: number, y: number) => {
      scaleXTo[i]?.(scale);
      scaleYTo[i]?.(scale);
      yTo[i]?.(y);
    };

    // Dirty-check state for the permanent ticker below: re-read each frame,
    // compared by string, so a frame where neither var changed is a free
    // early return (no icon math, no gsap writes).
    let lastProgress = "";
    let lastIcons = "";

    const onTick = () => {
      const root = document.documentElement;
      const progressStr = root.style.getPropertyValue("--village-progress");
      const iconsStr = root.style.getPropertyValue("--village-icons");
      if (progressStr === lastProgress && iconsStr === lastIcons) return;
      lastProgress = progressStr;
      lastIcons = iconsStr;
      if (!progressStr || !iconsStr) return;

      // Progress line: continuous, straight off --village-progress.
      const lineSeg = parseFloat(progressStr) * totalStops;
      const lineP = gsap.utils.clamp(0, 1, lineSeg / Math.max(1, totalStops - 1));
      gsap.set(lineRef.current, { scaleX: lineP });

      if (isHovering.current) return; // Let mousemove take over icons

      // Icon scale: section-tracking, off --village-icons (same seg+curtain
      // shape as the line used before this was split — holds its peak while
      // a section is centered instead of advancing continuously).
      const iconSeg = parseFloat(iconsStr) * totalStops;
      const iconP = gsap.utils.clamp(0, 1, iconSeg / Math.max(1, totalStops - 1));
      const segmentDist = 1 / Math.max(1, totalStops - 1);

      iconsRef.current.forEach((icon, i) => {
        if (!icon) return;
        const stopP = i / Math.max(1, totalStops - 1);
        const dist = Math.abs(iconP - stopP);
        // Map distance (0 -> 1 segment) to scale (1.5 -> 1)
        const scale = gsap.utils.mapRange(0, segmentDist, 1.5, 1, dist);
        const clampedScale = Math.max(1, Math.min(1.5, scale));
        const yOffset = (1 - clampedScale) * 10; // slightly up when larger
        setIcon(i, clampedScale, yOffset);
      });
    };

    // Run once immediately so the line/icons reflect current state on mount
    // and on every discrete `active` change (vertical-mode fallback).
    onTick();

    // Permanent ticker — not gated to ScrollTrigger's scrollStart/scrollEnd.
    // ScrollSmoother's eased scroll (normalizeScroll: false) emits no native
    // scroll events while it's still settling, so a scrollEnd-based gate died
    // mid-ease on every flick and froze the line/icons during the momentum
    // tail. The dirty check above keeps this effectively free at rest instead.
    gsap.ticker.add(onTick);

    // A ScrollTrigger refresh (resize) can transiently rewrite the line while
    // the pin is reverted, without the CSS vars ever changing — which the
    // dirty check would then never repair. Re-sync once after every refresh.
    const onRefresh = () => {
      lastProgress = "";
      lastIcons = "";
      onTick();
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const onMouseMove = (e: MouseEvent) => {
      iconsRef.current.forEach((icon, i) => {
        if (!icon) return;
        const rect = icon.getBoundingClientRect();
        const iconCenter = rect.x + rect.width / 2;
        const dist = Math.abs(e.clientX - iconCenter);
        // Map distance 0->150px to scale 1.6->1
        const scale = gsap.utils.mapRange(0, 150, 1.6, 1, dist);
        // Clamp scale to max 1.6, min 1
        const clampedScale = Math.max(1, Math.min(1.6, scale));
        // Move slightly up
        const yOffset = gsap.utils.mapRange(0, 150, -10, 0, dist);
        const clampedY = Math.min(0, Math.max(-10, yOffset));
        setIcon(i, clampedScale, clampedY);
      });
    };

    const onMouseEnter = () => {
      isHovering.current = true;
    };

    const onMouseLeave = () => {
      isHovering.current = false;
      // Reset the dirty check and tick immediately so the icons restore to
      // scroll-based state right away instead of waiting for --village-icons
      // to next change.
      lastIcons = "";
      onTick();
    };

    ol.addEventListener("mouseenter", onMouseEnter);
    ol.addEventListener("mousemove", onMouseMove);
    ol.addEventListener("mouseleave", onMouseLeave);

    return () => {
      gsap.ticker.remove(onTick);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      ol.removeEventListener("mouseenter", onMouseEnter);
      ol.removeEventListener("mousemove", onMouseMove);
      ol.removeEventListener("mouseleave", onMouseLeave);
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
