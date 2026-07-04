"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

  useGSAP(() => {
    if (!containerRef.current) return;
    const chars = gsap.utils.toArray<HTMLElement>('.tagline-char', containerRef.current);
    const cursor = containerRef.current.querySelector('.tagline-cursor');
    const root = document.documentElement;
    const ease = gsap.parseEase("power2.out");

    if (discrete) {
      // Vertical fallback: trigger once when scrolled into view
      gsap.fromTo(
        chars,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.02,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          },
        }
      );
      if (cursor) {
        gsap.fromTo(
          cursor,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.4,
            delay: 0.9,
          }
        );
      }
    } else {
      // Horizontal mode: read scrubbed --footer-reveal variable directly
      const onTick = () => {
        const revealStr = root.style.getPropertyValue('--footer-reveal');
        if (!revealStr) return;
        const reveal = parseFloat(revealStr);

        chars.forEach((char, i) => {
          const d = (i / Math.max(chars.length - 1, 1)) * 0.45;
          const p = gsap.utils.clamp(0, 1, (reveal - d) / 0.5);
          const easedP = ease(p);
          gsap.set(char, { yPercent: (1 - easedP) * 115 });
        });
        if (cursor) {
          gsap.set(cursor, { opacity: reveal });
        }
      };

      gsap.ticker.add(onTick);
      return () => gsap.ticker.remove(onTick);
    }
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
