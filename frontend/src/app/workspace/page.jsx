import { Suspense } from "react";
import WorkspaceAppPage from "./WorkspaceClient";

export const metadata = {
  title: "Workspace | Agent-X",
};

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030712]" />}>
      <WorkspaceAppPage />
    </Suspense>
  );
}
