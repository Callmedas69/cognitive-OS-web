"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const GITHUB_URL = "https://github.com/Callmedas69/cognitive-OS";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-bg/85 backdrop-blur-sm transition-colors ${
        scrolled ? "border-b border-border" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          cognitive<span className="text-emerald">OS</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/docs"
            className="text-text-muted transition-colors hover:text-text"
          >
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
      </nav>
    </header>
  );
}
