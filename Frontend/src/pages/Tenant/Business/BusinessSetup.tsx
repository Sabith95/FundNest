import React, { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, MapPin, IdCard, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { tenantAuthService } from "../../../services/tenantAuthService";
import { isAxiosError } from "axios";
import { ROUTES } from "../../../shared/constants";

const ENTITY_TYPES = [
  "Sole Proprietorship",
  "Partnership",
  "Limited Liability Company (LLC)",
  "Corporation",
  "Non-Profit",
] as const;

interface BusinessSetupFormData {
  entityType: string;
  registeredAddress: string;
  registrationId: string;
}

const TOTAL_STEPS = 3;
const CURRENT_STEP = 1;
const PROGRESS_PERCENT = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

const BusinessSetup: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<BusinessSetupFormData>>({});

  const [formData, setFormData] = useState<BusinessSetupFormData>({
    entityType: "",
    registeredAddress: "",
    registrationId: "",
  });

  const handleChange = (
    field: keyof BusinessSetupFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<BusinessSetupFormData> = {};
    if (!formData.entityType) newErrors.entityType = "Business type is required";
    if (!formData.registeredAddress) newErrors.registeredAddress = "Registered address is required";
    if (!formData.registrationId) newErrors.registrationId = "Registration ID is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await tenantAuthService.updateBusinessInfo({
        businessType: formData.entityType,
        registeredBusinessAddress: formData.registeredAddress,
        registrationId: formData.registrationId
      });
      toast.success("Business information updated successfully", { position: "top-center" });
      navigate(ROUTES.TENANT.KYC_UPLOAD);
    } catch (error: any) {
      let errorMessage = "Failed to update business information";
      if (isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage, { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      {/* Top nav */}
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
          {/* Section title + progress */}
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

          {/* Card */}
          <div className="overflow-hidden rounded-2xl border-t-4 border-indigo-700 bg-white shadow-sm">
            <form
              onSubmit={handleSubmit}
              className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12"
            >
              <div className="mb-8 text-center">
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Establish your entity
                </h2>
                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  Provide your core business details to unlock specialized
                  financial tooling.
                </p>
              </div>

              <div className="space-y-6">
                {/* Business Type */}
                <div>
                  <label
                    htmlFor="entityType"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Business Type
                  </label>
                  <div className="relative">
                    <select
                      id="entityType"
                      value={formData.entityType}
                      onChange={(e) =>
                        handleChange("entityType", e.target.value)
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
                  {errors.entityType && (
                    <p className="mt-1 text-sm text-red-500">{errors.entityType}</p>
                  )}
                </div>

                {/* Registered Business Address */}
                <div>
                  <label
                    htmlFor="registeredAddress"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Registered Business Address
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      id="registeredAddress"
                      type="text"
                      placeholder="123 Financial District, Suite 400"
                      value={formData.registeredAddress}
                      onChange={(e) =>
                        handleChange("registeredAddress", e.target.value)
                      }
                      className="w-full rounded-lg bg-slate-100 py-3.5 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none ring-1 ring-inset ring-transparent transition focus:bg-white focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  {errors.registeredAddress && (
                    <p className="mt-1 text-sm text-red-500">{errors.registeredAddress}</p>
                  )}
                  <p className="mt-2 text-xs text-slate-400">
                    Physical address where your business is legally
                    registered.
                  </p>
                </div>

                {/* Registration ID */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="registrationId"
                      className="text-sm font-semibold text-slate-800"
                    >
                      Registration ID
                    </label>
                  </div>
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
                    <p className="mt-1 text-sm text-red-500">{errors.registrationId}</p>
                  )}
                </div>
              </div>

              {/* Continue button */}
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