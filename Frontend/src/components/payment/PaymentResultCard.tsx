import { CheckCircle2, XCircle, ArrowLeft, type LucideIcon } from "lucide-react";
import type { PaymentResult } from "../../types/payment.types";

interface PaymentResultCardProps {
  result: PaymentResult;
  /** "View billing details" on success, "Retry payment" on failure */
  onPrimaryAction: () => void;
  onGoBack: () => void;
  /** Failure only — disables the retry button while a fresh checkout is being started */
  isRetrying?: boolean;
  className?: string;
}

interface VisualConfig {
  icon: LucideIcon;
  iconWrapperClass: string;
  iconClass: string;
  title: string;
  message: string;
  primaryLabel: string;
  primaryButtonClass: string;
}

// Centralizes every success/failure difference in one place, so the JSX below
// never has to branch on `result.status` more than once.
function getVisualConfig(result: PaymentResult, isRetrying: boolean): VisualConfig {
  if (result.status === "success") {
    return {
      icon: CheckCircle2,
      iconWrapperClass: "bg-emerald-50",
      iconClass: "text-emerald-500",
      title: "Payment successful",
      message: `Thank you! Your payment for the ${result.planName ?? "selected"} plan has been received.`,
      primaryLabel: "View billing details",
      primaryButtonClass: "bg-indigo-600 hover:bg-indigo-700",
    };
  }

  return {
    icon: XCircle,
    iconWrapperClass: "bg-red-50",
    iconClass: "text-red-500",
    title: "Payment failed",
    message:
      result.reason ??
      "Something went wrong while processing your payment. No amount has been deducted.",
    primaryLabel: isRetrying ? "Retrying…" : "Retry payment",
    primaryButtonClass: "bg-red-600 hover:bg-red-700",
  };
}

export default function PaymentResultCard({
  result,
  onPrimaryAction,
  onGoBack,
  isRetrying = false,
  className = "",
}: PaymentResultCardProps) {
  const isSuccess = result.status === "success";
  const config = getVisualConfig(result, isRetrying);
  const Icon = config.icon;

  return (
    <div
      className={`flex w-full max-w-md flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10 ${className}`}
    >
      <div className={`flex h-16 w-16 items-center justify-center rounded-full ${config.iconWrapperClass}`}>
        <Icon className={`h-8 w-8 ${config.iconClass}`} />
      </div>

      <h2 className="mt-6 text-xl font-bold text-slate-900">{config.title}</h2>
      <p className="mt-2 text-sm text-slate-500">{config.message}</p>

      {(result.planName || result.amount !== undefined || isSuccess || result.errorCode) && (
        <div className="mt-6 w-full space-y-2 rounded-xl bg-slate-50 px-4 py-4 text-left text-sm">
          {result.planName && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Plan</span>
              <span className="font-medium text-slate-800">{result.planName}</span>
            </div>
          )}
          {result.amount !== undefined && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Amount</span>
              <span className="font-medium text-slate-800">
                {result.currency ?? "₹"}
                {result.amount.toLocaleString("en-IN")}
              </span>
            </div>
          )}
          {isSuccess ? (
            <div className="flex items-center justify-between gap-3">
              <span className="shrink-0 text-slate-500">Transaction ID</span>
              <span className="truncate font-mono text-xs font-medium text-slate-800">
                {result.transactionId}
              </span>
            </div>
          ) : (
            result.errorCode && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Error code</span>
                <span className="font-mono text-xs font-medium text-slate-800">
                  {result.errorCode}
                </span>
              </div>
            )
          )}
        </div>
      )}

      <div className="mt-8 flex w-full flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={onGoBack}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back
        </button>
        <button
          type="button"
          onClick={onPrimaryAction}
          disabled={!isSuccess && isRetrying}
          className={`flex flex-1 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60 ${config.primaryButtonClass}`}
        >
          {config.primaryLabel}
        </button>
      </div>
    </div>
  );
}