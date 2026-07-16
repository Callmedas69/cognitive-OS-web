import Link from "next/link";
import Terminal from "./_components/Terminal";
import TerminalWindow from "./_components/TerminalWindow";
import SceneStage from "./_components/scene/SceneStage";
import FooterTagline from "./_components/scene/FooterTagline";
import { ZONES } from "@/content/stops";

const GITHUB_URL = "https://github.com/Callmedas69/cognitive-OS";
const NPM_URL = "https://www.npmjs.com/package/cognitiveos";
const X_URL = "https://x.com/Callmedas69";

// One body node per stop, aligned to STOPS. Number, kicker + headline come from
// the section meta (rendered by SectionPanel / HeroPanel). Copy follows the
// one-idea-per-panel rule from the 2026-07-02 taste audit.
const panels = [
  // 01 Overview (hero body) — the subhead is the mechanism. Without it readers
  // guess "viewer / summarizer"; the pain and the audience alone never say what
  // the thing IS.
  <div key="01">
    <p className="mb-5 text-base leading-snug text-text-muted">
      Plain markdown files your AI agent keeps updated. Come back and it{" "}
      <span className="text-mood-ink">already knows</span> where you left off.
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
    <p data-enter className="mt-4 max-w-[40ch] text-2xl leading-tight text-text">
      minutes lost reopening context. Not coding.
      <br/>
      Recovering.
    </p>
    <p
      data-enter
      className="mt-7 max-w-[24ch] border-l-4 pl-4 font-body text-base font-semibold leading-snug text-text"
      style={{ borderColor: "var(--local-accent)" }}
    >
      Structure beats willpower.
    </p>
  </div>,

  // 03 Beyond CLAUDE.md — the objection kill: readers who already have a
  // CLAUDE.md need to see what this adds before the mechanism (04) proves it.
  <div key="03">
    <div className="grid grid-cols-3 gap-3">
      <div data-enter className="rounded-2xl bg-surface/70 px-4 py-3 shadow-sm">
        <p className="font-mono text-sm font-bold text-text">CLAUDE.md</p>
        <p className="mt-2 font-mono text-xs text-text-muted">the map + routes</p>
        <p className="font-mono text-xs text-text-muted">where things live</p>
        <p className="font-mono text-xs text-text-muted">mostly static</p>
      </div>
      <div data-enter className="rounded-2xl bg-surface/70 px-4 py-3 shadow-sm ring-1 ring-emerald/40">
        <p className="font-mono text-sm font-bold text-emerald-ink">STATE.md</p>
        <p className="mt-2 font-mono text-xs text-text-muted">where you are</p>
        <p className="font-mono text-xs text-text-muted">rewritten by agent</p>
        <p className="font-mono text-xs text-text-muted">current every session</p>
      </div>
      <div data-enter className="rounded-2xl bg-surface/70 px-4 py-3 shadow-sm">
        <p className="font-mono text-sm font-bold text-text">CONTEXT.md</p>
        <p className="mt-2 font-mono text-xs text-text-muted">one per zone</p>
        <p className="font-mono text-xs text-text-muted">the workspace&apos;s manual</p>
        <p className="font-mono text-xs text-text-muted">how to work in it</p>
      </div>
    </div>
    <p
      data-enter
      className="mt-7 inline-flex rounded-lg bg-surface/65 px-4 py-3 font-mono text-sm font-bold text-text shadow-sm"
    >
      A productivity system asks you to maintain it. This maintains itself.
    </p>
    <p data-enter className="mt-5 max-w-[60ch] font-mono text-sm text-text-muted">
      0xnull, the keeper, writes STATE.md and repairs drift, so you never do the bookkeeping.
    </p>
  </div>,

  // 04 How It Works — concrete first, then the payoff made visible. Labels
  // and values mirror the real `cognitiveos start` output (src/lib/output.ts).
  // The macOS chrome replaces the CLI's ASCII border; content isn't a
  // verbatim frame anymore.
  <div key="04">
    <p data-enter className="max-w-[46ch]">
      Plain markdown next to your code. Your agent updates it as you work, and reads it back
      before it touches anything.
    </p>
    <p data-enter className="mt-4 max-w-[46ch]">
      Hooks save your state when you close the session and load it when you open. You{" "}
      <span style={{ color: "var(--local-ink)" }}>never run a save command</span>. Disappear for
      two weeks and it still knows where you were.
    </p>
    <TerminalWindow
      data-enter
      className="mt-6"
      aria-label="Example output of the cognitiveos start command"
    >
      <span className="text-term-green select-none">$ </span>start
      {`
FOCUS    fix wallet connection bug
         (projects/my-dapp)
LAST     2 days ago
LOOPS    1 open
BLOCKED  waiting on Base RPC key
NEXT     open focus/current-task.md
         done when: wallet connects on Base mainnet`}
    </TerminalWindow>
  </div>,

  // 05 Six Zones
  <div key="05">
    <ul data-enter className="grid gap-3 sm:grid-cols-2">
      {ZONES.map((z) => (
        <li
          key={z.name}
          className="group flex items-center gap-3 rounded-full border border-border/80 bg-bg/45 px-4 py-3 shadow-[0_1px_0_rgba(26,26,26,0.04)] backdrop-blur-sm"
        >
          <span
            className="h-4 w-4 shrink-0 rounded-full ring-4 ring-white/70 transition-transform duration-300 group-hover:scale-110"
            style={{ background: z.color }}
            aria-hidden
          />
          <span className="font-mono text-sm font-bold text-text">{z.name}</span>
        </li>
      ))}
    </ul>
    <p data-enter className="mt-5 max-w-[60ch] font-mono text-sm text-text-muted">
      focus/ holds <span style={{ color: "var(--local-ink)" }}>exactly one task</span>. The agent
      refuses a second. check fails loudly if two appear.
    </p>
  </div>,

  // 06 Commands — recovery controls, not the product: what each one does when
  // a session goes sideways, plus the honest hook-parity line.
  <div key="06">
    <div data-enter className="mt-2 overflow-hidden rounded-2xl bg-term-bg shadow-xl">
      {[
        { c: "init", role: "scaffold once" },
        { c: "start", role: "show the handoff" },
        { c: "dump", role: "capture a thought" },
        { c: "check", role: "verify the install" },
        { c: "install-skill", role: "add skills to your agents" },
      ].map(({ c, role }) => (
        <div key={c} className="grid gap-1 border-b border-white/10 px-4 py-3 last:border-b-0 sm:grid-cols-[max-content_1fr] sm:gap-4">
          <p className="font-mono text-sm font-bold text-term-text">cognitiveos {c}</p>
          <p className="font-mono text-xs text-term-muted sm:text-sm">{role}</p>
        </div>
      ))}
    </div>
    <p data-enter className="mt-4 font-mono text-xs text-text-muted sm:text-sm">
      Works with: Claude Code, Codex, Cursor, Antigravity.
      <br />
      Session hooks: Claude Code, Antigravity. Skill files: all four.
    </p>
  </div>,

  // 07 Open Source
  <div key="07">
    <p data-enter className="flex-col">
      MIT licensed.{" "}
      <span style={{ color: "var(--local-ink)" }}>No servers, accounts, or database</span>.
      <br />
      Just markdown on your machine.
    </p>  
  </div>,

  // 08 Start — the closing CTA should read as strong as the hero's, so reuse
  // the same styled Terminal copy-block instead of naked bold text. The
  // existing-project reassurance stays, demoted to small secondary text under
  // the command.
  <div key="08">
    <div data-enter className="max-w-[520px]">
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
        className="font-mono text-sm font-bold text-text underline decoration-emerald decoration-2 underline-offset-4 transition-colors hover:text-emerald-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
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
      <Link href="/docs" className="transition-colors hover:text-emerald focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald">Docs</Link>
    </div>
    <p className="mt-6 font-mono text-xs text-term-muted">MIT · built by 0xDas</p>
    <p className="mt-2 font-body text-sm font-medium text-term-muted">
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
      the memory for an ADHD developer
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
