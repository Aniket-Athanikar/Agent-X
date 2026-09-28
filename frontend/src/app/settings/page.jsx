import AuthGuard from "@/components/AuthGuard";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Settings — Agent-X",
  description: "Configure your Agent-X workspace, profile settings, API keys, and subscription plan.",
};

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsClient />
    </AuthGuard>
  );
}
