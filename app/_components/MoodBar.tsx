"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Always-visible scroll-progress bar pinned at the viewport top. Its width
 * tracks scroll progress; its color follows the live --mood var (vivid fill —
 * a bar, not text, so no contrast concern). Color lerps via the html
 * transition in globals.css.
 */
export default function MoodBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        scrub: true,
        start: "top top",
        end: "max"
      }
    });
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed left-0 top-0 z-[60] h-[3px] bg-mood origin-left scale-x-0 w-full"
      aria-hidden
    />
  );
}
