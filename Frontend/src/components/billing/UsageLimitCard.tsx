import { Database, Users, CheckCircle, Zap, ShieldAlert } from "lucide-react";
import type { SubscriptionUsage } from "../../types/billing.types";

interface UsageLimitCardProps {
  usage: SubscriptionUsage;
}

export default function UsageLimitCard({ usage }: UsageLimitCardProps) {
  const renderProgressBar = (used: number, limit: number | null) => {
    if (limit === null) {
      return (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-500">
            <span>{used} Used</span>
            <span className="font-semibold text-emerald-600">Unlimited</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-full bg-emerald-500" />
          </div>
        </div>
      );
    }

    const percentage = Math.min(Math.round((used / limit) * 100), 100);
    const isHigh = percentage >= 80;

    return (
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-600">{used} of {limit} used</span>
          <span className={isHigh ? "font-semibold text-amber-600" : "text-slate-500"}>
            {percentage}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full transition-all duration-300 ${
              isHigh ? "bg-amber-500" : "bg-indigo-600"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Plan Usage & Limits</h3>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Funds Limit Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Fund Creation
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Database className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {usage.funds.limit === null ? `${usage.funds.used} Funds` : `${usage.funds.used} / ${usage.funds.limit}`}
          </p>
          <div className="mt-4">{renderProgressBar(usage.funds.used, usage.funds.limit)}</div>
        </div>

        {/* Users Limit Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Team Members / Users
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {usage.users.limit === null ? `${usage.users.used} Users` : `${usage.users.used} / ${usage.users.limit}`}
          </p>
          <div className="mt-4">{renderProgressBar(usage.users.used, usage.users.limit)}</div>
        </div>

        {/* Included Features */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Included Features
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Zap className="h-5 w-5" />
            </div>
          </div>

          <ul className="mt-4 space-y-2.5 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Automated Autopay</span>
              {usage.hasAutopay ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <CheckCircle className="h-4 w-4" /> Enabled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                  <ShieldAlert className="h-4 w-4" /> Not Included
                </span>
              )}
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Fund Suggestions</span>
              {usage.hasFundSuggestions ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <CheckCircle className="h-4 w-4" /> Enabled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                  <ShieldAlert className="h-4 w-4" /> Not Included
                </span>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}