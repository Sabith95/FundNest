import {
  Ban,
  Check,
  Pencil,
  RotateCcw,
  X,
  type LucideIcon,
} from "lucide-react";

import type { SubscriptionPlan } from "../../types/subsctiption.types";

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  icon?: LucideIcon;
  onEdit: (plan: SubscriptionPlan) => void;
  onToggleStatus: (plan: SubscriptionPlan) => void;
}

const formatLimit = (value: number | null): string =>
  value === null ? "Unlimited" : value.toLocaleString("en-IN");

export default function SubscriptionPlanCard({
  plan,
  icon: Icon,
  onEdit,
  onToggleStatus,
}: SubscriptionPlanCardProps) {
  const isPopular = plan.planType === "PRO";
  const period = plan.billingCycle === "YEARLY" ? "year" : "month";

  const features = [
    { label: `Max funds: ${formatLimit(plan.maxFunds)}`, included: true },
    { label: `Max users: ${formatLimit(plan.maxUsers)}`, included: true },
    { label: "Autopay", included: plan.hasAutopay },
    {
      label: "Fund suggestions",
      included: plan.hasFundSuggestions,
    },
  ];

  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border transition-shadow ${
        isPopular
          ? "border-transparent bg-gradient-to-b from-indigo-950 to-slate-900 text-white shadow-xl shadow-indigo-950/20"
          : "border-slate-200 bg-white text-slate-900 hover:shadow-md"
      } ${!plan.isActive ? "opacity-70" : ""}`}
    >
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-400 px-3 py-1 text-[11px] font-semibold text-emerald-950">
          Most popular
        </span>
      )}

      <div className="flex items-start justify-between px-6 pt-7">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            isPopular ? "bg-white/10" : "bg-indigo-100"
          }`}
        >
          {Icon && (
            <Icon
              className={`h-5 w-5 ${
                isPopular ? "text-emerald-300" : "text-indigo-600"
              }`}
            />
          )}
        </div>

        <div className="flex gap-2">
          {!plan.isActive && (
            <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-700">
              Blocked
            </span>
          )}
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
              isPopular
                ? "bg-white/10 text-white/80"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {plan.planType}
          </span>
        </div>
      </div>

      <div className="px-6 pt-5">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <p
          className={`mt-1.5 text-sm ${
            isPopular ? "text-white/70" : "text-slate-500"
          }`}
        >
          {plan.durationDays} day subscription
        </p>
      </div>

      <div className="px-6 pt-6">
        <span className="text-4xl font-extrabold">
          ₹{plan.price.toLocaleString("en-IN")}
        </span>
        <span
          className={`text-sm font-medium ${
            isPopular ? "text-white/60" : "text-slate-400"
          }`}
        >
          /{period}
        </span>
      </div>

      <ul className="flex-1 space-y-3 px-6 py-6">
        {features.map((feature) => (
          <li key={feature.label} className="flex items-center gap-2.5 text-sm">
            {feature.included ? (
              <Check
                className={`h-4 w-4 shrink-0 rounded-full p-0.5 ${
                  isPopular
                    ? "bg-emerald-400 text-emerald-950"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              />
            ) : (
              <X
                className={`h-4 w-4 shrink-0 rounded-full p-0.5 ${
                  isPopular
                    ? "bg-white/10 text-white/40"
                    : "bg-slate-200 text-slate-400"
                }`}
              />
            )}
            <span
              className={
                feature.included
                  ? ""
                  : isPopular
                    ? "text-white/40"
                    : "text-slate-400"
              }
            >
              {feature.label}
            </span>
          </li>
        ))}
      </ul>

      <div
        className={`mt-auto flex gap-2 px-6 pb-6 ${
          isPopular ? "pt-2" : "border-t border-slate-200 pt-5"
        }`}
      >
        <button
          type="button"
          onClick={() => onEdit(plan)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold ${
            isPopular
              ? "bg-white text-slate-900 hover:bg-white/90"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onToggleStatus(plan)}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold ${
            plan.isActive
              ? isPopular
                ? "bg-red-500/20 text-red-100 hover:bg-red-500/30"
                : "bg-red-50 text-red-600 hover:bg-red-100"
              : isPopular
                ? "bg-emerald-400 text-emerald-950 hover:bg-emerald-300"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          }`}
        >
          {plan.isActive ? (
            <>
              <Ban className="h-3.5 w-3.5" />
              Block
            </>
          ) : (
            <>
              <RotateCcw className="h-3.5 w-3.5" />
              Unblock
            </>
          )}
        </button>
      </div>
    </div>
  );
}
