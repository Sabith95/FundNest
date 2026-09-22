import { memo, useMemo } from "react";
import { ArrowUp, CalendarClock, Download } from "lucide-react";
import type {
  BillingRecord,
  BillingStatus,
  PlanDetails,
  PlanStatus,
  UsageMetric,
} from "../../../types/tenant.types";

interface SubscriptionBillingProps {
  plan: PlanDetails;
  usageMetrics: UsageMetric[];
  billingRecords: BillingRecord[];
  onUpgrade?: () => void;
  onCancelSubscription?: () => void;
  onViewAllInvoices?: () => void;
  onDownloadInvoice?: (record: BillingRecord) => void;
}

type Status = BillingStatus | PlanStatus;

const STATUS_STYLES: Record<Status, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  PAID: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  FAILED: "bg-rose-100 text-rose-600",
  INACTIVE: "bg-slate-100 text-slate-600",
  CANCELLED: "bg-slate-100 text-slate-600",
};

const StatusBadge = memo(function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
});

const UsageBar = memo(function UsageBar({ metric }: { metric: UsageMetric }) {
  const {
    label,
    used,
    total,
    unitLabel,
    barColorClassName = "bg-indigo-600",
  } = metric;

  const percentage = useMemo(
    () => (total <= 0 ? 0 : Math.min(100, Math.round((used / total) * 100))),
    [used, total],
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-900">{label}</span>
        <span className="text-slate-500">
          {used} / {total} {unitLabel}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={total}
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
      >
        <div
          className={`h-full rounded-full ${barColorClassName} transition-[width] duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function SubscriptionBilling({
  plan,
  usageMetrics,
  billingRecords,
  onUpgrade,
  onCancelSubscription,
  onViewAllInvoices,
  onDownloadInvoice,
}: SubscriptionBillingProps) {
  const formattedRenewalDate = useMemo(
    () => formatDate(plan.nextRenewalDate),
    [plan.nextRenewalDate],
  );

  const formattedRecords = useMemo(
    () =>
      billingRecords.map((record) => ({
        ...record,
        formattedDate: formatDate(record.date),
        formattedAmount: `${plan.currency}${record.amount.toFixed(2)}`,
      })),
    [billingRecords, plan.currency],
  );

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Breadcrumb + heading */}
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <ol className="flex items-center gap-2">
            <li>Settings</li>
            <li className="text-slate-300">/</li>
            <li className="text-slate-700">Subscription</li>
          </ol>
        </nav>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-[28px]">
          Manage your workspace plan
        </h1>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column: plan + usage */}
          <div className="space-y-6 lg:col-span-2">
            {/* Plan card */}
            <section
              aria-labelledby="current-plan-heading"
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h2
                      id="current-plan-heading"
                      className="text-xl font-bold text-slate-900"
                    >
                      {plan.name}
                    </h2>
                    <StatusBadge status={plan.status} />
                  </div>
                  <p className="mt-1.5 max-w-sm text-sm text-slate-500">
                    {plan.description}
                  </p>
                </div>

                <p className="whitespace-nowrap text-right">
                  <span className="text-2xl font-bold text-indigo-600">
                    {plan.currency}
                    {plan.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-500">
                    /{plan.billingCycle}
                  </span>
                </p>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5">
                <CalendarClock size={18} className="shrink-0 text-indigo-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Next renewal date
                  </p>
                  <p className="text-sm text-slate-500">
                    {formattedRenewalDate}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onUpgrade}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <ArrowUp size={16} />
                  Upgrade Plan
                </button>
                <button
                  type="button"
                  onClick={onCancelSubscription}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  Cancel Subscription
                </button>
              </div>
            </section>

            {/* Usage & limits card */}
            <section
              aria-labelledby="usage-limits-heading"
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <h2
                id="usage-limits-heading"
                className="text-lg font-bold text-slate-900"
              >
                Usage & Limits
              </h2>
              <div className="mt-5 space-y-5">
                {usageMetrics.map((metric) => (
                  <UsageBar key={metric.id} metric={metric} />
                ))}
              </div>
            </section>
          </div>

          {/* Right column: billing history */}
          <section
            aria-labelledby="billing-history-heading"
            className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white lg:col-span-1"
          >
            <div className="p-5 pb-0 sm:p-6 sm:pb-0">
              <h2
                id="billing-history-heading"
                className="text-lg font-bold text-slate-900"
              >
                Billing History
              </h2>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-y border-slate-100 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <th scope="col" className="px-5 py-3 sm:px-6">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3 text-right sm:pr-6">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {formattedRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-700 sm:px-6">
                        {record.formattedDate}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-slate-700">
                        {record.formattedAmount}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <StatusBadge status={record.status} />
                      </td>
                      <td className="px-3 py-4 text-right sm:pr-6">
                        <button
                          type="button"
                          onClick={() => onDownloadInvoice?.(record)}
                          disabled={!record.invoiceUrl}
                          aria-label={`Download invoice for ${record.formattedDate}`}
                          className="inline-flex text-indigo-600 hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-slate-300"
                        >
                          <Download size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-auto border-t border-slate-100 p-4">
              <button
                type="button"
                onClick={onViewAllInvoices}
                className="w-full rounded-lg py-1.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
              >
                View All Invoices
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
