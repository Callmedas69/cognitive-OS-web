import Link from "next/link";
import Terminal from "./_components/Terminal";
import SceneStage from "./_components/scene/SceneStage";
import FooterTagline from "./_components/scene/FooterTagline";
import { ZONES } from "@/content/stops";

const GITHUB_URL = "https://github.com/Callmedas69/cognitive-OS";
const NPM_URL = "https://www.npmjs.com/package/cognitiveos";
const X_URL = "https://x.com/Callmedas69";
const FARCASTER_URL = "https://warpcast.com/callmedas69";

// One body node per stop, aligned to STOPS. Number, kicker + headline come from
// the section meta (rendered by SectionPanel / HeroPanel). Copy follows the
// one-idea-per-panel rule from the 2026-07-02 taste audit.
const panels = [
  // 01 Overview (hero body) — the subhead is the mechanism. Without it readers
  // guess "viewer / summarizer"; the pain and the audience alone never say what
  // the thing IS.
  <div key="01">
    <p className="mb-5 text-base leading-snug text-text-muted">
      Plain markdown files your AI agent keeps updated. Come back and it already knows where you
      left off.
    </p>
    <Terminal command="npx cognitiveos init" cursor />
  </div>,

  // 02 The Problem
  <div key="02" className="max-w-[560px]">
    <p
      data-enter
      className="font-display text-[clamp(76px,13vw,168px)] leading-[0.82] tracking-wide"
      style={{ color: "var(--local-ink)" }}
    >
      15-30
    </p>
    <p data-enter className="mt-4 max-w-[26ch] text-2xl leading-tight text-text">
      minutes lost reopening context. Not coding. Recovering.
    </p>
    <p
      data-enter
      className="mt-7 inline-flex rounded-lg bg-surface/65 px-4 py-3 font-mono text-sm font-bold text-text shadow-sm"
    >
      Structure beats willpower.
    </p>
  </div>,

  // 03 How It Works — concrete first, then the payoff made visible. The box is
  // the real `cognitiveos start` output (src/lib/output.ts), not a mock: same
  // labels, same 9-col label gutter. Keep it that way.
  <div key="03">
    <p data-enter className="max-w-[46ch]">
      Plain markdown next to your code. Your agent updates it as you work, and reads it back
      before it touches anything.
    </p>
    <pre
      data-enter
      className="mt-6 w-full overflow-x-auto rounded-[10px] bg-term-bg px-4 py-3.5 font-mono text-[11px] leading-relaxed text-term-text sm:text-sm lg:w-max lg:max-w-none lg:overflow-visible"
      aria-label="Example output of the cognitiveos start command"
    >
      <span className="text-term-green select-none">$ </span>start
      {`
┌─ cognitiveOS ──────────────────────────────────────────┐
│ FOCUS    fix wallet connection bug                     │
│          (projects/my-dapp)                            │
│ LAST     2 days ago                                    │
│ LOOPS    1 open                                        │
│ BLOCKED  waiting on Base RPC key                       │
│ NEXT     open focus/current-task.md                    │
│          done when: wallet connects on Base mainnet    │
└────────────────────────────────────────────────────────┘`}
    </pre>
  </div>,

  // 04 Six Zones
  <div key="04">
    <ul data-enter className="grid gap-3 sm:grid-cols-2">
      {ZONES.map((z) => (
        <li
          key={z.name}
          className="group flex items-center gap-3 rounded-2xl bg-surface/70 px-4 py-3 shadow-sm"
        >
          <span
            className="h-3 w-3 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-125"
            style={{ background: z.color }}
            aria-hidden
          />
          <span className="font-mono text-sm font-bold text-text">{z.name}</span>
        </li>
      ))}
    </ul>
    <p data-enter className="mt-5 max-w-[38ch] font-mono text-sm text-text-muted">
      focus/ holds exactly one task. The architecture makes two impossible.
    </p>
  </div>,

  // 05 Commands
  <div key="05">
    <ul data-enter className="mt-2 flex flex-wrap gap-2 font-mono text-sm font-bold text-text">
      {["init", "start", "dump", "check", "install-skill"].map((c) => (
        <li key={c} className="rounded-lg bg-surface/70 px-4 py-2 shadow-sm">
          {c}
        </li>
      ))}
    </ul>
    <p data-enter className="mt-4 font-mono text-xs text-text-muted">
      init once. then start · dump · check.
    </p>
  </div>,

  // 06 Open Source
  <div key="06">
    <p data-enter>MIT licensed. No servers, accounts, or database. Just markdown on your machine.</p>
    <div data-enter className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-sm">
      <a href={NPM_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-emerald-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald">npm</a>
      <a href={X_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-emerald-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald">X</a>
      <a href={FARCASTER_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-emerald-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald">Farcaster</a>
    </div>
  </div>,

  // 07 Start — the closing CTA should read as strong as the hero's, so reuse
  // the same styled Terminal copy-block instead of naked bold text. The
  // existing-project reassurance stays, demoted to small secondary text under
  // the command.
  <div key="07">
    <div data-enter className="max-w-[400px]">
      <Terminal command="npx cognitiveos init" />
    </div>
    <p data-enter className="mt-3 max-w-[46ch] text-sm leading-snug text-text-muted">
      <Link
        href="/docs/existing-project"
        className="font-medium text-text underline decoration-emerald decoration-2 underline-offset-4 transition-colors hover:text-emerald-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
      >
        Already have a project?
      </Link>{" "}
      cd in and run init. It adds files next to your code and never touches your code.
    </p>
    <div data-enter className="mt-6">
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-lg bg-emerald px-4 py-2 font-mono text-sm font-bold text-[#06281d] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
      >
        View on GitHub →
      </a>
    </div>
  </div>,
];

// Footer — the final horizontal panel, centered to fill the viewport.
const footer = (
  <footer className="flex h-full w-full flex-col items-center justify-center px-6 text-center text-mood-ink">
    <FooterTagline text="// the thinking is free." />
    <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-sm">
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-emerald focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald">GitHub</a>
      <a href={NPM_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-emerald focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald">npm</a>
      <a href={X_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-emerald focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald">X</a>
      <a href={FARCASTER_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-emerald focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald">Farcaster</a>
      <Link href="/docs" className="transition-colors hover:text-emerald focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald">Docs</Link>
    </div>
    <p className="mt-6 font-mono text-xs opacity-60">MIT · built by 0xDas</p>
    <p className="mt-2 font-body text-sm font-medium opacity-60">
      I opened my laptop and knew exactly what to do.
    </p>
  </footer>
);

// Hero headline — PROJECT is the selling word, tinted in the mood ink. Each
// word is its own inline-block tagged with a scatter direction so the hero
// pinned-hold tween (SceneStage) can fly it out of the viewport on scroll.
const heroHeadline = (
  <>
    <span
      data-hero-scatter="up"
      className="mb-4 block font-mono text-sm font-medium tracking-normal text-text-muted"
    >
      the memory for a dev with executive dysfunction
    </span>
    <span data-hero-scatter="up" className="inline-block">STOP</span>{" "}
    <span data-hero-scatter="left" className="inline-block">RELEARNING</span>{" "}
    <span data-hero-scatter="up" className="inline-block">YOUR</span>{" "}
    <span data-hero-scatter="down" className="inline-block">OWN</span>{" "}
    <span data-hero-scatter="down" className="inline-block text-mood-ink">PROJECT</span>
  </>
);

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="relative flex-1">
      <SceneStage panels={panels} footer={footer} heroHeadline={heroHeadline} />
    </main>
  );
}
