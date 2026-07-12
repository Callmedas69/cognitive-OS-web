"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GITHUB_URL = "https://github.com/Callmedas69/cognitive-OS";

function jumpToStop(stop: number) {
  window.dispatchEvent(new CustomEvent("scene:jump", { detail: stop }));
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const yToRef = useRef<((v: number) => void) | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Direction-aware autohide with hysteresis: hide after sustained downward
  // travel, reveal after a shorter upward travel, always visible near the top.
  // Accumulating travel (instead of comparing per-event deltas) stops the nav
  // from flickering on trackpad micro-adjustments and momentum-end bounce;
  // a single direction jiggle resets the accumulator and never toggles.
  // Driven by ScrollTrigger's self.scroll() rather than window.scrollY so the
  // slide stays synced to ScrollSmoother's eased position instead of snapping
  // ahead of the deck (self.scroll() resolves through the smoother's
  // scrollerProxy — same path MoodBar already rides — and falls back to
  // native scroll on /docs and under reduced motion). Hide state lives in a
  // plain closure var (not React state) so onUpdate never triggers a
  // re-render; the slide itself is a GSAP quickTo tween on yPercent, so it
  // eases continuously alongside the deck instead of snapping via a CSS class.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    // .js-entrance-hide (opacity 0, y 12) is only ever cleared by SceneStage's
    // entrance timeline, which mounts on the home page alone — on a direct
    // /docs (or any non-home) load nothing reveals the header, so it stays
    // invisible forever. Reveal it here instead; on home the entrance owns it.
    if (window.location.pathname !== "/") gsap.set(header, { opacity: 1, y: 0 });
    const HIDE_AFTER = 96; // px of downward travel before hiding
    const SHOW_AFTER = 28; // px of upward travel before revealing
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const yTo = gsap.quickTo(header, "yPercent", {
      duration: prefersReduced ? 0 : 0.45,
      ease: "power3.out",
    });
    yToRef.current = yTo;

    let hidden = false;
    let travel = 0;
    const setHiddenState = (v: boolean) => {
      if (v === hidden) return;
      hidden = v;
      yTo(v ? -100 : 0);
      header.style.pointerEvents = v ? "none" : "auto";
    };

    let lastY = 0;
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        const delta = y - lastY;
        lastY = y;
        setScrolled(y > 8);
        if (y <= 64) {
          setHiddenState(false);
          travel = 0;
          return;
        }
        if ((delta > 0 && travel < 0) || (delta < 0 && travel > 0)) travel = 0;
        travel += delta;
        if (travel > HIDE_AFTER) setHiddenState(true);
        else if (travel < -SHOW_AFTER) setHiddenState(false);
      },
    });
    lastY = trigger.scroll();
    setScrolled(lastY > 8);

    return () => trigger.kill();
  }, []);

  // Mobile menu open forces the nav visible — last writer wins over whatever
  // the scroll hysteresis above last set.
  useEffect(() => {
    if (open) yToRef.current?.(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const handleGetStarted = () => {
    setOpen(false);
    if (isHome) {
      jumpToStop(6);
    }
  };

  const linkClass =
    "whitespace-nowrap text-text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald";
  const startClass =
    "whitespace-nowrap rounded-lg bg-emerald px-3.5 py-1.5 font-bold text-[#06281d] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald cursor-pointer";
  const mobileLinkClass =
    "text-left text-lg font-medium text-text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald py-2";

  return (
    <header
      ref={headerRef}
      className={`js-entrance-hide ${
        isHome ? "fixed inset-x-0" : "sticky"
      } top-0 z-50 chrome-glass backdrop-blur-sm transition-[border-color] duration-400 ease-out ${
        scrolled || open ? "border-b border-border" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
        >
          cognitive<span className="text-emerald-ink">OS</span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <div className="hidden items-center gap-5 text-sm lg:flex">
            <Link href="/docs" className={linkClass}>
              Docs
            </Link>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
              GitHub
            </a>
            {isHome ? (
              <button type="button" onClick={handleGetStarted} className={startClass}>
                Get Started
              </button>
            ) : (
              <Link href="/" className={startClass}>
                Get Started
              </Link>
            )}
          </div>

          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-text-muted hover:text-text focus:outline-none focus:ring-2 focus:ring-emerald lg:hidden cursor-pointer"
          >
            {open ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-14 z-40 flex flex-col gap-6 overflow-y-auto bg-bg/95 px-6 py-8 backdrop-blur-md lg:hidden">
          <div className="flex flex-col gap-4">
            {isHome ? (
              <button
                type="button"
                onClick={handleGetStarted}
                className="text-left text-lg font-bold text-emerald-ink transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald py-2"
              >
                Get Started
              </button>
            ) : (
              <Link href="/" onClick={() => setOpen(false)} className="text-left text-lg font-bold text-emerald-ink transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald py-2">
                Get Started
              </Link>
            )}
            <Link href="/docs" onClick={() => setOpen(false)} className={mobileLinkClass}>
              Docs
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={mobileLinkClass}
            >
              GitHub
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
