import Link from "next/link";
import Terminal from "./_components/Terminal";
import SceneStage from "./_components/scene/SceneStage";
import { ZONES } from "@/content/stops";

const GITHUB_URL = "https://github.com/Callmedas69/cognitive-OS";
const NPM_URL = "https://www.npmjs.com/package/cognitiveos";
const X_URL = "https://x.com/Callmedas69";
const FARCASTER_URL = "https://warpcast.com/callmedas69";

// One body node per stop, aligned to STOPS. Number, kicker + headline come from
// the section meta (rendered by SectionPanel).
const panels = [
  // 01 Overview (hero body — eyebrow/kicker/headline come from HeroPanel)
  <div key="01">
    <p>
      cognitiveOS scaffolds your project into an ICM filesystem. Your AI agent keeps the context
      in a persistent <code className="font-mono font-bold">STATE.md</code>, so you open your
      laptop already oriented, never from zero.
    </p>
    <p className="mt-3 text-sm text-text-muted">
      Built for brains that lose context between sessions, ADHD or executive dysfunction.
    </p>
    <div className="mt-5 max-w-[380px]">
      <Terminal command="npx cognitiveos init" cursor />
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-5 text-sm">
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-emerald px-4 py-2 font-bold text-white transition-opacity hover:opacity-90"
      >
        View on GitHub →
      </a>
      <Link href="/docs" className="text-mood-ink underline-offset-4 hover:underline">
        Read the docs
      </Link>
    </div>
  </div>,

  // 02 The Problem
  <div key="02">
    <p>
      Every time you reopen your laptop, you spend{" "}
      <strong className="font-bold text-coral">15 to 30 minutes</strong> remembering where you
      were. Not coding. Recovering.
    </p>
    <p className="mt-3">
      This is not a discipline problem. It is executive dysfunction. The root cause is not you,
      it is the environment.
    </p>
    <p className="mt-4 rounded-lg border border-coral/40 bg-coral/[0.07] px-4 py-3 font-medium text-text">
      Structure beats willpower.
    </p>
  </div>,

  // 03 How It Works
  <div key="03">
    <p>
      CognitiveOS scaffolds your project with ICM, the Interpreted Context Methodology. The
      filesystem becomes a state machine: each folder is one cognitive mode, and a{" "}
      <code className="font-mono font-bold">CONTEXT.md</code> in each folder tells your AI agent
      how to behave there.
    </p>
    <p className="mt-3">
      You do not maintain it. It maintains your context for you. A cognitive prosthetic, not a
      productivity system.
    </p>
  </div>,

  // 04 Six Zones
  <div key="04">
    <p>
      <code className="font-mono font-bold">init</code> creates six zones plus STATE.md. Each
      folder is one mode of work; <code className="font-mono font-bold">sessions/</code> logs your
      history automatically.
    </p>
    <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-xs">
      {ZONES.map((z) => (
        <li key={z.name} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: z.color }}
            aria-hidden
          />
          {z.name}
        </li>
      ))}
    </ul>
    <p className="mt-4 text-xs text-text-muted">
      focus/ holds exactly one task. The architecture makes two impossible.
    </p>
  </div>,

  // 05 Commands
  <div key="05">
    <p>
      Four commands. That is it. Agent-agnostic: a session hook auto-loads STATE.md the moment
      your agent opens.
    </p>
    <div className="mt-4">
      <Terminal command="npx cognitiveos init" label="one-time setup" />
    </div>
    <p className="mt-3 font-mono text-xs text-text-muted">
      then: start · dump · check — full reference in the docs.
    </p>
  </div>,

  // 06 Open Source
  <div key="06">
    <p>
      MIT licensed. No servers, no accounts, no database. Just markdown files on your machine.
      The repo is the product.
    </p>
    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald">GitHub</a>
      <a href={NPM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald">npm</a>
      <a href={X_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald">X</a>
      <a href={FARCASTER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald">Farcaster</a>
    </div>
  </div>,

  // 07 Start
  <div key="07">
    <p>Start your journey. Stay in context. Build with ease.</p>
    <div className="mt-4 max-w-[360px]">
      <Terminal command="npx cognitiveos init" cursor />
    </div>
    <div className="mt-4">
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-lg bg-emerald px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
      >
        View on GitHub →
      </a>
    </div>
  </div>,
];

// Footer — the final horizontal panel, centered to fill the viewport.
const footer = (
  <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
    <p className="font-display text-[clamp(48px,9vw,120px)] leading-[0.9] tracking-wide text-mood-ink">
      {"// the thinking is free."}
    </p>
    <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald">GitHub</a>
      <a href={NPM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald">npm</a>
      <a href={X_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald">X</a>
      <a href={FARCASTER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald">Farcaster</a>
      <Link href="/docs" className="hover:text-emerald">Docs</Link>
    </div>
    <p className="mt-6 text-xs text-text-muted">MIT · built by 0xDas</p>
    <p className="mt-2 text-sm text-text-muted">
      &quot;I opened my laptop and knew exactly what to do.&quot;
    </p>
  </div>
);

// Hero headline — FILESYSTEM is the selling word, tinted in the mood ink.
const heroHeadline = (
  <>
    A <span className="text-mood-ink">FILESYSTEM</span> THAT REMEMBERS FOR YOU
  </>
);

export default function Home() {
  return (
    <main className="relative flex-1">
      <SceneStage panels={panels} footer={footer} heroHeadline={heroHeadline} />
    </main>
  );
}
