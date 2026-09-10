import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Landmark,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CreditCard,
} from "lucide-react";
import Header from "../../../components/admin/Header";
import Sidebar from "../../../components/admin/Sidebar";
import { adminTenantService } from "../../../services/adminTenantService";
import type {
  TenantDetailsData,
  VerificationState,
} from "../../../types/tenant.types";

interface TenantDetailsProps {
  onReviewDocuments?: () => void;
  onViewBillingHistory?: () => void;
}

const statusBadgeClasses: Record<string, string> = {
  APPROVED: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  REJECTED: "bg-red-100 text-red-700",
};

const verificationBadgeClasses: Record<VerificationState, string> = {
  APPROVED: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-700",
};

/** Renders initials glyph for tenant avatar. */
const initialsOf = (name?: string) => {
  if (!name) return "T";
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "T"
  );
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const TenantDetails: React.FC<TenantDetailsProps> = ({
  onReviewDocuments,
  onViewBillingHistory,
}) => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<TenantDetailsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!tenantId) {
      setError("No tenant ID provided.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    adminTenantService
      .getTenant(tenantId)
      .then((data) => {
        setTenant(data);
      })
      .catch((err) => {
        console.error("Failed to load tenant details:", err);
        setError(
          err?.response?.data?.message || "Failed to load tenant details.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tenantId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-h-screen w-full flex-1 flex-col lg:w-[calc(100%-16rem)]">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav
              className="mb-4 flex items-center gap-1.5 text-xs text-slate-400 sm:text-sm"
              aria-label="Breadcrumb"
            >
              <span>Dashboard</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span>Tenants</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-medium text-slate-600">Tenant Details</span>
            </nav>

            {loading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-sm font-medium text-slate-500">
                  Loading tenant details...
                </p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
                <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
                <p className="mt-2 text-base font-semibold">{error}</p>
              </div>
            ) : tenant ? (
              <>
                {/* Page heading */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    Tenant Details
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage control settings and view verification history for{" "}
                    {tenant.name}.
                  </p>
                </div>

                {/* Top row: profile card + verification status */}
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                  {/* Profile card */}
                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-base font-bold text-indigo-600">
                          {initialsOf(tenant.name)}
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-slate-900">
                            {tenant.name || "N/A"}
                          </h2>
                          <p className="text-sm text-slate-400">
                            Tenant ID: {tenant.id}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                          statusBadgeClasses[tenant.status?.toUpperCase()] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {tenant.status}
                      </span>
                    </div>

                    <dl className="grid grid-cols-1 gap-x-6 gap-y-5 pt-5 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Primary Owner
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-800">
                          {tenant.primaryOwner || "N/A"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Email Address
                        </dt>
                        <dd className="mt-1 truncate text-sm font-semibold text-slate-800">
                          {tenant.email || "N/A"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Phone Number
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-800">
                          {tenant.phone || "N/A"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Registration Date
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-800">
                          {tenant.registrationDate || "N/A"}
                        </dd>
                      </div>
                    </dl>
                  </section>

                  {/* Verification status */}
                  <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-sm sm:p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-indigo-600" />
                      <h3 className="text-base font-bold text-slate-900">
                        Verification Status
                      </h3>
                    </div>

                    <ul className="space-y-2.5">
                      {(tenant.verification || []).map((item) => {
                        const itemStateKey = (
                          item.state || "PENDING"
                        ).toUpperCase() as VerificationState;
                        return (
                          <li
                            key={item.label}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5"
                          >
                            <span className="text-sm font-medium text-slate-700">
                              {item.label}
                            </span>
                            <span
                              className={`rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide ${
                                verificationBadgeClasses[itemStateKey] ||
                                "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {item.state}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    {onReviewDocuments && (
                      <button
                        type="button"
                        onClick={onReviewDocuments}
                        className="mt-4 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50"
                      >
                        Review Documents
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/superadmin/tenants/${tenantId}/kyc`)
                      }
                      className="mt-3 w-full rounded-xl border border-indigo-200 bg-indigo-50 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-100"
                    >
                      Go to KYC Management
                    </button>
                  </section>
                </div>

                {/* Bottom row: subscription + financial details */}
                <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* Subscription plan */}
                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="text-base font-bold text-slate-900">
                      Subscription Plan
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-400">
                      Current billing cycle details
                    </p>

                    {tenant.subscription && tenant.subscription.isActive ? (
                      <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                        <p className="text-sm font-semibold text-indigo-700">
                          {tenant.subscription.planName}
                        </p>
                        <p className="mt-1 flex items-baseline gap-1">
                          <span className="text-2xl font-extrabold text-slate-900">
                            {formatCurrency(tenant.subscription.priceMonthly)}
                          </span>
                          <span className="text-sm font-medium text-slate-500">
                            /mo
                          </span>
                        </p>
                        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <span
                            className="h-2 w-2 rounded-full bg-emerald-500"
                            aria-hidden="true"
                          />
                          Active • Next renewal{" "}
                          {tenant.subscription.nextRenewalDate}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <span className="mt-2 inline-flex items-center rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                          Not Subscribed
                        </span>
                        <p className="mt-1 text-xs text-slate-500">
                          This tenant does not currently have an active
                          subscription plan.
                        </p>
                      </div>
                    )}

                    {onViewBillingHistory && tenant.subscription?.isActive && (
                      <button
                        type="button"
                        onClick={onViewBillingHistory}
                        className="mt-4 w-full py-1.5 text-sm font-semibold text-indigo-600 hover:underline"
                      >
                        View Billing History
                      </button>
                    )}
                  </section>

                  {/* Financial details */}
                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="text-base font-bold text-slate-900">
                      Financial Details
                    </h3>

                    {tenant.financials ? (
                      <>
                        <div className="mt-4 flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                            <Landmark className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                              Bank Name
                            </p>
                            <p className="text-sm font-bold text-slate-900">
                              {tenant.financials.bankName}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                              Account Holder
                            </p>
                            <p className="mt-0.5 text-sm font-semibold text-slate-800">
                              {tenant.financials.accountHolder}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                              Account Number
                            </p>
                            <p className="mt-0.5 text-sm font-semibold tracking-wide text-slate-800">
                              •••• •••• ••••{" "}
                              {tenant.financials.accountNumberLast4}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                        <Landmark className="h-8 w-8 text-slate-400" />
                        <p className="mt-2 text-sm font-medium text-slate-600">
                          No bank details submitted
                        </p>
                        <p className="text-xs text-slate-400">
                          The tenant has not submitted banking information yet.
                        </p>
                      </div>
                    )}
                  </section>
                </div>
              </>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TenantDetails;
