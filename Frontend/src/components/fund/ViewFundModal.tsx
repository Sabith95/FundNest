import { X, Wallet, Users, Layers, ShieldCheck, ShieldAlert } from "lucide-react";
import type { ChitFund } from "../../services/tenantFundService";

interface ViewFundModalProps {
  fund: ChitFund | null;
  onClose: () => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ViewFundModal({ fund, onClose }: ViewFundModalProps) {
  if (!fund) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900">{fund.name}</h3>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  fund.isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {fund.isActive ? (
                  <>
                    <ShieldCheck className="h-3 w-3" /> Active
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-3 w-3" /> Blocked
                  </>
                )}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">ID: {fund.id}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm text-slate-700">
          {fund.description && (
            <div className="rounded-xl bg-slate-50 p-3.5 text-slate-600">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Description
              </p>
              <p>{fund.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <Wallet className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Chit Pool Value
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(fund.chitValue)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Monthly Contribution
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(fund.contributionAmount)}
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white">
            <div className="flex justify-between px-4 py-3">
              <span className="text-slate-500">Fund Type</span>
              <span className="font-semibold text-slate-800">
                {fund.fundType === "MULTI_DIVISION" ? (
                  <span className="inline-flex items-center gap-1 text-indigo-600">
                    <Layers className="h-3.5 w-3.5" /> Multi-Division ({fund.division} Divs)
                  </span>
                ) : (
                  "Normal Chit"
                )}
              </span>
            </div>

            <div className="flex justify-between px-4 py-3">
              <span className="text-slate-500">Duration</span>
              <span className="font-semibold text-slate-800">
                {fund.durationMonths} Months
              </span>
            </div>

            <div className="flex justify-between px-4 py-3">
              <span className="text-slate-500">Members Enrolled</span>
              <span className="font-semibold text-slate-800">
                {fund.currentMembersCount} / {fund.totalMembers}
              </span>
            </div>

            <div className="flex justify-between px-4 py-3">
              <span className="text-slate-500">Start Date</span>
              <span className="font-semibold text-slate-800">
                {new Date(fund.startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}