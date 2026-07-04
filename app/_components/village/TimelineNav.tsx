"use client";

import { useSyncExternalStore, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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

// How long the ticker keeps running after scroll stops, so the icon-scale
// ease-out has time to settle instead of freezing mid-tween.
const TICKER_SETTLE_S = 0.2;

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
    
    // Ticker logic: drives continuous scale from --village-progress
    const onTick = () => {
      const root = document.documentElement;
      const pStr = root.style.getPropertyValue('--village-progress');
      if (!pStr) return;
      
      const rawP = parseFloat(pStr);
      
      // Global progress spans (totalStops) segments (because footer adds 1 panel).
      // So current segment = rawP * totalStops.
      // Timeline only spans (totalStops - 1) segments.
      const seg = rawP * totalStops;
      const timelineP = gsap.utils.clamp(0, 1, seg / Math.max(1, totalStops - 1));
      
      // Update the progress line (hardware accelerated scaleX)
      gsap.set(lineRef.current, { scaleX: timelineP });
      
      if (isHovering.current) return; // Let mousemove take over icons
      
      const segmentDist = 1 / Math.max(1, totalStops - 1);
      
      iconsRef.current.forEach((icon, i) => {
        if (!icon) return;
        
        const stopP = i / Math.max(1, totalStops - 1);
        const dist = Math.abs(timelineP - stopP);
        
        // Map distance (0 -> 1 segment) to scale (1.5 -> 1)
        const scale = gsap.utils.mapRange(0, segmentDist, 1.5, 1, dist);
        const clampedScale = Math.max(1, Math.min(1.5, scale));
        const yOffset = (1 - clampedScale) * 10; // slightly up when larger
        
        // Fast tween to handle both continuous scrub and discrete fallback snaps
        gsap.to(icon, {
          scale: clampedScale,
          y: yOffset,
          duration: 0.15,
          ease: "power2.out",
          overwrite: "auto"
        });
      });
    };
    
    // Run once immediately so the line/icons reflect current state on mount
    // and on every discrete `active` change (vertical-mode fallback), without
    // needing a continuously-running ticker for those infrequent updates.
    onTick();

    // Gate the continuous ticker to only run while the page is actually
    // scrolling (horizontal mode's dominant case) — polling --village-progress
    // and tweening 7 icons on every animation frame forever, even fully idle,
    // was a real battery/CPU cost with no user-facing benefit at rest.
    let cancelled = false;
    let teardownScrollGate = () => {};
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const onScrollStart = () => gsap.ticker.add(onTick);
      const onScrollEnd = () => {
        gsap.delayedCall(TICKER_SETTLE_S, () => gsap.ticker.remove(onTick));
      };
      ScrollTrigger.addEventListener("scrollStart", onScrollStart);
      ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);
      teardownScrollGate = () => {
        ScrollTrigger.removeEventListener("scrollStart", onScrollStart);
        ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
      };
    });

    const onMouseMove = (e: MouseEvent) => {
      iconsRef.current.forEach((icon) => {
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

        gsap.to(icon, {
          scale: clampedScale,
          y: clampedY,
          duration: 0.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    };

    const onMouseEnter = () => {
      isHovering.current = true;
    };

    const onMouseLeave = () => {
      isHovering.current = false;
      // The ticker will instantly resume easing the icons back to their scroll-based state.
    };

    ol.addEventListener("mouseenter", onMouseEnter);
    ol.addEventListener("mousemove", onMouseMove);
    ol.addEventListener("mouseleave", onMouseLeave);
    
    return () => {
      cancelled = true;
      teardownScrollGate();
      gsap.ticker.remove(onTick);
      ol.removeEventListener("mouseenter", onMouseEnter);
      ol.removeEventListener("mousemove", onMouseMove);
      ol.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [mounted, stops.length, active]);

  const nav = (
    <nav
      aria-label="Journey stops"
      className="entrance-fade entrance-fade-delay-2 chrome-glass fixed inset-x-0 bottom-0 z-40 backdrop-blur-sm"
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
