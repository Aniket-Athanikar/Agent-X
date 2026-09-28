"use client";

import { FileCode } from "lucide-react";
import { useSelector } from "react-redux";
import CenterChat from "./CenterChat";
import ProjectImportGate from "./ProjectImportGate";

export default function WorkspaceExperience() {
  const file = useSelector((s) => s.dashboard?.activeFile);
  const switching = useSelector((s) => s.dashboard?.workspaceSwitching);

  if (switching) return <ProjectImportGate switching />;

  return (
    <div className="flex h-full min-w-0 bg-[#0d1117]">
      <section className="flex-1 min-w-0 flex flex-col border-r border-white/[0.06]">
        <header className="h-14 px-4 border-b border-white/[0.06] flex items-center gap-3 shrink-0">
          <FileCode className="w-4 h-4 text-emerald-400" />
          <div className="min-w-0">
            <p className="text-sm text-white font-medium truncate">{file?.name || "Selected File"}</p>
            <p className="text-[11px] text-[#8b949e] truncate">{file?.path || "Choose a file from the Explorer"}</p>
          </div>
        </header>
        {file ? (
          <pre className="flex-1 overflow-auto m-0 p-5 text-[13px] leading-6 font-mono text-[#c9d1d9] whitespace-pre bg-[#0d1117]">
            <code>{file.content || "File content is unavailable for this file."}</code>
          </pre>
        ) : (
          <div className="flex-1 grid place-items-center text-sm text-[#8b949e] px-6 text-center">
            Select a source file to view it and make it the AI&apos;s active context.
          </div>
        )}
      </section>
      <aside className="w-[min(420px,42vw)] min-w-[320px] bg-[#0d1117]">
        <CenterChat />
      </aside>
    </div>
  );
}
