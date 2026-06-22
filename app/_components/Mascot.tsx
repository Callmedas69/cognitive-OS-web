"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * 0xNull hero mascot. The 2D SVG renders immediately (SSR / no-JS / mobile /
 * reduced-motion fallback). On a capable desktop with motion allowed, the
 * Three.js scene is lazy-imported and fades in over the SVG — so Three.js
 * stays out of the initial bundle and never blocks the hero (spec §2.5).
 */
export default function Mascot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enhanced, setEnhanced] = useState(false);

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

  return (
    <div className="relative h-[140px] w-[140px] sm:h-[180px] sm:w-[180px]">
      <Image
        src="/0xnull.svg"
        alt="0xNull, the cognitiveOS mascot"
        width={180}
        height={180}
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
