"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`${
        isHome ? "fixed inset-x-0" : "sticky"
      } top-0 z-50 bg-bg/85 backdrop-blur-sm transition-colors ${
        scrolled ? "border-b border-border" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-4 px-6">
        <Link href="/" className="shrink-0 text-lg font-bold tracking-tight">
          cognitive<span className="text-emerald">OS</span>
        </Link>

        {isHome ? (
          <div className="hidden items-center gap-5 overflow-x-auto text-sm lg:flex">
            {HOME_LINKS.map((l) => (
              <button
                key={l.label}
                type="button"
                onClick={() => jumpToStop(l.stop)}
                className="whitespace-nowrap text-text-muted transition-colors hover:text-text"
              >
                {l.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => jumpToStop(6)}
              className="whitespace-nowrap rounded-lg bg-emerald px-3.5 py-1.5 font-bold text-white transition-opacity hover:opacity-90"
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
      </nav>
    </header>
  );
}
