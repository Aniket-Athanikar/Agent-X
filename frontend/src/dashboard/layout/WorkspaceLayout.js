"use client";

import { useSelector } from "react-redux";
import ActivityBar from "./ActivityBar";
import ExplorerSidebar from "./ExplorerSidebar";
import TopNavigation from "./TopNavigation";
import CommandPalette from "./CommandPalette";
import CenterChat from "../components/CenterChat";
import BillingPanel from "../components/BillingPanel";

export default function WorkspaceLayout({ children }) {
  const sidebarCollapsed = useSelector((s) => s.dashboard?.sidebarCollapsed ?? false);

  return (
    <div className="flex h-screen w-full bg-[#030712] relative overflow-hidden text-[#e6edf3]">
      <div className="flex flex-1 min-w-0 relative z-10 w-full h-full">
        <ActivityBar />
        
        <div className={`h-full overflow-hidden shrink-0 flex transition-[width] duration-150 ${sidebarCollapsed ? "w-0" : "w-[260px]"}`}>
          <ExplorerSidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <TopNavigation />
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {children ?? <CenterChat />}
          </main>
        </div>
      </div>

      <BillingPanel />
      <CommandPalette />
    </div>
  );
}
