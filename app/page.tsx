import Link from "next/link";
import Section from "./_components/Section";
import MoodController from "./_components/MoodController";
import Terminal from "./_components/Terminal";
import ZoneTree from "./_components/ZoneTree";
import Callout from "./_components/Callout";
import HeroSplit from "./_components/HeroSplit";
import StatBlock from "./_components/StatBlock";
import PrincipleRow from "./_components/PrincipleRow";
import AgentGrid from "./_components/AgentGrid";

const GITHUB_URL = "https://github.com/Callmedas69/cognitive-OS";
const NPM_URL = "https://www.npmjs.com/package/cognitiveos";
const X_URL = "https://x.com/Callmedas69";
const FARCASTER_URL = "https://warpcast.com/callmedas69";

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
      <h2 className="font-display text-[length:var(--text-h2)] leading-[0.9] tracking-wide text-mood-ink">
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

      {/* ── Section 1 — Hero (asymmetric editorial) ────── */}
      <Section
        noReveal
        width="wide"
        padY={false}
        mood={MOOD.shipping.v}
        moodInk={MOOD.shipping.ink}
        className="flex min-h-[100dvh] flex-col justify-center py-24"
      >
        <HeroSplit githubUrl={GITHUB_URL} />
      </Section>

      {/* ── Section 2 — The Problem (big-numeral stat) ─── */}
      <Section mood={MOOD.broke.v} moodInk={MOOD.broke.ink}>
        <H2>The 30-minute tax</H2>
        <div className="mt-12">
          <StatBlock
            value="15–45"
            unit="minutes"
            caption="lost every time you reopen your laptop — not coding, just recovering where you were."
          />
        </div>
        <p className="mt-10 max-w-[56ch] text-base leading-relaxed text-text-muted">
          This isn&apos;t a discipline problem. It&apos;s executive dysfunction.
          These brains can&apos;t hold working memory across sessions.
        </p>
        <div className="mt-8 max-w-[56ch]">
          <Callout tone="coral">
            The root cause isn&apos;t you. It&apos;s the environment.
          </Callout>
        </div>
      </Section>

      {/* ── Section 3 — The Filesystem (split centerpiece) */}
      <Section mood={MOOD.flow.v} moodInk={MOOD.flow.ink} width="wide">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <H2>The filesystem is the fix</H2>
            <p className="mt-8 max-w-[44ch] text-base leading-relaxed text-text-muted">
              Each folder is one cognitive mode. Your agent reads it
              automatically. You never decide where to look.
            </p>
          </div>
          <ZoneTree />
        </div>
      </Section>

      {/* ── Section 4 — Principles (numbered rows) ─────── */}
      <Section mood={MOOD.ideas.v} moodInk={MOOD.ideas.ink}>
        <H2>Why this isn&apos;t another Notion</H2>
        <div className="mt-10">
          <PrincipleRow index="01" label="Zero maintenance">
            Hooks update your state automatically. You never run a
            &quot;save&quot; command.
          </PrincipleRow>
          <PrincipleRow index="02" label="No invisible state">
            Everything is a markdown file you can open. No database. No account.
            No sync.
          </PrincipleRow>
          <PrincipleRow index="03" label="One thing at a time" last>
            focus/ holds exactly one task. The architecture makes two
            impossible.
          </PrincipleRow>
        </div>
      </Section>

      {/* ── Section 5 — Works With Your Agent (bento) ──── */}
      <Section mood={MOOD.shipping.v} moodInk={MOOD.shipping.ink}>
        <H2>Bring your own agent</H2>
        <div className="mt-10">
          <AgentGrid />
        </div>
      </Section>

      {/* ── Section 6 — Quickstart (numbered terminals) ── */}
      <Section mood={MOOD.capture.v} moodInk={MOOD.capture.ink}>
        <H2>Start in 60 seconds</H2>
        <ol className="mt-12 flex flex-col gap-6">
          {QUICKSTART.map((q, i) => (
            <li key={q.cmd} className="flex items-center gap-5 sm:gap-8">
              <span
                className="font-display text-[length:var(--text-h2)] leading-none tracking-wide text-mood/60"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <Terminal command={q.cmd} label={q.label} />
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-12">
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
