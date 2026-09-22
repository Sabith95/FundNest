import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  ShieldCheck,
  Zap,
  RefreshCw,
  Loader2,
} from "lucide-react";

import Header from "../../../components/tenant/Header";
import Sidebar from "../../../components/tenant/Sidebar";
import UsageLimitCard from "../../../components/billing/UsageLimitCard";
import InvoiceHistoryTable from "../../../components/billing/InvoiceHistoryTable";
import { ROUTES } from "../../../shared/constants";
import { useAppSelector } from "../../../store/hooks";
import { mapTenantVerificationStatus } from "../../../utitls/tenantRouting";
import { tenantSubscriptionPlanService } from "../../../services/tenantSubscriptionService";
import type { TenantBillingOverview } from "../../../types/billing.types";

export default function TenantBillingDetailsPage() {
  const tenant = useAppSelector((state) => state.tenant.tenant);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [billingData, setBillingData] = useState<TenantBillingOverview | null>(null);

  const loadBillingData = async () => {
    setIsLoading(true);
    try {
      const data = await tenantSubscriptionPlanService.getBillingOverview();
      setBillingData(data);
    } catch (err) {
      console.error("Failed to load billing overview", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadBillingData();
  }, []);

  if (!tenant) {
    return <Navigate to={ROUTES.TENANT.LOGIN} replace />;
  }

  const currentPlan = billingData?.currentPlan;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeHref={ROUTES.TENANT.SUBSCRIPTION}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          user={{
            name: tenant.ownerName,
            role: "Tenant administrator",
            verificationStatus: mapTenantVerificationStatus(tenant.status),
            profile: tenant,
          }}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {/* Header section */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <button
                type="button"
                onClick={() => navigate(ROUTES.TENANT.SUBSCRIPTION)}
                className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Subscription Plans
              </button>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Subscription & Billing Details
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your subscription details, check feature usage limits, and view invoice history.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(ROUTES.TENANT.SUBSCRIPTION)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <Zap className="h-4 w-4" /> Change / Upgrade Plan
            </button>
          </div>

          {isLoading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Active Plan
                    </span>
                    <ShieldCheck className="h-5 w-5 text-indigo-600" />
                  </div>
                  <p className="mt-2 text-xl font-bold text-slate-900">
                    {currentPlan?.planName ?? "No Active Plan"}
                  </p>
                  <span className="mt-1 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    {currentPlan?.status ?? "Inactive"}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Billing Amount
                    </span>
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="mt-2 text-xl font-bold text-slate-900">
                    ₹{(currentPlan?.price ?? 0).toLocaleString("en-IN")}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {currentPlan?.billingCycle ?? "Monthly"} billing cycle
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Next Renewal / Expiry
                    </span>
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="mt-2 text-xl font-bold text-slate-900">
                    {currentPlan?.endsAt
                      ? new Date(currentPlan.endsAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Auto-renewal enabled</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Last Payment Ref
                    </span>
                    <RefreshCw className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="mt-2 truncate font-mono text-sm font-bold text-slate-900">
                    {currentPlan?.razorpayPaymentId ?? "N/A"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Razorpay verified</p>
                </div>
              </div>

              {/* Usage Limits */}
              {billingData?.usage && <UsageLimitCard usage={billingData.usage} />}

              {/* Invoices */}
              <InvoiceHistoryTable invoices={billingData?.invoices ?? []} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}