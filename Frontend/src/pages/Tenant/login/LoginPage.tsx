import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store/hooks";
import { loginSuccess } from "../../../store/slices/authSlice";
import { tenantAuthService } from "../../../services/tenantAuthService";
import { setTenant } from "../../../store/slices/tenantSlice";
import type { ITenantProfile } from "../../../types/tenant.types";
import { getTenantDestination } from "../../../utitls/tenantRouting";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { ROUTES } from "../../../shared/constants";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

type FieldName = keyof Pick<LoginFormValues, "email" | "password">;

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "Email address is required.";
  if (!EMAIL_REGEX.test(value.trim())) return "Enter a valid email address.";
  return undefined;
}

function validatePassword(value: string): string | undefined {
  if (!value) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  return undefined;
}

function validateField(name: FieldName, value: string): string | undefined {
  return name === "email" ? validateEmail(value) : validatePassword(value);
}

// ---------------------------------------------------------------------------
// Small presentational icons (inline SVG, no external deps)
// ---------------------------------------------------------------------------

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-slate-400" aria-hidden="true">
    <path
      d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-11Z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path d="m4 6.5 8 6.25L20 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-slate-400" aria-hidden="true">
    <rect x="5" y="10.5" width="14" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 10.5V7.5a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
    <path d="M4 12h16M14 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 7.5v5.5M12 16.25v.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M3.5 12h17M12 3.5a13 13 0 0 1 0 17M12 3.5a13 13 0 0 0 0 17" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

const PageFooter: React.FC = () => (
  <footer className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-500">
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      <p className="max-w-xs">
        Ã‚Â© 2026 FundNest. The Digital Vault for your Capital.
      </p>

      <div className="flex flex-col gap-2">
        <a href="#" className="hover:text-slate-700">
          About Us
        </a>
        <a href="#" className="hover:text-slate-700">
          Security
        </a>
      </div>

      <div className="flex flex-col gap-2">
        <a href="#" className="hover:text-slate-700">
          Terms of Service
        </a>
        <a href="#" className="hover:text-slate-700">
          Privacy Policy
        </a>
      </div>

      <div className="flex flex-col gap-2">
        <a href="#" className="hover:text-slate-700">
          Contact Support
        </a>
        <span className="flex items-center gap-1.5">
          <GlobeIcon />
          English (US)
        </span>
      </div>
    </div>
  </footer>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    email: false,
    password: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (name: FieldName) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, [name]: value }));

      // Live-validate only after the field has been touched once,
      // so errors don't appear before the user has had a chance to type.
      setTouched((prevTouched) => {
        if (prevTouched[name]) {
          setErrors((prevErrors) => ({ ...prevErrors, [name]: validateField(name, value) }));
        }
        return prevTouched;
      });
    },
    []
  );

  const handleBlur = useCallback(
    (name: FieldName) => (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors((prev) => ({ ...prev, [name]: validateField(name, e.target.value) }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailError = validateEmail(values.email);
    const passwordError = validatePassword(values.password);

    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });

    if (emailError || passwordError) return;

    setSubmitting(true);
    try {
      const result = await tenantAuthService.loginTenant({
        email: values.email.trim(),
        password: values.password,
      });

      const tenantProfile: ITenantProfile = {
        id: result.tenant.id,
        companyName: result.tenant.companyName,
        ownerName: result.tenant.ownerName,
        email: result.tenant.email,
        status: result.tenant.status,
        onboardingStep: result.tenant.onboardingStep,
      };

        dispatch(setTenant(tenantProfile));
        dispatch(
          loginSuccess({
            user: {
              id: result.tenant.id,
              name: result.tenant.ownerName,
              email: result.tenant.email,
              role: "TENANT_ADMIN",
              tenantId: result.tenant.id,
              isActive: true,
              createdAt: "",
            },
            accessToken: result.accessToken,
          })
        );

      navigate(getTenantDestination(result.tenant.onboardingStep), { replace: true });
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? "We couldn't sign you in. Check your details and try again."
        : "We couldn't sign you in. Check your details and try again.";
      toast.error(message, { position: "top-center" });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses = (hasError: boolean) =>
    [
      "w-full rounded-lg border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400",
      "transition focus:bg-white focus:outline-none focus:ring-2",
      hasError
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-slate-200 focus:border-[#3730a3] focus:ring-[#3730a3]/15",
    ].join(" ");

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:py-16">
        {/* soft ambient background accents, matching the reference */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl"
        />

        <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-100 sm:p-9">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-extrabold text-[#12163f] sm:text-[28px]">Welcome Back</h1>
            <p className="mt-2 text-sm text-slate-500">Secure access to your digital capital vault.</p>
          </div>

          <form noValidate onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#12163f]">
                Email Address
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                  <MailIcon />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={values.email}
                  onChange={handleChange("email")}
                  onBlur={handleBlur("email")}
                  aria-invalid={Boolean(touched.email && errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={inputClasses(Boolean(touched.email && errors.email))}
                />
              </div>
              {touched.email && errors.email && (
                <p id="email-error" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                  <ErrorIcon />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wide text-[#12163f]">
                  Password
                </label>
                <a href="#" className="text-xs font-bold uppercase tracking-wide text-[#3730a3] hover:text-[#2c2582]">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                  <LockIcon />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder={"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
                  value={values.password}
                  onChange={handleChange("password")}
                  onBlur={handleBlur("password")}
                  aria-invalid={Boolean(touched.password && errors.password)}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={inputClasses(Boolean(touched.password && errors.password))}
                />
              </div>
              {touched.password && errors.password && (
                <p id="password-error" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
                  <ErrorIcon />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1e1b6e] to-[#4338ca] py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-900/20 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3730a3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                "Signing inÃ¢â‚¬Â¦"
              ) : (
                <>
                  Login
                  <ArrowRightIcon />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <p className="pb-2 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <a href= {ROUTES.TENANT.REGISTER} className="font-semibold text-[#3730a3] hover:text-[#2c2582]">
          Create Vault
        </a>
      </p>

      <PageFooter />
    </div>
  );
};

export default LoginPage;