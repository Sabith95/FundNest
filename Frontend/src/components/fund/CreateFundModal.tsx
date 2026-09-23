import React, { useState, useMemo, useEffect } from "react";
import { X, Layers, Plus, Loader2, AlertCircle, Calculator, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  tenantFundService,
 type FundType,
} from "../../services/tenantFundService";

interface CreateFundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateFundModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateFundModalProps) {
  const [fundType, setFundType] = useState<FundType>("NORMAL");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [chitValue, setChitValue] = useState<number | "">("");
  const [contributionAmount, setContributionAmount] = useState<number | "">("");
  const [durationMonths, setDurationMonths] = useState<number | "">("");
  const [totalMembers, setTotalMembers] = useState<number | "">("");
  const [division, setDivision] = useState<number | "">(4);
  const [startDate, setStartDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [durationManuallyEdited, setDurationManuallyEdited] = useState(false);

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Real-time Field Validation
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};

    // Name Validation
    if (!name.trim()) {
      errs.name = "Fund name is required";
    } else if (name.trim().length < 2) {
      errs.name = "Fund name must be at least 2 characters";
    } else if (name.trim().length > 100) {
      errs.name = "Fund name cannot exceed 100 characters";
    }

    // Description Validation
    if (description.length > 500) {
      errs.description = "Description cannot exceed 500 characters";
    }

    // Chit Value Validation
    if (!chitValue || Number(chitValue) <= 0) {
      errs.chitValue = "Total chit pool must be greater than 0";
    }

    // Contribution Amount Validation
    if (!contributionAmount || Number(contributionAmount) <= 0) {
      errs.contributionAmount = "Monthly contribution must be greater than 0";
    }

    // Duration Months Validation
    if (!durationMonths || Number(durationMonths) <= 0) {
      errs.durationMonths = "Duration must be at least 1 month";
    }

    // Total Members Validation
    if (!totalMembers || Number(totalMembers) < 2) {
      errs.totalMembers = "Total members must be at least 2";
    }

    // Division Validation (Multi-Division only)
    if (fundType === "MULTI_DIVISION") {
      if (!division || Number(division) < 2 || Number(division) > 10) {
        errs.division = "Divisions must be between 2 and 10";
      }
    }

    // Start Date Validation
    if (!startDate) {
      errs.startDate = "Start date is required";
    } else {
      const selected = new Date(startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errs.startDate = "Start date cannot be in the past";
      }
    }

    return errs;
  }, [
    name,
    description,
    chitValue,
    contributionAmount,
    durationMonths,
    totalMembers,
    division,
    startDate,
    fundType,
  ]);

  const isValid = Object.keys(errors).length === 0;

  // Auto-calculation helper: Contribution * Members = Recommended Chit Value
  const calculatedPool = useMemo(() => {
    const contrib = Number(contributionAmount) || 0;
    const members = Number(totalMembers) || 0;
    return contrib > 0 && members > 0 ? contrib * members : null;
  }, [contributionAmount, totalMembers]);

  // Duration = Pool Value / Monthly Installment (falls back to suggested pool)
  const calculatedDuration = useMemo(() => {
    const pool = Number(chitValue) || calculatedPool || 0;
    const contrib = Number(contributionAmount) || 0;
    if (pool <= 0 || contrib <= 0) return null;
    return pool / contrib;
  }, [chitValue, contributionAmount, calculatedPool]);

  const suggestedDurationMonths =
    calculatedDuration != null && Number.isFinite(calculatedDuration)
      ? Math.round(calculatedDuration)
      : null;

  const durationDividesEvenly =
    calculatedDuration != null && Number.isInteger(calculatedDuration);

  const handleAutoSetPool = () => {
    if (!calculatedPool) return;
    setChitValue(calculatedPool);
    const contrib = Number(contributionAmount) || 0;
    if (contrib > 0) {
      setDurationMonths(calculatedPool / contrib);
      setDurationManuallyEdited(false);
    }
  };

  const handleAutoSetDuration = () => {
    if (suggestedDurationMonths == null || suggestedDurationMonths < 1) return;
    setDurationMonths(suggestedDurationMonths);
    setDurationManuallyEdited(false);
  };

  useEffect(() => {
    if (durationManuallyEdited) return;
    if (
      calculatedDuration != null &&
      Number.isInteger(calculatedDuration) &&
      calculatedDuration >= 1
    ) {
      setDurationMonths(calculatedDuration);
    }
  }, [calculatedDuration, durationManuallyEdited]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields touched
    setTouched({
      name: true,
      description: true,
      chitValue: true,
      contributionAmount: true,
      durationMonths: true,
      totalMembers: true,
      division: true,
      startDate: true,
    });

    if (!isValid) {
      toast.error("Please fix form errors before submitting");
      return;
    }

    try {
      setSubmitting(true);
      const isoStartDate = new Date(startDate).toISOString();

      if (fundType === "NORMAL") {
        await tenantFundService.createNormalFund({
          name: name.trim(),
          description: description.trim() || undefined,
          chitValue: Number(chitValue),
          contributionAmount: Number(contributionAmount),
          durationMonths: Number(durationMonths),
          totalMembers: Number(totalMembers),
          startDate: isoStartDate,
        });
      } else {
        await tenantFundService.createMultiDivisionFund({
          name: name.trim(),
          description: description.trim() || undefined,
          chitValue: Number(chitValue),
          contributionAmount: Number(contributionAmount),
          durationMonths: Number(durationMonths),
          totalMembers: Number(totalMembers),
          division: Number(division),
          startDate: isoStartDate,
        });
      }

      toast.success("Chit Fund created successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to create fund:", err);
      toast.error(
        err.response?.data?.message || "Failed to create fund. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Create New Fund Plan
            </h3>
            <p className="text-xs text-slate-500">
              Set up a new chit scheme with automated calculations
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Category Switcher */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Fund Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFundType("NORMAL")}
                className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 px-3 text-sm font-semibold transition-all ${
                  fundType === "NORMAL"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <Plus className="h-4 w-4" /> Normal Chit
              </button>
              <button
                type="button"
                onClick={() => setFundType("MULTI_DIVISION")}
                className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 px-3 text-sm font-semibold transition-all ${
                  fundType === "MULTI_DIVISION"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <Layers className="h-4 w-4" /> Multi-Division
              </button>
            </div>
          </div>

          {/* Fund Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Fund Name *
            </label>
            <input
              type="text"
              value={name}
              onBlur={() => markTouched("name")}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Diamond Monthly Savings Scheme"
              className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm text-slate-800 transition-colors focus:outline-none ${
                touched.name && errors.name
                  ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              }`}
            />
            {touched.name && errors.name && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onBlur={() => markTouched("description")}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of rules or pool structure..."
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            {touched.description && errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Monthly Contribution & Total Members */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Monthly Contribution ($) *
              </label>
              <input
                type="number"
                min={1}
                value={contributionAmount}
                onBlur={() => markTouched("contributionAmount")}
                onChange={(e) =>
                  setContributionAmount(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
                placeholder="20000"
                className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm text-slate-800 transition-colors focus:outline-none ${
                  touched.contributionAmount && errors.contributionAmount
                    ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                }`}
              />
              {touched.contributionAmount && errors.contributionAmount && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.contributionAmount}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Total Members *
              </label>
              <input
                type="number"
                min={2}
                value={totalMembers}
                onBlur={() => markTouched("totalMembers")}
                onChange={(e) =>
                  setTotalMembers(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
                placeholder="25"
                className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm text-slate-800 transition-colors focus:outline-none ${
                  touched.totalMembers && errors.totalMembers
                    ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                }`}
              />
              {touched.totalMembers && errors.totalMembers && (
                <p className="mt-1 text-xs text-red-500">{errors.totalMembers}</p>
              )}
            </div>
          </div>

          {/* Chit Value & Calculation Helper */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-700">
                Total Chit Pool Value ($) *
              </label>
              {calculatedPool && Number(chitValue) !== calculatedPool && (
                <button
                  type="button"
                  onClick={handleAutoSetPool}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <Calculator className="h-3 w-3" /> Auto-set (${calculatedPool.toLocaleString()})
                </button>
              )}
            </div>
            <input
              type="number"
              min={1}
              value={chitValue}
              onBlur={() => markTouched("chitValue")}
              onChange={(e) =>
                setChitValue(e.target.value ? Number(e.target.value) : "")
              }
              placeholder="500000"
              className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm text-slate-800 transition-colors focus:outline-none ${
                touched.chitValue && errors.chitValue
                  ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              }`}
            />
            {touched.chitValue && errors.chitValue && (
              <p className="mt-1 text-xs text-red-500">{errors.chitValue}</p>
            )}

            {/* Smart Math Helper Note */}
            {calculatedPool && (
              <div className="mt-1.5 flex items-center justify-between rounded-lg bg-indigo-50/60 px-3 py-1.5 text-xs text-indigo-700">
                <span>
                  Contribution (${Number(contributionAmount).toLocaleString()}) × Members ({totalMembers}) = <strong>${calculatedPool.toLocaleString()}</strong>
                </span>
                {Number(chitValue) === calculatedPool && (
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Matched
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Duration & Division */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between gap-2">
                <label className="block text-xs font-medium text-slate-700">
                  Duration (Months) *
                </label>
                {suggestedDurationMonths != null &&
                  suggestedDurationMonths >= 1 &&
                  Number(durationMonths) !== suggestedDurationMonths && (
                    <button
                      type="button"
                      onClick={handleAutoSetDuration}
                      className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      <Calculator className="h-3 w-3" /> Auto-set (
                      {suggestedDurationMonths})
                    </button>
                  )}
              </div>
              <input
                type="number"
                min={1}
                value={durationMonths}
                onBlur={() => markTouched("durationMonths")}
                onChange={(e) => {
                  setDurationManuallyEdited(true);
                  setDurationMonths(
                    e.target.value ? Number(e.target.value) : ""
                  );
                }}
                placeholder="25"
                className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm text-slate-800 transition-colors focus:outline-none ${
                  touched.durationMonths && errors.durationMonths
                    ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                }`}
              />
              {touched.durationMonths && errors.durationMonths && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.durationMonths}
                </p>
              )}
              {calculatedDuration != null && (
                <div className="mt-1.5 rounded-lg bg-indigo-50/60 px-2.5 py-1.5 text-[11px] leading-snug text-indigo-700">
                  {durationDividesEvenly ? (
                    <span className="flex items-center justify-between gap-1">
                      <span>
                        Pool ÷ Installment ={" "}
                        <strong>{calculatedDuration} mo</strong>
                      </span>
                      {Number(durationMonths) === calculatedDuration && (
                        <span className="flex items-center gap-0.5 font-semibold text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" /> Matched
                        </span>
                      )}
                    </span>
                  ) : (
                    <span>
                      Pool ÷ Installment ≈ {calculatedDuration.toFixed(2)} mo
                      (rounded to {suggestedDurationMonths})
                    </span>
                  )}
                </div>
              )}
            </div>

            {fundType === "MULTI_DIVISION" ? (
              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Divisions (2-10) *
                </label>
                <input
                  type="number"
                  min={2}
                  max={10}
                  value={division}
                  onBlur={() => markTouched("division")}
                  onChange={(e) =>
                    setDivision(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="4"
                  className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm text-slate-800 transition-colors focus:outline-none ${
                    touched.division && errors.division
                      ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  }`}
                />
                {touched.division && errors.division && (
                  <p className="mt-1 text-xs text-red-500">{errors.division}</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onBlur={() => markTouched("startDate")}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm text-slate-800 transition-colors focus:outline-none ${
                    touched.startDate && errors.startDate
                      ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  }`}
                />
                {touched.startDate && errors.startDate && (
                  <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>
                )}
              </div>
            )}
          </div>

          {fundType === "MULTI_DIVISION" && (
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onBlur={() => markTouched("startDate")}
                onChange={(e) => setStartDate(e.target.value)}
                className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm text-slate-800 transition-colors focus:outline-none ${
                  touched.startDate && errors.startDate
                    ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                }`}
              />
              {touched.startDate && errors.startDate && (
                <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create Plan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}