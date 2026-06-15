type PrincipleCardProps = {
  label: string;
  children: React.ReactNode;
};

/** White surface, hairline border, mono label + body (spec §4). */
export default function PrincipleCard({ label, children }: PrincipleCardProps) {
  return (
    <div className="rounded-[10px] border border-border bg-surface p-7">
      <h3 className="mb-3 text-sm font-bold tracking-wide text-emerald">{label}</h3>
      <p className="text-sm text-text-muted">{children}</p>
    </div>
  );
}
