import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tenantAuthService } from '../../../services/tenantAuthService';
import axios from 'axios';
import { ROUTES } from '../../../shared/constants';

// ─── Helpers ──────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (value: string): string | undefined => {
  if (!value.trim()) return 'Email address is required';
  if (!EMAIL_REGEX.test(value.trim())) return 'Enter a valid email address';
  return undefined;
};

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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const MailIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l8.4 6a1.6 1.6 0 0 0 1.8 0L21 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AtIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-5.5 8.28" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 5 16 12 9 19" />
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
          <span className="text-[17px] font-black text-[#1a3a6e] tracking-tight">FundNest</span>
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
        {['Privacy Policy', 'Terms of Service', 'Security Vault'].map((l) => (
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

// ─── Main Page ────────────────────────────────────────────
const ForgotPasswordEmailPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const fieldError = touched ? validateEmail(email) : undefined;
  const isValid = validateEmail(email) === undefined;

  const handleSubmit = async () => {
    setTouched(true);
    setSubmitError(undefined);

    const validationMessage = validateEmail(email);
    if (validationMessage) {
      setSubmitError(validationMessage);
      return;
    }

    setLoading(true);
    try {

      await tenantAuthService.requestPasswordResetOtp({ email: email.trim() });

      navigate(ROUTES.TENANT.FORGOT_PASSWORD_OTP, {
        state: { email: email.trim() },
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setSubmitError(err.response?.data?.message || 'We couldn\'t find an account with that email.');
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
    >
      <TopBar />

      <main className="flex-1 flex items-center justify-center" style={{ background: '#eef0f5' }}>
        <div className="w-full max-w-[440px] px-5 py-10 sm:py-14">
          <div
            className="bg-white rounded-3xl shadow-xl px-6 sm:px-10 py-10 flex flex-col items-center text-center"
            style={{ border: '1px solid #f0f0f5' }}
          >
            {/* Icon */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
              style={{ background: 'linear-gradient(135deg, #1a2f6e 0%, #1e3fa8 100%)' }}
            >
              <MailIcon />
            </div>

            {/* Heading */}
            <h1 className="text-[24px] sm:text-[26px] font-black text-gray-900 mb-2">
              Forgot your password?
            </h1>
            <p className="text-[13.5px] text-gray-500 leading-relaxed max-w-[300px] mb-8">
              Enter the email address linked to your account and we'll send you a 6-digit code to reset your password.
            </p>

            {/* Email field */}
            <div className="w-full text-left mb-2">
              <label htmlFor="email" className="block text-[12.5px] font-bold text-gray-600 mb-1.5">
                Email Address
              </label>
              <div
                className={`
                  flex items-center gap-2 rounded-xl px-4 bg-[#f4f5f7] transition-all duration-150
                  ${fieldError || submitError
                    ? 'ring-2 ring-red-300 bg-red-50'
                    : 'focus-within:ring-2 focus-within:ring-[#1a3a6e]/30 focus-within:bg-white'
                  }
                `}
              >
                <span className="text-gray-400">
                  <AtIcon />
                </span>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (submitError) setSubmitError(undefined);
                  }}
                  onBlur={() => setTouched(true)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 min-w-0 bg-transparent outline-none py-[13px] text-[14.5px] font-semibold text-gray-800 placeholder:text-gray-400 placeholder:font-normal"
                />
              </div>
              {fieldError && (
                <p className="text-[11.5px] text-red-500 font-medium mt-1.5">{fieldError}</p>
              )}
            </div>

            {submitError && !fieldError && (
              <p className="text-[12px] text-red-500 font-medium mb-2 mt-1 self-start">{submitError}</p>
            )}

            {/* Submit button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || (touched && !isValid)}
              className={`
                w-full flex items-center justify-center gap-2 mt-6
                py-[14px] px-6 rounded-xl font-bold text-[15px] text-white
                transition-all duration-200
                ${loading || (touched && !isValid)
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:brightness-110 active:scale-[0.98] shadow-lg'
                }
              `}
              style={{ background: 'linear-gradient(135deg, #1a2f6e 0%, #4338ca 100%)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                  </svg>
                  Sending code...
                </>
              ) : (
                <>
                  Send Code
                  <ChevronRightIcon />
                </>
              )}
            </button>

            {/* Back to login */}
            <button
              type="button"
              onClick={() => navigate(ROUTES.TENANT.LOGIN)}
              className="text-[12.5px] font-semibold text-[#1e3fa8] hover:underline mt-6"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPasswordEmailPage;