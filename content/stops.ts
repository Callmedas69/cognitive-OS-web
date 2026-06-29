/**
 * The seven product sections of the landing deck — single source of truth.
 *
 * The site is a horizontal scroll of full-viewport sections (no village scene).
 * Each entry drives one panel: its number, label, mood accent, kicker, and
 * display headline. A final footer panel scrolls in after section 07 but is not
 * listed here (it has no timeline dot).
 *
 * Copy is reconciled to cognitiveos@0.3.0. Components render this text; they
 * never invent product facts. No em-dashes (house style).
 */
export type StopMeta = {
  /** Anchor id, nav + timeline target. */
  id: string;
  num: string;
  /** Direct section label (shown in the timeline + section eyebrow). */
  name: string;
  /** Vivid mood fill (decorative). */
  accent: string;
  /** AA-safe mood ink (headline text on light bg). */
  accentInk: string;
  /** Dark-mode headline ink (cool-anchored, distinct from mood). */
  headlineInk: string;
  /** One-line kicker above the headline. */
  bubble: string;
  /** Display headline (Bebas Neue). */
  headline: string;
};

export const STOPS: StopMeta[] = [
  {
    id: "stop-01",
    num: "01",
    name: "Overview",
    accent: "#34d399",
    accentInk: "#047857",
    headlineInk: "#FBBF24",
    bubble: "Built for developers with executive dysfunction.",
    headline: "STOP RELEARNING YOUR OWN PROJECT",
  },
  {
    id: "stop-02",
    num: "02",
    name: "The Problem",
    accent: "#ff8a5c",
    accentInk: "#c2410c",
    headlineInk: "#F87171",
    bubble: "Why ADHD minds lose context every session.",
    headline: "THE 30-MINUTE TAX",
  },
  {
    id: "stop-03",
    num: "03",
    name: "How It Works",
    accent: "#22d3ee",
    accentInk: "#0e7490",
    headlineInk: "#FFFFFF",
    bubble: "ICM turns your folders into a state machine.",
    headline: "A FILESYSTEM THAT THINKS IN MODES",
  },
  {
    id: "stop-04",
    num: "04",
    name: "Six Zones",
    accent: "#a78bfa",
    accentInk: "#6d28d9",
    headlineInk: "#F97316",
    bubble: "Each folder is one mode of work.",
    headline: "SIX ZONES, ONE BRAIN",
  },
  {
    id: "stop-05",
    num: "05",
    name: "Commands",
    accent: "#34d399",
    accentInk: "#047857",
    headlineInk: "#FDE047",
    bubble: "Agent-agnostic CLI. Zero maintenance.",
    headline: "FOUR COMMANDS. THAT IS IT.",
  },
  {
    id: "stop-06",
    num: "06",
    name: "Open Source",
    accent: "#fb7185",
    accentInk: "#e11d48",
    headlineInk: "#E879F9",
    bubble: "MIT. No servers. The repo is the product.",
    headline: "FREE. OPEN SOURCE. YOURS.",
  },
  {
    id: "stop-07",
    num: "07",
    name: "Start",
    accent: "#34d399",
    accentInk: "#047857",
    headlineInk: "#A3E635",
    bubble: "Start your journey. Stay in context.",
    headline: "OPEN YOUR LAPTOP. KNOW WHAT TO DO.",
  },
];

/** Canonical zones (names + colors) for the Six Zones panel. Do not rename. */
export const ZONES: { name: string; color: string }[] = [
  { name: "brain-dump/", color: "#ff8a5c" },
  { name: "queue/", color: "#fbbf24" },
  { name: "focus/", color: "#fb7185" },
  { name: "projects/", color: "#34d399" },
  { name: "ideas/", color: "#a78bfa" },
  { name: "someday/", color: "#9ca3af" },
];
