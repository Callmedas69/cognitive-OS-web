/** Docs IA (design spec §3). Order = sidebar order. */
export type DocLink = { title: string; href: string };

export const DOCS_NAV: DocLink[] = [
  { title: "Getting Started", href: "/docs" },
  { title: "Add to an existing project", href: "/docs/existing-project" },
  { title: "Commands", href: "/docs/commands" },
  { title: "The Zones", href: "/docs/zones" },
  { title: "STATE.md", href: "/docs/state" },
  { title: "Hooks", href: "/docs/hooks" },
  { title: "Agent Setup", href: "/docs/agent-setup" },
  { title: "The Keeper", href: "/docs/keeper" },
  { title: "Project Templates", href: "/docs/project-templates" },
  { title: "Contributing", href: "/docs/contributing" },
];

export const REPO_URL = "https://github.com/Callmedas69/cognitive-OS-web";

/** Map a docs pathname to its source .mdx path in the website repo. */
export function editUrlFor(pathname: string): string {
  const sub = pathname === "/docs" ? "" : pathname.replace(/^\/docs\//, "") + "/";
  return `${REPO_URL}/edit/main/app/docs/${sub}page.mdx`;
}
