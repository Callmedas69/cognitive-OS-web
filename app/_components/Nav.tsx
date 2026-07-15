"use client";

import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const GITHUB_URL = "https://github.com/Callmedas69/cognitive-OS";

function jumpToStop(stop: number) {
  window.dispatchEvent(new CustomEvent("scene:jump", { detail: stop }));
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Direction-aware autohide with hysteresis. Vanilla scroll keeps GSAP out of
  // the persistent chrome bundle; the horizontal deck still owns precise scene
  // timing, while the header only needs coarse show/hide behavior.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const HIDE_AFTER = 96;
    const SHOW_AFTER = 28;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    header.style.transition = prefersReduced
      ? "border-color 0ms"
      : "transform 450ms cubic-bezier(0.16, 1, 0.3, 1), border-color 400ms ease-out";

    let hidden = false;
    let travel = 0;
    let lastY = window.scrollY;
    let ticking = false;

    const setHiddenState = (v: boolean) => {
      if (v === hidden) return;
      hidden = v;
      header.style.transform = v ? "translateY(-100%)" : "translateY(0)";
      header.style.pointerEvents = v ? "none" : "auto";
    };

    const update = () => {
      ticking = false;
      const y = window.scrollY;
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
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu open forces the nav visible.
  useEffect(() => {
    if (!open || !headerRef.current) return;
    headerRef.current.style.transform = "translateY(0)";
    headerRef.current.style.pointerEvents = "auto";
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
      jumpToStop(7);
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
      className={`${isHome ? "js-entrance-hide fixed inset-x-0" : "sticky"} top-0 z-50 chrome-glass backdrop-blur-sm ${
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
              <X size={24} weight="bold" aria-hidden />
            ) : (
              <List size={24} weight="bold" aria-hidden />
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
