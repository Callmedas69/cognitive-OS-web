import Sidebar from "./_components/Sidebar";
import EditOnGithub from "./_components/EditOnGithub";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-8 px-6 py-12 md:flex-row md:gap-12 md:py-16">
      <Sidebar />
      <div className="min-w-0 flex-1">
        {/* Readable line length (spec §3: content max-width 720px) */}
        <article className="max-w-[720px] font-sans">{children}</article>
        <div className="mt-16 max-w-[720px] border-t border-border pt-6">
          <EditOnGithub />
        </div>
      </div>
    </main>
  );
}
