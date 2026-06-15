"use client";

import { usePathname } from "next/navigation";
import { editUrlFor } from "../_nav";

export default function EditOnGithub() {
  const pathname = usePathname();
  return (
    <a
      href={editUrlFor(pathname)}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-text-muted underline-offset-4 hover:text-emerald hover:underline"
    >
      Edit this page on GitHub →
    </a>
  );
}
