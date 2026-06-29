"use client";

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      onClick={(event) => {
        const target = document.getElementById("main-content");
        if (!target) return;
        event.preventDefault();
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: "start" });
        window.history.replaceState(null, "", "#main-content");
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded-lg focus:bg-emerald focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#06281d]"
    >
      Skip to main content
    </a>
  );
}