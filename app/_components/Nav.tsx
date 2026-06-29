"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

const GITHUB_URL = "https://github.com/Callmedas69/cognitive-OS";

// Top-bar labels map to a section index. Clicking dispatches `scene:jump` so
// the SceneStage engine scrolls to that section (a native #anchor cannot, since
// sections live inside the pinned, translated horizontal track).
const HOME_LINKS: { label: string; stop: number }[] = [
  { label: "Overview", stop: 0 },
  { label: "The Problem", stop: 1 },
  { label: "How It Works", stop: 2 },
  { label: "Six Zones", stop: 3 },
  { label: "Commands", stop: 4 },
  { label: "Open Source", stop: 5 },
];

function jumpToStop(stop: number) {
  window.dispatchEvent(new CustomEvent("scene:jump", { detail: stop }));
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Initialize theme from HTML element (which anti-FOUC script modified)
  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    if (isLight) {
      setTimeout(() => setIsDark(false), 0);
    }
  }, []);

  // Listen for Escape key to close the mobile menu
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

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new CustomEvent("theme:change", { detail: { isDark: nextDark } }));
  };

  const handleJump = (stop: number) => {
    setOpen(false);
    jumpToStop(stop);
  };

  return (
    <header
      className={`${
        isHome ? "fixed inset-x-0" : "sticky"
      } top-0 z-50 bg-bg/85 backdrop-blur-sm transition-colors ${
        scrolled || open ? "border-b border-border" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-4 px-6">
        <Link href="/" className="shrink-0 text-lg font-bold tracking-tight">
          cognitive<span className="text-emerald-ink">OS</span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {isHome ? (
            <>
              <div className="hidden items-center gap-5 overflow-x-auto text-sm lg:flex">
                {HOME_LINKS.map((l) => (
                  <button
                    key={l.label}
                    type="button"
                    onClick={() => jumpToStop(l.stop)}
                    className="whitespace-nowrap text-text-muted transition-colors hover:text-text cursor-pointer"
                  >
                    {l.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => jumpToStop(6)}
                  className="whitespace-nowrap rounded-lg bg-emerald px-3.5 py-1.5 font-bold text-[#06281d] transition-opacity hover:opacity-90 cursor-pointer"
                >
                  Get Started
                </button>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap text-text-muted transition-colors hover:text-text"
                >
                  GitHub
                </a>
              </div>

              <button
                ref={buttonRef}
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-label="Toggle menu"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-text-muted hover:text-text lg:hidden focus:outline-none focus:ring-2 focus:ring-emerald cursor-pointer"
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
            </>
          ) : (
            <div className="flex items-center gap-6 text-sm">
              <Link href="/docs" className="text-text-muted transition-colors hover:text-text">
                Docs
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted transition-colors hover:text-text"
              >
                GitHub
              </a>
            </div>
          )}

          {/* Theme Toggle (visible on all viewports) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-muted hover:text-text focus:outline-none focus:ring-2 focus:ring-emerald cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? (
              /* Sun icon (when dark, show sun to toggle to light) */
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              /* Moon icon (when light, show moon to toggle to dark) */
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isHome && open && (
        <div className="fixed inset-x-0 bottom-0 top-14 z-40 flex flex-col gap-6 bg-bg/95 px-6 py-8 backdrop-blur-md lg:hidden overflow-y-auto">
          <div className="flex flex-col gap-4">
            {HOME_LINKS.map((l) => (
              <button
                key={l.label}
                type="button"
                onClick={() => handleJump(l.stop)}
                className="text-left text-lg font-medium text-text-muted transition-colors hover:text-text py-2"
              >
                {l.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleJump(6)}
              className="text-left text-lg font-bold text-emerald-ink transition-colors hover:opacity-90 py-2"
            >
              Get Started
            </button>
            <Link
              href="/docs"
              onClick={() => setOpen(false)}
              className="text-left text-lg font-medium text-text-muted transition-colors hover:text-text py-2"
            >
              Docs
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="text-left text-lg font-medium text-text-muted transition-colors hover:text-text py-2"
            >
              GitHub
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
