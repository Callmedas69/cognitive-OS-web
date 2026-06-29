import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Global MDX element → brand styling map. Required by @next/mdx (App Router).
 * Keeps the docs on the same visual system as the landing — no typography
 * plugin (would fight the locked brand), every element styled by hand.
 */
const components: MDXComponents = {
  h1: (props) => (
    <h1
      className="font-display text-4xl leading-none tracking-wide sm:text-5xl"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-14 mb-4 border-b border-border pb-2 font-display text-2xl leading-none tracking-wide sm:text-3xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-8 mb-3 text-base font-bold" {...props} />
  ),
  p: (props) => <p className="my-4 text-text-muted" {...props} />,
  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) => {
    const external = /^https?:\/\//.test(href);
    const cls = "text-emerald-ink underline-offset-4 hover:underline";
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...props} />
    ) : (
      <Link href={href} className={cls} {...props} />
    );
  },
  ul: (props) => (
    <ul className="my-4 list-disc space-y-1.5 pl-5 text-text-muted marker:text-border" {...props} />
  ),
  ol: (props) => (
    <ol className="my-4 list-decimal space-y-1.5 pl-5 text-text-muted marker:text-text-muted" {...props} />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-6 rounded-r-[10px] border-l-4 border-emerald bg-emerald/[0.06] px-5 py-3 text-text [&>p]:my-1 [&>p]:text-text"
      {...props}
    />
  ),
  // Inline code (block code is wrapped in <pre> below)
  code: (props) => (
    <code
      className="rounded-[4px] bg-border/50 px-1.5 py-0.5 text-[0.85em] text-text"
      {...props}
    />
  ),
  // Code block — the dark terminal contrast element
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-[10px] bg-term-bg p-4 text-sm text-term-text [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-term-text"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-border" />,
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="border border-border bg-surface px-3 py-2 text-left font-bold" {...props} />
  ),
  td: (props) => (
    <td className="border border-border px-3 py-2 text-text-muted" {...props} />
  ),
  strong: (props) => <strong className="font-bold text-text" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
