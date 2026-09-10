import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { tenantAuthService } from "../../../services/tenantAuthService";
import axios from "axios";
import { ROUTES } from "../../../shared/constants";

// ─── Config ───────────────────────────────────────────────
const MIN_LENGTH = 8;

// ─── Password rules ─────────────────────────────────────────
// Each rule is checked independently so the UI can show a live checklist.
interface IPasswordRule {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

const PASSWORD_RULES: IPasswordRule[] = [
  {
    id: "length",
    label: `At least ${MIN_LENGTH} characters`,
    test: (v) => v.length >= MIN_LENGTH,
  },
  { id: "upper", label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { id: "lower", label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { id: "number", label: "One number", test: (v) => /\d/.test(v) },
  {
    id: "special",
    label: "One special character",
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
];

const getFailingRules = (value: string): IPasswordRule[] =>
  PASSWORD_RULES.filter((rule) => !rule.test(value));

// ─── Icons ────────────────────────────────────────────────
const FundNestLogo = () => (
  <svg width="26" height="26" viewBox="0 0 42 42" fill="none">
    <ellipse cx="21" cy="27" rx="16" ry="6" fill="#1a3a6e" opacity="0.25" />
    <ellipse cx="21" cy="24" rx="16" ry="6" fill="#f5c842" />
    <ellipse cx="21" cy="20" rx="16" ry="6" fill="#3b8bd4" />
    <ellipse cx="21" cy="16" rx="16" ry="6" fill="#1a3a6e" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const KeyIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="8" cy="15" r="4" />
    <path
      d="M11 12l7-7M16 5l2 2M18.5 2.5l2 2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.5 18.5 0 0 1 4.22-5.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 5 16 12 9 19" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="8 12 11 15 16 9" />
  </svg>
);

// ─── Top bar ──────────────────────────────────────────────
const TopBar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-[1180px] mx-auto px-6 sm:px-8 h-[60px] flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="text-[#1a3a6e] hover:opacity-70 transition-opacity -ml-1 p-1"
        >
          <ArrowLeftIcon />
        </button>
        <button
          onClick={() => navigate(ROUTES.COMMON.LANDING)}
          className="flex items-center gap-2"
        >
          <FundNestLogo />
          <span className="text-[17px] font-black text-[#1a3a6e] tracking-tight">
            FundNest
          </span>
        </button>
      </div>
    </div>
  );
};

// ─── Footer ───────────────────────────────────────────────
const Footer: React.FC = () => (
  <footer className="pt-10 pb-8">
    <div className="max-w-[1180px] mx-auto px-6 sm:px-8 flex flex-col items-center gap-3">
      <div className="flex items-center gap-6 flex-wrap justify-center">
        {["Privacy Policy", "Terms of Service", "Security Vault"].map((l) => (
          <button
            key={l}
            className="text-[11px] font-semibold tracking-wide text-gray-400 hover:text-gray-600 transition-colors uppercase"
          >
            {l}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-gray-300 tracking-wide uppercase text-center">
        © 2024 FundNest Institutional Services. All rights reserved.
      </p>
    </div>
  </footer>
);

// ─── Password input with show/hide toggle ─────────────────
interface IPasswordFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  autoComplete: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const PasswordField: React.FC<IPasswordFieldProps> = ({
  id,
  label,
  value,
  placeholder,
  error,
  autoComplete,
  onChange,
  onBlur,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="w-full text-left mb-5">
      <label
        htmlFor={id}
        className="block text-[12.5px] font-bold text-gray-600 mb-1.5"
      >
        {label}
      </label>
      <div
        className={`
          flex items-center rounded-xl px-4 bg-[#f4f5f7] transition-all duration-150
          ${error ? "ring-2 ring-red-300 bg-red-50" : "focus-within:ring-2 focus-within:ring-[#1a3a6e]/30 focus-within:bg-white"}
        `}
      >
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="flex-1 min-w-0 bg-transparent outline-none py-[13px] text-[14.5px] font-semibold text-gray-800 placeholder:text-gray-400 placeholder:font-normal"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="text-gray-400 hover:text-gray-600 transition-colors pl-2"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {error && (
        <p className="text-[11.5px] text-red-500 font-medium mt-1.5">{error}</p>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────
const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as {
    state?: { email?: string; resetToken?: string };
  };

  const email = location.state?.email;
  const resetToken = location.state?.resetToken;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState<{
    newPassword: boolean;
    confirmPassword: boolean;
  }>({
    newPassword: false,
    confirmPassword: false,
  });
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // If the flow was entered without the required OTP verification context, bounce back.
  useEffect(() => {
    if (!email) {
      navigate(ROUTES.TENANT.FORGOT_PASSWORD, { replace: true });
    }
  }, [email, navigate]);

  const failingRules = useMemo(
    () => getFailingRules(newPassword),
    [newPassword],
  );
  const isPasswordStrongEnough =
    newPassword.length > 0 && failingRules.length === 0;
  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;

  const newPasswordError =
    touched.newPassword && newPassword.length === 0
      ? "New password is required"
      : touched.newPassword && !isPasswordStrongEnough
        ? "Password does not meet the requirements below"
        : undefined;

  const confirmPasswordError =
    touched.confirmPassword && confirmPassword.length === 0
      ? "Please confirm your new password"
      : touched.confirmPassword && !passwordsMatch
        ? "Passwords do not match"
        : undefined;

  const isFormValid = isPasswordStrongEnough && passwordsMatch;

  const handleSubmit = async () => {
    setTouched({ newPassword: true, confirmPassword: true });
    setSubmitError(undefined);
    if (!isPasswordStrongEnough) {
      setSubmitError("Password does not meet the requirements below.");
      return;
    }
    if (!passwordsMatch) {
      setSubmitError("New password and confirm password do not match.");
      return;
    }
    if (!email) {
      setSubmitError(
        "Your session has expired. Please restart the password reset process.",
      );
      return;
    }
    setLoading(true);
    try {
      // Updated payload structure to match IResetPasswordRequest schema
      await tenantAuthService.resetTenantPassword({
        email,
        password: newPassword,
        confirmPassword,
      });
      setSuccess(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setSubmitError(
          err.response?.data?.message ||
            "Failed to reset password. Please try again.",
        );
      } else {
        setSubmitError("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
    >
      <TopBar />

      <main
        className="flex-1 flex items-center justify-center"
        style={{ background: "#eef0f5" }}
      >
        <div className="w-full max-w-[440px] px-5 py-10 sm:py-14">
          <div
            className="bg-white rounded-3xl shadow-xl px-6 sm:px-10 py-10 flex flex-col items-center text-center"
            style={{ border: "1px solid #f0f0f5" }}
          >
            {success ? (
              <>
                {/* Success state */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{
                    background:
                      "linear-gradient(135deg, #15803d 0%, #22c55e 100%)",
                  }}
                >
                  <CheckCircleIcon />
                </div>
                <h1 className="text-[24px] sm:text-[26px] font-black text-gray-900 mb-2">
                  Password reset
                </h1>
                <p className="text-[13.5px] text-gray-500 leading-relaxed max-w-[300px] mb-8">
                  Your password has been updated successfully. You can now sign
                  in with your new password.
                </p>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.TENANT.LOGIN)}
                  className="w-full flex items-center justify-center gap-2 py-[14px] px-6 rounded-xl font-bold text-[15px] text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #1a2f6e 0%, #4338ca 100%)",
                  }}
                >
                  Continue to Sign In
                  <ChevronRightIcon />
                </button>
              </>
            ) : (
              <>
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{
                    background:
                      "linear-gradient(135deg, #1a2f6e 0%, #1e3fa8 100%)",
                  }}
                >
                  <KeyIcon />
                </div>

                {/* Heading */}
                <h1 className="text-[24px] sm:text-[26px] font-black text-gray-900 mb-2">
                  Set a new password
                </h1>
                <p className="text-[13.5px] text-gray-500 leading-relaxed max-w-[320px] mb-8">
                  Choose a strong password you haven't used before on this
                  account.
                </p>

                {/* Form */}
                <div className="w-full">
                  <PasswordField
                    id="newPassword"
                    label="New Password"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(v) => {
                      setNewPassword(v);
                      if (submitError) setSubmitError(undefined);
                    }}
                    onBlur={() =>
                      setTouched((t) => ({ ...t, newPassword: true }))
                    }
                    error={newPasswordError}
                  />

                  {/* Live requirements checklist */}
                  <ul className="grid grid-cols-1 gap-1.5 mb-5 -mt-1">
                    {PASSWORD_RULES.map((rule) => {
                      const passed = rule.test(newPassword);
                      return (
                        <li
                          key={rule.id}
                          className={`flex items-center gap-2 text-[12px] font-semibold transition-colors ${
                            passed ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              passed
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-300"
                            }`}
                          >
                            <CheckIcon />
                          </span>
                          {rule.label}
                        </li>
                      );
                    })}
                  </ul>

                  <PasswordField
                    id="confirmPassword"
                    label="Confirm Password"
                    placeholder="Re-enter new password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(v) => {
                      setConfirmPassword(v);
                      if (submitError) setSubmitError(undefined);
                    }}
                    onBlur={() =>
                      setTouched((t) => ({ ...t, confirmPassword: true }))
                    }
                    error={confirmPasswordError}
                  />
                </div>

                {submitError && (
                  <p className="text-[12px] text-red-500 font-medium mb-4 -mt-1">
                    {submitError}
                  </p>
                )}

                {/* Submit button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !isFormValid}
                  className={`
                    w-full flex items-center justify-center gap-2
                    py-[14px] px-6 rounded-xl font-bold text-[15px] text-white
                    transition-all duration-200
                    ${
                      loading || !isFormValid
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:brightness-110 active:scale-[0.98] shadow-lg"
                    }
                  `}
                  style={{
                    background:
                      "linear-gradient(135deg, #1a2f6e 0%, #4338ca 100%)",
                  }}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin"
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                          strokeLinecap="round"
                        />
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ChevronRightIcon />
                    </>
                  )}
                </button>

                {/* Support link */}
                <p className="text-[12.5px] text-gray-400 mt-6">
                  Having trouble?{" "}
                  <button
                    type="button"
                    className="font-semibold text-[#1e3fa8] hover:underline"
                  >
                    Contact Institutional Support
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
