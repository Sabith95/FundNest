import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  MapPin,
  IdCard,
  Loader2,
  Building2,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { tenantAuthService } from "../../../services/tenantAuthService";
import { isAxiosError } from "axios";
import { ROUTES } from "../../../shared/constants";
import { getErrorMessage } from "../../../utitls/errorUtils";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  updateOnboardingStep,
  updateTenantStatus,
} from "../../../store/slices/tenantSlice";
import { TENANT_STATUS } from "../../../shared/constants";

const ENTITY_TYPES = [
  "Sole Proprietorship",
  "Partnership",
  "Limited Liability Company (LLC)",
  "Corporation",
  "Non-Profit",
] as const;

interface BusinessSetupFormData {
  businessType: string;
  registeredBusinessAddress: string;
  registrationId: string;
}

type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED" | undefined;

const TOTAL_STEPS = 3;
const CURRENT_STEP = 1;
const PROGRESS_PERCENT = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

const BusinessSetup: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const tenant = useAppSelector((state) => state.tenant.tenant);

  const busInfoVerification = tenant?.businessInfo?.verification;
  const verificationStatus: VerificationStatus = busInfoVerification?.status;
  const rejectionReason =
    verificationStatus === "REJECTED"
      ? busInfoVerification?.rejectionReason
      : undefined;

  // Three distinct modes driven off verification state, not just "is there a component variant"
  const isResubmit = verificationStatus === "REJECTED";
  const isPendingReview = verificationStatus === "PENDING";
  const isFirstTimeSetup = !verificationStatus; // never submitted before

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<BusinessSetupFormData>>({});
  const [formData, setFormData] = useState<BusinessSetupFormData>({
    businessType: tenant?.businessInfo?.businessType || "",
    registrationId: tenant?.businessInfo?.registrationId || "",
    registeredBusinessAddress:
      tenant?.businessInfo?.registeredBusinessAddress || "",
  });

  // Already approved — nothing to do on this page, send them onward
  useEffect(() => {
    if (verificationStatus === "APPROVED") {
      navigate(ROUTES.TENANT.DASHBOARD, { replace: true });
    }
  }, [verificationStatus, navigate]);

  const handleChange = (field: keyof BusinessSetupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<BusinessSetupFormData> = {};
    if (!formData.businessType)
      newErrors.businessType = "Business type is required";
    if (!formData.registeredBusinessAddress)
      newErrors.registeredBusinessAddress = "Registered address is required";
    if (!formData.registrationId)
      newErrors.registrationId = "Registration ID is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await tenantAuthService.updateBusinessInfo(formData);

      if (isResubmit) {
        dispatch(updateTenantStatus(TENANT_STATUS.PENDING));
        toast.success("Business details resubmitted for review.", {
          position: "top-center",
        });
        navigate(ROUTES.TENANT.DASHBOARD);
      } else {
        dispatch(updateOnboardingStep(result.tenant.onboardingStep));
        toast.success("Business information updated successfully", {
          position: "top-center",
        });
        navigate(ROUTES.TENANT.KYC_UPLOAD);
      }
    } catch (error: any) {
      let errorMessage = isResubmit
        ? "Failed to resubmit business information"
        : "Failed to update business information";
      if (isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = getErrorMessage(error, errorMessage);
      }
      toast.error(errorMessage, { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  };

  // Submitted and waiting on admin review — don't let them edit or resubmit
  if (isPendingReview) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex flex-col">
        <header className="w-full border-b border-slate-100 bg-white px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-lg font-bold text-indigo-900"
          >
            <ArrowLeft className="h-5 w-5 text-indigo-700" />
            <span>FundNest</span>
          </button>
        </header>
        <main className="flex flex-1 flex-col items-center px-4 py-10">
          <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-50 text-amber-600 mx-auto">
              <Clock className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-4">
              Verification Pending
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Your business information is under review. We'll notify you once
              it's approved. This usually takes 1–2 business days.
            </p>
            <button
              onClick={() => navigate(ROUTES.TENANT.DASHBOARD)}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Go to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      {/* Top nav */}
      <header className="w-full border-b border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-lg font-bold text-indigo-900 sm:text-xl"
          >
            <ArrowLeft className="h-5 w-5 shrink-0 text-indigo-700" />
            <span>FundNest</span>
          </button>

          {isFirstTimeSetup ? (
            <span className="text-sm font-medium text-slate-500">
              Step {CURRENT_STEP} of {TOTAL_STEPS}
            </span>
          ) : (
            <span className="text-sm font-medium text-slate-500">
              Resubmission
            </span>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          {/* Section title + progress (first-time setup only) */}
          {isFirstTimeSetup && (
            <>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <h1 className="text-2xl font-bold text-indigo-900 sm:text-3xl">
                  Business Setup
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
            </>
          )}

          {/* Card */}
          <div className="overflow-hidden rounded-2xl border-t-4 border-indigo-700 bg-white shadow-sm">
            <form
              onSubmit={handleSubmit}
              className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12"
            >
              <div className="mb-8 text-center">
                {isResubmit ? (
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 mx-auto mb-3">
                    <Building2 className="h-6 w-6" />
                  </div>
                ) : null}
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  {isResubmit
                    ? "Update Business Details"
                    : "Establish your entity"}
                </h2>
                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  {isResubmit
                    ? "Correct the details below and resubmit for review."
                    : "Provide your core business details to unlock specialized financial tooling."}
                </p>
              </div>

              {/* Rejection banner — only ever shown for actual rejected verifications */}
              {isResubmit && rejectionReason && (
                <div className="mb-6 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                  <span>Rejection Reason: {rejectionReason}</span>
                </div>
              )}

              <div className="space-y-6">
                {/* Business Type */}
                <div>
                  <label
                    htmlFor="businessType"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Business Type
                  </label>
                  <div className="relative">
                    <select
                      id="businessType"
                      value={formData.businessType}
                      onChange={(e) =>
                        handleChange("businessType", e.target.value)
                      }
                      className="w-full appearance-none rounded-lg bg-slate-100 px-4 py-3.5 pr-10 text-slate-900 outline-none ring-1 ring-inset ring-transparent transition focus:bg-white focus:ring-2 focus:ring-indigo-600"
                    >
                      <option value="" disabled>
                        Select an entity type
                      </option>
                      {ENTITY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  </div>
                  {errors.businessType && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.businessType}
                    </p>
                  )}
                </div>

                {/* Registered Business Address */}
                <div>
                  <label
                    htmlFor="registeredBusinessAddress"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Registered Business Address
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      id="registeredBusinessAddress"
                      type="text"
                      placeholder="123 Financial District, Suite 400"
                      value={formData.registeredBusinessAddress}
                      onChange={(e) =>
                        handleChange(
                          "registeredBusinessAddress",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg bg-slate-100 py-3.5 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none ring-1 ring-inset ring-transparent transition focus:bg-white focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  {errors.registeredBusinessAddress && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.registeredBusinessAddress}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-400">
                    Physical address where your business is legally registered.
                  </p>
                </div>

                {/* Registration ID */}
                <div>
                  <label
                    htmlFor="registrationId"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Registration ID
                  </label>
                  <div className="relative">
                    <IdCard className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      id="registrationId"
                      type="text"
                      placeholder="CRN, EIN, or Local License"
                      value={formData.registrationId}
                      onChange={(e) =>
                        handleChange("registrationId", e.target.value)
                      }
                      className="w-full rounded-lg bg-slate-100 py-3.5 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none ring-1 ring-inset ring-transparent transition focus:bg-white focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  {errors.registrationId && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.registrationId}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-800 to-indigo-600 py-3.5 text-base font-semibold text-white shadow-sm transition hover:from-indigo-900 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : isResubmit ? (
                  <>
                    Resubmit Business Information
                    <CheckCircle2 className="h-5 w-5" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-slate-400">
                Securely encrypted with Bank-Grade Security
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
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

export default BusinessSetup;
