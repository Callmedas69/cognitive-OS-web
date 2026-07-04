"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const GITHUB_URL = "https://github.com/Callmedas69/cognitive-OS";

function jumpToStop(stop: number) {
  window.dispatchEvent(new CustomEvent("scene:jump", { detail: stop }));
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Direction-aware autohide with hysteresis: hide after sustained downward
  // travel, reveal after a shorter upward travel, always visible near the top.
  // Accumulating travel (instead of comparing per-event deltas) stops the nav
  // from flickering on trackpad micro-adjustments and momentum-end bounce;
  // a single direction jiggle resets the accumulator and never toggles.
  useEffect(() => {
    const HIDE_AFTER = 96; // px of downward travel before hiding
    const SHOW_AFTER = 28; // px of upward travel before revealing
    let lastY = window.scrollY;
    let travel = 0; // accumulated travel in the current direction (+down / -up)
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      setScrolled(y > 8);
      if (y <= 64) {
        setHidden(false);
        travel = 0;
        return;
      }
      if ((delta > 0 && travel < 0) || (delta < 0 && travel > 0)) travel = 0;
      travel += delta;
      if (travel > HIDE_AFTER) setHidden(true);
      else if (travel < -SHOW_AFTER) setHidden(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      className={`entrance-fade ${
        isHome ? "fixed inset-x-0" : "sticky"
      } top-0 z-50 chrome-glass backdrop-blur-sm transition-[translate,border-color] duration-400 ease-out ${
        hidden && !open ? "-translate-y-full pointer-events-none" : "translate-y-0"
      } ${scrolled || open ? "border-b border-border" : "border-b border-transparent"}`}
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
