import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Landmark } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { tenantBankService } from "../../../services/tenantBankService";
import { ROUTES } from "../../../shared/constants";

/**
 * BankingDetails
 *
 * Step 3 of 3 (final step) in the FundNest onboarding flow.
 * Reuses the same header and progress-bar pattern as BusinessSetup
 * (logo, back button, step counter, "% Complete" progress bar).
 * Fully responsive, built with Tailwind CSS, with inline field validation.
 */

interface BankingFormData {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
}

type FieldErrors = Partial<Record<keyof BankingFormData, string>>;

const TOTAL_STEPS = 3;
const CURRENT_STEP = 3;
const PROGRESS_PERCENT = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const ACCOUNT_NUMBER_PATTERN = /^\d{9,18}$/;

/** Validates a single field, returning an error message or undefined if valid. */
const validateField = (
  field: keyof BankingFormData,
  value: string
): string | undefined => {
  const trimmed = value.trim();

  switch (field) {
    case "accountHolderName":
      if (!trimmed) return "Account holder name is required.";
      if (trimmed.length < 3)
        return "Account holder name must be at least 3 characters.";
      return undefined;

    case "accountNumber":
      if (!trimmed) return "Account number is required.";
      if (!ACCOUNT_NUMBER_PATTERN.test(trimmed))
        return "Enter a valid account number (9–18 digits).";
      return undefined;

    case "ifscCode":
      if (!trimmed) return "IFSC code is required.";
      if (!IFSC_PATTERN.test(trimmed.toUpperCase()))
        return "Enter a valid IFSC code (e.g. BANK0001234).";
      return undefined;

    default:
      return undefined;
  }
};

const BankingDetails: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BankingFormData>({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof BankingFormData, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof BankingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleBlur = (field: keyof BankingFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, formData[field]),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fields = Object.keys(formData) as (keyof BankingFormData)[];
    const nextErrors: FieldErrors = {};
    fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) nextErrors[field] = error;
    });

    setTouched({
      accountHolderName: true,
      accountNumber: true,
      ifscCode: true,
    });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await tenantBankService.updateBankDetails(formData);
      toast.success("Bank details saved successfully.");
      navigate(ROUTES.TENANT.LOGIN);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to save bank details. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (field: keyof BankingFormData) =>
    [
      "w-full rounded-lg px-4 py-3.5 text-slate-900 placeholder:text-slate-400 outline-none ring-1 ring-inset transition focus:bg-white focus:ring-2",
      errors[field]
        ? "bg-white ring-red-400 focus:ring-red-500"
        : "bg-slate-100 ring-transparent focus:ring-indigo-600",
    ].join(" ");

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      {/* Top nav — same pattern as BusinessSetup */}
      <header className="w-full border-b border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Go back"
            className="flex items-center gap-2 text-lg font-bold text-indigo-900 sm:text-xl"
          >
            <ArrowLeft className="h-5 w-5 shrink-0 text-indigo-700" />
            <span>FundNest</span>
          </button>

          <span className="text-sm font-medium text-slate-500">
            Step {CURRENT_STEP} of {TOTAL_STEPS}
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          {/* Section title + progress — same pattern as BusinessSetup */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-2xl font-bold text-indigo-900 sm:text-3xl">
              Bank Details
            </h1>
            <span className="text-sm font-medium text-slate-500 sm:pb-1">
              {PROGRESS_PERCENT}% Complete
            </span>
          </div>

          <div
            className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
            role="progressbar"
            aria-valuenow={PROGRESS_PERCENT}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-900 to-emerald-700 transition-all duration-500"
              style={{ width: `${PROGRESS_PERCENT}%` }}
            />
          </div>

          {/* Card */}
          <div className="overflow-hidden rounded-2xl border-t-4 border-indigo-700 bg-white shadow-sm">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12"
            >
              <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
                  <Landmark className="h-7 w-7 text-indigo-700" />
                </div>
                <p className="max-w-md text-sm text-slate-500 sm:text-base">
                  Please provide your institutional bank details to
                  facilitate secure fund distributions and settlements.
                </p>
              </div>

              <div className="space-y-6">
                {/* Account Holder Name */}
                <div>
                  <label
                    htmlFor="accountHolderName"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Account Holder Name
                  </label>
                  <input
                    id="accountHolderName"
                    type="text"
                    placeholder="Legal Entity Name"
                    value={formData.accountHolderName}
                    onChange={(e) =>
                      handleChange("accountHolderName", e.target.value)
                    }
                    onBlur={() => handleBlur("accountHolderName")}
                    aria-invalid={!!errors.accountHolderName}
                    aria-describedby={
                      errors.accountHolderName
                        ? "accountHolderName-error"
                        : undefined
                    }
                    className={inputClasses("accountHolderName")}
                  />
                  {errors.accountHolderName && (
                    <p
                      id="accountHolderName-error"
                      role="alert"
                      className="mt-2 text-xs font-medium text-red-600"
                    >
                      {errors.accountHolderName}
                    </p>
                  )}
                </div>

                {/* Account Number + IFSC Code */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="accountNumber"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Account Number
                    </label>
                    <input
                      id="accountNumber"
                      type="text"
                      inputMode="numeric"
                      placeholder="0000 0000 0000"
                      value={formData.accountNumber}
                      onChange={(e) =>
                        handleChange("accountNumber", e.target.value)
                      }
                      onBlur={() => handleBlur("accountNumber")}
                      aria-invalid={!!errors.accountNumber}
                      aria-describedby={
                        errors.accountNumber
                          ? "accountNumber-error"
                          : undefined
                      }
                      className={inputClasses("accountNumber")}
                    />
                    {errors.accountNumber && (
                      <p
                        id="accountNumber-error"
                        role="alert"
                        className="mt-2 text-xs font-medium text-red-600"
                      >
                        {errors.accountNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="ifscCode"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      IFSC Code
                    </label>
                    <input
                      id="ifscCode"
                      type="text"
                      placeholder="BANK0001234"
                      value={formData.ifscCode}
                      onChange={(e) =>
                        handleChange("ifscCode", e.target.value.toUpperCase())
                      }
                      onBlur={() => handleBlur("ifscCode")}
                      aria-invalid={!!errors.ifscCode}
                      aria-describedby={
                        errors.ifscCode ? "ifscCode-error" : undefined
                      }
                      className={inputClasses("ifscCode")}
                    />
                    {errors.ifscCode && (
                      <p
                        id="ifscCode-error"
                        role="alert"
                        className="mt-2 text-xs font-medium text-red-600"
                      >
                        {errors.ifscCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Continue button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-800 to-indigo-600 py-3.5 text-base font-semibold text-white shadow-sm transition hover:from-indigo-900 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Continue"}
                {!isSubmitting && <ArrowRight className="h-5 w-5" />}
              </button>

              <p className="mt-4 text-center text-xs text-slate-400">
                Securely encrypted with Bank-Grade Security
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Footer — same pattern as BusinessSetup */}
      <footer className="w-full py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium tracking-wide text-slate-400">
            <a href="#" className="hover:text-slate-600">
              PRIVACY POLICY
            </a>
            <a href="#" className="hover:text-slate-600">
              TERMS OF SERVICE
            </a>
            <a href="#" className="hover:text-slate-600">
              SECURITY VAULT
            </a>
          </div>
          <p className="text-xs tracking-wide text-slate-300">
            © 2024 FUNDNEST INSTITUTIONAL SERVICES. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BankingDetails;