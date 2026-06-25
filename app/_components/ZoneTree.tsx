/**
 * Rendered directory tree (spec §3) — a light card, monospace, each folder
 * name in its zone color. The product, rendered not described.
 */
type Row = {
  /** tree glyph + path, e.g. "├── brain-dump/" */
  tree: string;
  /** the folder/file name to colorize within the row */
  name: string;
  /** zone color class for the name */
  color: string;
  /** trailing comment */
  note: string;
};

const ROWS: Row[] = [
  { tree: "├──", name: "STATE.md", color: "text-text", note: "your current-state snapshot" },
  { tree: "├──", name: "brain-dump/", color: "text-zone-capture", note: "capture everything" },
  { tree: "├──", name: "queue/", color: "text-zone-queue", note: "what's next, sorted" },
  { tree: "├──", name: "focus/", color: "text-zone-focus", note: "the ONE thing" },
  { tree: "├──", name: "projects/", color: "text-zone-projects", note: "active work, max 3" },
  { tree: "├──", name: "ideas/", color: "text-zone-ideas", note: "captured, not committed" },
  { tree: "└──", name: "sessions/", color: "text-zone-someday", note: "auto-logged history" },
];

export default function ZoneTree() {
  return (
    <div className="overflow-x-auto rounded-[10px] border border-border bg-surface p-6 text-sm leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <pre className="font-mono">
        <span className="text-text-muted">your-project/</span>
        {"\n"}
        {ROWS.map((r) => (
          <span key={r.name} className="tree-row block">
            <span className="text-text-muted">{r.tree} </span>
            <span className={`${r.color} font-bold`}>{r.name}</span>
            <span className="text-text-muted">
              {" ".repeat(Math.max(1, 16 - r.name.length))}
              {r.note}
            </span>
          </span>
        ))}
      </pre>
    </div>
  );
}
