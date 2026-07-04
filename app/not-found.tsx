import Link from "next/link";
import Terminal from "./_components/Terminal";

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] bg-bg px-6 pt-28 pb-20 text-text">
      <div className="mx-auto grid max-w-[1040px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-mono text-xs tracking-[0.15em] text-text-muted">404 / lost context</p>
          <h1 className="mt-4 font-display text-[clamp(64px,12vw,150px)] leading-[0.88] tracking-wide text-emerald-ink">
            WRONG FOLDER
          </h1>
          <p className="mt-6 max-w-[44ch] font-body text-lg font-medium leading-[1.7] tracking-[-0.01em] text-text">
            This page is not in the current state. Return home and restart from a known path.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="rounded-lg bg-emerald px-4 py-2 font-mono text-sm font-bold text-[#06281d] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
            >
              Go home
            </Link>
            <Link
              href="/docs"
              className="font-mono text-sm text-text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
            >
              Read docs
            </Link>
          </div>
        </div>
        <div className="max-w-[460px]">
          <Terminal command="npx cognitiveos start" cursor />
        </div>
      </div>
    </main>
  );
}
