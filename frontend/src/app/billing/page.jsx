import AuthGuard from "@/components/AuthGuard";
import BillingClient from "./BillingClient";

export const metadata = {
  title: "Billing Plans — Agent-X",
  description: "Upgrade your Agent-X account, view active subscriptions, quota usages, and billing logs.",
};

export default function BillingPage() {
  return (
    <AuthGuard>
      <BillingClient />
    </AuthGuard>
  );
}
