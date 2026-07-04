"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * 0xNull hero mascot. The 2D SVG renders immediately (SSR / no-JS / mobile /
 * reduced-motion fallback). On a capable desktop with motion allowed, the
 * Three.js scene is lazy-imported and fades in over the SVG — so Three.js
 * stays out of the initial bundle and never blocks the hero (spec §2.5).
 */
type MascotProps = {
  /** Stage size. hero = big anchored stage; default = inline. */
  size?: "default" | "hero";
  /** Enable scroll-driven parallax drift (hero only). */
  parallax?: boolean;
};

export default function Mascot({ size = "default", parallax = false }: MascotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);

  // Scroll-parallax drift — translateY tied to scroll, rAF-throttled, gated by
  // reduced-motion. Only the hero stage opts in.
  useEffect(() => {
    if (!parallax) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = stageRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = Math.min(window.scrollY, 600) * 0.12;
        el.style.setProperty("--parallax", `${y}px`);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [parallax]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 600px)").matches;
    if (reduced || small) return; // keep the 2D SVG

    let disposed = false;
    let handle: { resize: () => void; dispose: () => void } | null = null;

    import("./mascot/scene")
      .then(async ({ createMascot }) => {
        if (disposed || !canvasRef.current) return;
        handle = await createMascot(canvasRef.current, { reducedMotion: false });
        if (disposed) {
          handle.dispose();
          return;
        }
        const onResize = () => handle?.resize();
        window.addEventListener("resize", onResize);
        handle.resize();
        setEnhanced(true);
        // store remover on handle for cleanup
        const baseDispose = handle.dispose;
        handle.dispose = () => {
          window.removeEventListener("resize", onResize);
          baseDispose();
        };
      })
      .catch(() => {
        /* WebGL unavailable / import failed — 2D SVG stays */
      });

    return () => {
      disposed = true;
      handle?.dispose();
    };
  }, []);

  const stageSize =
    size === "hero"
      ? "h-[175px] w-[175px] sm:h-[238px] sm:w-[238px] lg:h-[288px] lg:w-[288px]"
      : "h-[88px] w-[88px] sm:h-[113px] sm:w-[113px]";

  return (
    <div
      ref={stageRef}
      className={`relative ${stageSize}`}
      style={parallax ? { transform: "translateY(var(--parallax,0))" } : undefined}
    >
      <Image
        src="/0xnull.svg"
        alt="0xNull, the cognitiveOS mascot"
        width={230}
        height={230}
        priority
        className={`mascot-float pointer-events-none absolute inset-0 h-full w-full select-none transition-opacity duration-500 ${
          enhanced ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden={enhanced}
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
          enhanced ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />
    </div>
  );
}
