"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DOCS_NAV } from "../_nav";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const list = (
    <ul className="space-y-1">
      {DOCS_NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block rounded-[6px] px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "bg-emerald/10 font-bold text-emerald"
                  : "text-text-muted hover:bg-border/40 hover:text-text"
              }`}
            >
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile disclosure */}
      <div className="mb-6 md:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between rounded-[6px] border border-border px-3 py-2 text-sm"
        >
          <span>Documentation</span>
          <span className="text-text-muted">{open ? "▲" : "▼"}</span>
        </button>
        {open && <nav className="mt-3">{list}</nav>}
      </div>

      {/* Desktop sticky sidebar */}
      <nav className="sticky top-20 hidden w-56 shrink-0 md:block">{list}</nav>
    </>
  );
}
