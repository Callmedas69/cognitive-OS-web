/**
 * The eight product sections of the landing deck — single source of truth.
 *
 * The site is a horizontal scroll of full-viewport sections (no village scene).
 * Each entry drives one panel: its number, label, mood accent, kicker, and
 * display headline. A final footer panel scrolls in after section 08 but is not
 * listed here (it has no timeline dot).
 *
 * Copy is reconciled to cognitiveos@0.10.6. Components render this text; they
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
  /** One-line kicker above the headline. */
  bubble: string;
  /** Display headline (Bebas Neue). */
  headline: string;
  /** Substring of `headline` that gets the accent wipe. Must match exactly. */
  keyword?: string;
  /** Smaller display size for headlines whose longest line won't fit the column at default scale. */
  compactHeadline?: boolean;
  /** Timeline icon */
  icon: string;
};

export const STOPS: StopMeta[] = [
  {
    id: "stop-01",
    num: "01",
    name: "Overview",
    accent: "#34d399",
    accentInk: "#047857",
    bubble: "The memory for an ADHD developer.",
    headline: "STOP RELEARNING YOUR OWN PROJECT",
    icon: "/assets/generated/home.png",
  },
  {
    id: "stop-02",
    num: "02",
    name: "The Problem",
    accent: "#ff8a5c",
    accentInk: "#c2410c",
    bubble: "Lost context becomes lost momentum.",
    headline: "THE 30 MINUTE TAX",
    keyword: "30 MINUTE",
    icon: "/assets/generated/rock.png",
  },
  {
    id: "stop-03",
    num: "03",
    name: "Beyond CLAUDE.md",
    accent: "#818cf8",
    accentInk: "#4338ca",
    bubble: "Instructions are not session state.",
    headline: "RULES DO NOT REMEMBER WHERE YOU STOPPED",
    keyword: "REMEMBER",
    icon: "/assets/generated/workshop.png",
  },
  {
    id: "stop-04",
    num: "04",
    name: "How It Works",
    accent: "#22d3ee",
    accentInk: "#0e7490",
    bubble: "Come back. Your agent already knows.",
    headline: "YOUR AGENT READS THE FILES FIRST",
    keyword: "AGENT READS",
    icon: "/assets/generated/folder_flag.png",
  },
  {
    id: "stop-05",
    num: "05",
    name: "Six Zones",
    accent: "#a78bfa",
    accentInk: "#6d28d9",
    bubble: "One folder per cognitive mode.",
    headline: "SIX ZONES ONE BRAIN",
    keyword: "ONE BRAIN",
    icon: "/assets/generated/library.png",
  },
  {
    id: "stop-06",
    num: "06",
    name: "Commands",
    accent: "#fbbf24",
    accentInk: "#b45309",
    bubble: "Session hooks for Claude Code + Antigravity. Skill files for all four.",
    headline: "INIT ONCE\nKEEP THE THREAD",
    keyword: "INIT ONCE",
    compactHeadline: true,
    icon: "/assets/generated/terminal_icon.png",
  },
  {
    id: "stop-07",
    num: "07",
    name: "Open Source",
    accent: "#fb7185",
    accentInk: "#e11d48",
    bubble: "MIT. Local files. Your machine.",
    headline: "FREE • OPEN SOURCE • YOURS.",
    keyword: "OPEN SOURCE",
    icon: "/assets/generated/cherry_blossom.png",
  },
  {
    id: "stop-08",
    num: "08",
    name: "Start",
    accent: "#60a5fa",
    accentInk: "#1d4ed8",
    bubble: "Install the structure. Keep the thread.",
    headline: "OPEN YOUR LAPTOP KNOW WHAT TO DO",
    keyword: "KNOW WHAT TO DO",
    icon: "/assets/generated/street_lamp.png",
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
