"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import {
  Files,
  MessageSquare,
  CreditCard,
  Settings,
  Plus,
} from "lucide-react";
import { setSidebarPanel, createChat, setShowBillingPanel } from "../store/dashboardSlice";

const items = [
  { id: "explorer", icon: Files, label: "Explorer", panel: "explorer" },
  { id: "chats", icon: MessageSquare, label: "Chats", panel: "chats" },
  { id: "billing", icon: CreditCard, label: "Billing", panel: "billing" },
];

export default function ActivityBar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const sidebarPanel = useSelector((s) => s.dashboard?.sidebarPanel ?? "explorer");
  const showBillingPanel = useSelector((s) => s.dashboard?.showBillingPanel ?? false);

  return (
    <aside className="w-12 h-full bg-black/35 backdrop-blur-md border-r border-white/[0.06] flex flex-col items-center py-2 shrink-0 z-20">
      {items.map(({ id, icon: Icon, label, panel }) => {
        const active = panel === "billing" ? showBillingPanel : sidebarPanel === panel;
        return (
          <button
            key={id}
            onClick={() => {
              if (panel === "billing") {
                dispatch(setShowBillingPanel(true));
                dispatch(setSidebarPanel("explorer"));
              } else {
                dispatch(setSidebarPanel(panel));
                dispatch(setShowBillingPanel(false));
              }
            }}
            title={label}
            className={`relative w-10 h-10 flex items-center justify-center rounded-lg mb-1 transition-colors cursor-pointer ${
              active
                ? "text-white"
                : "text-[#8b949e] hover:text-[#e6edf3]"
            }`}
          >
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#10B981] rounded-r" />
            )}
            <Icon className="w-5 h-5" strokeWidth={1.5} />
          </button>
        );
      })}

      <div className="flex-1" />

      <button
        onClick={() => dispatch(createChat())}
        title="New chat"
        className="w-10 h-10 flex items-center justify-center rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/[0.04] transition-colors cursor-pointer mb-1"
      >
        <Plus className="w-5 h-5" strokeWidth={1.5} />
      </button>

      <button
        onClick={() => router.push("/settings")}
        title="Settings"
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
          pathname === "/settings"
            ? "text-white"
            : "text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/[0.04]"
        }`}
      >
        <Settings className="w-5 h-5" strokeWidth={1.5} />
      </button>
    </aside>
  );
}