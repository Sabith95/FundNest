import { CheckCircle2, CreditCard, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../shared/constants";
import type { CurrentTenantSubscription } from "../../services/tenantSubscriptionService";

interface TenantCurrentPlanBannerProps {
  subscription: CurrentTenantSubscription | null;
}

export default function TenantCurrentPlanBanner({
  subscription,
}: TenantCurrentPlanBannerProps) {
  const navigate = useNavigate();

  if (!subscription || subscription.status !== "ACTIVE") {
    return null;
  }

  const expiryDate = new Date(subscription.endsAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 p-6 text-white shadow-md sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-sm border border-emerald-500/30">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Active Subscription
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-200 border border-indigo-400/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              {subscription.planName} Plan
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            You are currently on the {subscription.planName} Plan
          </h2>
          <p className="text-sm text-indigo-200">
            Valid until <span className="font-semibold text-white">{expiryDate}</span>. Access all plan features and usage metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(ROUTES.TENANT.BILLING_DETAILS)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-900 shadow-sm hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-indigo-900"
        >
          <CreditCard className="h-4 w-4 text-indigo-600" />
          View Billing & Invoices
          <ArrowRight className="h-4 w-4 text-indigo-600" />
        </button>
      </div>
    </div>
  );
}