import { CheckCircle2, FileCheck2, Loader2, ShieldCheck } from "lucide-react";

interface VerificationPendingProps {
  tenantName?: string;
  /** ISO date string for when documents were submitted */
  submittedAt?: string;
}

const STEPS = [
  { label: "Registered", icon: CheckCircle2 },
  { label: "Documents submitted", icon: FileCheck2 },
  { label: "Under review", icon: Loader2 },
  { label: "Verified", icon: ShieldCheck },
] as const;

const CURRENT_STEP_INDEX = 2; // "Under review" is in progress

function formatSubmittedDate(iso?: string) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function VerificationPending({
  tenantName,
  submittedAt,
}: VerificationPendingProps) {
  const submittedLabel = formatSubmittedDate(submittedAt);

  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto bg-slate-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        {/* Icon */}
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400/30" />
          <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
            <ShieldCheck className="h-7 w-7 text-indigo-600" />
          </span>
        </div>

        {/* Heading */}
        <div className="mt-6 text-center">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {tenantName
              ? `Hang tight, ${tenantName}`
              : "Hang tight — you're under verification"}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
            Our team is reviewing your business information, KYC documents and
            bank details. This usually takes up to{" "}
            <span className="font-semibold text-slate-700">24 hours</span>.
            We'll notify you by email and in-app the moment you're approved.
          </p>
        </div>

        {/* Stepper */}
        <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
          <ol className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isDone = index < CURRENT_STEP_INDEX;
              const isCurrent = index === CURRENT_STEP_INDEX;
              const isUpcoming = index > CURRENT_STEP_INDEX;

              return (
                <li
                  key={step.label}
                  className="flex flex-1 items-center gap-3 sm:flex-col sm:items-center sm:text-center"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      isDone
                        ? "bg-emerald-100 text-emerald-600"
                        : isCurrent
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${isCurrent ? "animate-spin" : ""}`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium sm:mt-1 ${
                      isUpcoming
                        ? "text-slate-400"
                        : isCurrent
                          ? "text-indigo-700"
                          : "text-slate-600"
                    }`}
                  >
                    {step.label}
                  </span>
                  {index < STEPS.length - 1 && (
                    <div className="hidden h-px flex-1 bg-slate-200 sm:mt-4 sm:block" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Meta info */}
        {submittedLabel && (
          <p className="mt-5 text-center text-xs text-slate-400">
            Documents submitted on{" "}
            <span className="font-medium text-slate-500">{submittedLabel}</span>
          </p>
        )}
      </div>
    </div>
  );
}
