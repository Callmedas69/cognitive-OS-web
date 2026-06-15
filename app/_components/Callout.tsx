type CalloutProps = {
  children: React.ReactNode;
  tone?: "coral" | "emerald";
};

/** Left-border accent + tinted bg (spec §2 / component inventory). */
export default function Callout({ children, tone = "coral" }: CalloutProps) {
  const styles =
    tone === "coral"
      ? "border-coral bg-coral/[0.06]"
      : "border-emerald bg-emerald/[0.06]";
  return (
    <div className={`rounded-r-[10px] border-l-4 px-6 py-5 text-base ${styles}`}>
      {children}
    </div>
  );
}
