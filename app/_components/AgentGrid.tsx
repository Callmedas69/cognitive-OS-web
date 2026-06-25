/**
 * "Bring your own agent" — a varied bento (anti-slop: replaces 4 flat equal
 * white cells). Claude Code is the emphasis tile (2x2); the rest vary in span.
 * Each agent gets a monogram mark in its own tint, so the grid carries the
 * visual richness without stock logos / off-brand imagery.
 */
type Agent = {
  name: string;
  mark: string; // monogram
  reads: string;
  tint: string; // bg tint class
  ink: string; // mark color class
  span: string; // grid span classes
  emphasis?: boolean;
};

const AGENTS: Agent[] = [
  {
    name: "Claude Code",
    mark: "C",
    reads: "reads CLAUDE.md + slash-command hooks",
    tint: "bg-emerald/[0.07]",
    ink: "text-emerald",
    span: "sm:col-span-2 sm:row-span-2",
    emphasis: true,
  },
  {
    name: "Codex CLI",
    mark: "X",
    reads: "reads AGENTS.md",
    tint: "bg-zone-ideas/[0.07]",
    ink: "text-zone-ideas",
    span: "",
  },
  {
    name: "Antigravity",
    mark: "A",
    reads: "reads AGENTS.md",
    tint: "bg-zone-capture/[0.07]",
    ink: "text-zone-capture",
    span: "",
  },
  {
    name: "Cursor",
    mark: "→",
    reads: "reads AGENTS.md",
    tint: "bg-zone-focus/[0.07]",
    ink: "text-zone-focus",
    span: "sm:col-span-2",
  },
];

export default function AgentGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:auto-rows-fr sm:grid-cols-4">
      {AGENTS.map((a) => (
        <div
          key={a.name}
          className={`flex flex-col justify-between gap-8 rounded-[12px] border border-border p-6 ${a.tint} ${a.span}`}
        >
          <span
            className={`flex items-center justify-center rounded-[10px] bg-surface font-display tracking-tight ${a.ink} ${
              a.emphasis ? "h-16 w-16 text-4xl" : "h-11 w-11 text-2xl"
            }`}
            aria-hidden
          >
            {a.mark}
          </span>
          <div>
            <div
              className={`font-bold ${a.emphasis ? "text-xl" : "text-base"}`}
            >
              {a.name}
            </div>
            <div className="mt-1 text-sm text-text-muted">{a.reads}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
