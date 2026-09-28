"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/dashboard/store/store";
import AuthGuard from "@/components/AuthGuard";
import WorkspaceLayout from "@/dashboard/layout/WorkspaceLayout";

export default function AppShell({ children }) {
  return (
    <Provider store={store}>
      <AuthGuard>
        <WorkspaceLayout>{children}</WorkspaceLayout>
      </AuthGuard>
    </Provider>
  );
}