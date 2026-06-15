import Link from "next/link";
import Section from "./_components/Section";
import MoodController from "./_components/MoodController";
import Terminal from "./_components/Terminal";
import Mascot from "./_components/Mascot";
import ZoneTree from "./_components/ZoneTree";
import PrincipleCard from "./_components/PrincipleCard";
import Callout from "./_components/Callout";

const GITHUB_URL = "https://github.com/Callmedas69/cognitive-OS";
const NPM_URL = "https://www.npmjs.com/package/cognitiveos";
const X_URL = "https://x.com/Callmedas69";
const FARCASTER_URL = "https://warpcast.com/callmedas69";

const AGENTS = [
  { name: "Claude Code", reads: "reads CLAUDE.md + slash-command hooks" },
  { name: "Codex CLI", reads: "reads AGENTS.md" },
  { name: "Antigravity", reads: "reads AGENTS.md" },
  { name: "Cursor", reads: "reads AGENTS.md" },
];

const QUICKSTART = [
  { cmd: "npx cognitiveos init", label: "one-time setup" },
  { cmd: "cognitiveos start", label: "where you left off" },
  { cmd: 'cognitiveos dump "..."', label: "capture anything" },
  { cmd: "cognitiveos check", label: "verify it's wired" },
];

// Scroll-driven 0xNull mood per section. v = vivid (decorative fills),
// ink = darker AA-safe variant (text). Every adjacent section uses a distinct
// hue so each transition visibly morphs: emerald → red → cyan → violet →
// emerald → amber. On-brand (accent + zone tokens).
const MOOD = {
  shipping: { v: "#10b981", ink: "#047857" }, // emerald
  broke: { v: "#ff3366", ink: "#e11d48" }, // red
  flow: { v: "#06b6d4", ink: "#0e7490" }, // cyan
  ideas: { v: "#7b61ff", ink: "#6d28d9" }, // violet (ideas zone)
  capture: { v: "#ff6b35", ink: "#c2410c" }, // amber (capture zone)
} as const;

function H2({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* section title shifts color by scroll (AA-safe ink tier) */}
      <h2 className="font-display text-[length:var(--text-h2)] leading-none tracking-wide text-mood-ink">
        {children}
      </h2>
      {/* mood underline bar — vivid fill */}
      <span className="mt-4 block h-1 w-12 rounded-full bg-mood" aria-hidden />
    </>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      <MoodController />
      {/* ── Section 1 — Hero ───────────────────────────── */}
      <Section
        noReveal
        mood={MOOD.shipping.v}
        moodInk={MOOD.shipping.ink}
        className="flex min-h-[70vh] flex-col items-center justify-center text-center"
      >
        <p className="mb-6 text-sm font-bold text-mood-ink">{"// the thinking is free."}</p>

        <Mascot />

        <h1 className="mt-8 font-display text-[length:var(--text-h1)] leading-[0.95] tracking-wide">
          Never lose context
          <br />
          between sessions
        </h1>

        <p className="mt-6 max-w-md text-text-muted">
          An AI filesystem for developers with executive dysfunction. Open your
          laptop and know exactly what to do.
        </p>

        <div className="mt-10 w-full max-w-md">
          <Terminal command="npx cognitiveos init" cursor />
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[6px] bg-emerald px-6 py-3 text-sm font-bold text-[#06281d] transition-opacity hover:opacity-90"
          >
            View on GitHub →
          </a>
          <Link
            href="/docs"
            className="text-sm text-mood-ink underline-offset-4 hover:underline"
          >
            Read the docs
          </Link>
        </div>
      </Section>

      {/* ── Section 2 — The Problem ────────────────────── */}
      <Section mood={MOOD.broke.v} moodInk={MOOD.broke.ink} className="max-w-[760px]">
        <H2>The 30-minute tax</H2>
        <p className="mt-6 text-text-muted">
          Every time you reopen your laptop, you spend 15–45 minutes remembering
          where you were. Not coding. Recovering.
        </p>
        <p className="mt-4 text-text-muted">
          This isn&apos;t a discipline problem. It&apos;s executive dysfunction.
          These brains can&apos;t hold working memory across sessions.
        </p>
        <div className="mt-8">
          <Callout tone="coral">
            The root cause isn&apos;t you. It&apos;s the environment.
          </Callout>
        </div>
      </Section>

      {/* ── Section 3 — The Filesystem ─────────────────── */}
      <Section mood={MOOD.flow.v} moodInk={MOOD.flow.ink}>
        <H2>The filesystem is the fix</H2>
        <p className="mt-6 max-w-[640px] text-text-muted">
          Each folder is one cognitive mode. Your agent reads it automatically.
          You never decide where to look.
        </p>
        <div className="mt-10">
          <ZoneTree />
        </div>
      </Section>

      {/* ── Section 4 — Three Principles ───────────────── */}
      <Section mood={MOOD.ideas.v} moodInk={MOOD.ideas.ink}>
        <H2>Why this isn&apos;t another Notion</H2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <PrincipleCard label="ZERO MAINTENANCE">
            Hooks update your state automatically. You never run a
            &quot;save&quot; command.
          </PrincipleCard>
          <PrincipleCard label="NO INVISIBLE STATE">
            Everything is a markdown file you can open. No database. No account.
            No sync.
          </PrincipleCard>
          <PrincipleCard label="ONE THING AT A TIME">
            focus/ holds exactly one task. The architecture makes two
            impossible.
          </PrincipleCard>
        </div>
      </Section>

      {/* ── Section 5 — Works With Your Agent ──────────── */}
      <Section mood={MOOD.shipping.v} moodInk={MOOD.shipping.ink}>
        <H2>Bring your own agent</H2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-[10px] border border-border bg-border sm:grid-cols-2">
          {AGENTS.map((a) => (
            <div key={a.name} className="bg-surface p-6">
              <div className="font-bold">{a.name}</div>
              <div className="mt-1 text-sm text-text-muted">{a.reads}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Section 6 — Quickstart ─────────────────────── */}
      <Section mood={MOOD.capture.v} moodInk={MOOD.capture.ink} className="max-w-[760px]">
        <H2>Start in 60 seconds</H2>
        <div className="mt-10 flex flex-col gap-3">
          {QUICKSTART.map((q) => (
            <Terminal key={q.cmd} command={q.cmd} label={q.label} />
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/docs"
            className="text-sm text-mood-ink underline-offset-4 hover:underline"
          >
            Full documentation →
          </Link>
        </div>
      </Section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-6 px-6 py-16">
          <p className="text-sm font-bold text-mood-ink">{"// the thinking is free."}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald">GitHub</a>
            <a href={NPM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald">npm</a>
            <a href={X_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald">X</a>
            <a href={FARCASTER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald">Farcaster</a>
            <Link href="/docs" className="hover:text-emerald">Docs</Link>
          </div>
          <p className="text-xs text-text-muted">MIT · built by 0xDas</p>
          <p className="text-sm text-text-muted">
            &quot;I opened my laptop and knew exactly what to do.&quot;
          </p>
        </div>
      </footer>
    </main>
  );
}
