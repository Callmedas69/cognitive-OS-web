"use client";

import { useEffect, useRef, useState } from "react";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (min: number, max: number, value: number) => Math.min(Math.max(value, min), max);

export default function FooterTagline({ text }: { text: string }) {
  const [discrete, setDiscrete] = useState(false);
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const mqWide = window.matchMedia("(min-width: 900px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const upd = () => setDiscrete(!mqWide.matches || mqMotion.matches);
    upd();
    mqWide.addEventListener("change", upd);
    mqMotion.addEventListener("change", upd);
    return () => {
      mqWide.removeEventListener("change", upd);
      mqMotion.removeEventListener("change", upd);
    };
  }, []);

  const words = text.split(" ");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const chars = Array.from(container.querySelectorAll<HTMLElement>(".tagline-char"));
    const cursor = container.querySelector<HTMLElement>(".tagline-cursor");
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      chars.forEach((char) => { char.style.transform = "translateY(0)"; });
      if (cursor) cursor.style.opacity = "1";
      return;
    }

    if (discrete) {
      chars.forEach((char) => {
        char.style.transform = "translateY(115%)";
        char.style.transition = "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)";
      });
      if (cursor) cursor.style.opacity = "0";

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          chars.forEach((char, i) => {
            char.style.transitionDelay = `${i * 20}ms`;
            char.style.transform = "translateY(0)";
          });
          if (cursor) {
            cursor.style.transition = "opacity 400ms ease-out 900ms";
            cursor.style.opacity = "1";
          }
          obs.disconnect();
        },
        { threshold: 0.15 }
      );
      obs.observe(container);
      return () => obs.disconnect();
    }

    let raf = 0;
    const tick = () => {
      const revealStr = root.style.getPropertyValue("--footer-reveal");
      if (revealStr) {
        const reveal = parseFloat(revealStr);
        chars.forEach((char, i) => {
          const d = (i / Math.max(chars.length - 1, 1)) * 0.45;
          const p = clamp(0, 1, (reveal - d) / 0.5);
          char.style.transform = `translateY(${(1 - easeOut(p)) * 115}%)`;
        });
        if (cursor) cursor.style.opacity = String(reveal);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [discrete]);

  return (
    <p
      ref={containerRef}
      aria-label={text}
      className="font-display text-[clamp(48px,9vw,120px)] leading-[0.9] tracking-wide text-mood-ink"
    >
      <span aria-hidden>
        {words.map((word, wi) => (
          <span key={wi}>
            {wi > 0 && " "}
            <span className="tagline-word">
              {Array.from(word).map((ch, ci) => (
                <span key={ci} className="tagline-char">
                  {ch}
                </span>
              ))}
            </span>
          </span>
        ))}
        <span className="tagline-cursor cursor" />
      </span>
    </p>
  );
}
