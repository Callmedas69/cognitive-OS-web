import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import createMDX from "@next/mdx";

// Pin the workspace root to this project — a sibling lockfile at D:\Harry
// otherwise makes Next infer the wrong root (build warning).
const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Let .md / .mdx files act as routes (docs pages).
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  // Pin next build's file-tracing root too — turbopack.root only governs dev,
  // the parent D:\Harry lockfile otherwise wins at build time.
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  // memory.md → STATE.md rename: keep the old docs URL alive.
  async redirects() {
    return [
      {
        source: "/docs/memory",
        destination: "/docs/state",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  // Turbopack requires string-named plugins with serializable options.
  options: {
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
