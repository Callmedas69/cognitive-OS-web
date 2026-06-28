type CalloutProps = {
  children: React.ReactNode;
  tone?: "coral" | "emerald";
};

/** Full-border tinted callout (no side-stripe). Tone sets border + bg tint. */
export default function Callout({ children, tone = "coral" }: CalloutProps) {
  const styles =
    tone === "coral"
      ? "border-coral/40 bg-coral/[0.07] text-text"
      : "border-emerald/40 bg-emerald/[0.07] text-text";
  return (
    <div className={`rounded-xl border px-6 py-5 text-base font-medium ${styles}`}>
      {children}
    </div>
  );
}
