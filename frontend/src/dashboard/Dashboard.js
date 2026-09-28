"use client";

import React from "react";
import AppShell from "@/dashboard/AppShell";
import WorkspaceExperience from "@/dashboard/components/WorkspaceExperience";
import { useKeyboardShortcuts } from "@/dashboard/hooks/useDashboard";
import { useWorkspaceOverview } from "@/dashboard/hooks/useWorkspaceOverview";

function DashboardInner() {
  useKeyboardShortcuts();
  useWorkspaceOverview();

  return (
      <WorkspaceExperience />
  );
}

export default function Dashboard() {
  return (
    <AppShell>
      <DashboardInner />
    </AppShell>
  );
}
