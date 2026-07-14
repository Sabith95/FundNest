import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { tenantAuthService } from '../../../services/tenantAuthService';
import axios from 'axios';
import { ROUTES } from '../../../shared/constants';
import { setAccessToken } from '../../../services/api';

// ─── Config ───────────────────────────────────────────────
const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

// ─── Helpers ──────────────────────────────────────────────
const maskEmail = (email?: string): string => {
  if (!email) return '';
  const [user, domain] = email.split('@');
  if (!domain) return email;
  const visible = user.slice(0, 1);
  return `${visible}${'*'.repeat(Math.max(user.length - 1, 3))}@${domain}`;
};

const formatTime = (totalSeconds: number): string => {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
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

const ShieldKeyIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <circle cx="12" cy="10" r="1.6" fill="white" stroke="none" />
    <path d="M12 11.6V15" strokeLinecap="round" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15.5 14" />
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

// ─── Single OTP digit box ─────────────────────────────────
interface IOtpBoxProps {
  value: string;
  index: number;
  error: boolean;
  inputRef: (el: HTMLInputElement | null) => void;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}

const OtpBox: React.FC<IOtpBoxProps> = ({ value, index, error, inputRef, onChange, onKeyDown, onPaste }) => (
  <input
    ref={inputRef}
    type="text"
    inputMode="numeric"
    autoComplete={index === 0 ? 'one-time-code' : 'off'}
    maxLength={1}
    value={value}
    onChange={(e) => onChange(index, e.target.value)}
    onKeyDown={(e) => onKeyDown(index, e)}
    onPaste={onPaste}
    aria-label={`Digit ${index + 1}`}
    className={`
      w-[13%] max-w-[52px] aspect-square min-w-[38px]
      rounded-xl text-center
      text-[20px] sm:text-[22px] font-black
      outline-none transition-all duration-150
      ${error
        ? 'bg-red-50 ring-2 ring-red-300 text-red-500'
        : value
          ? 'bg-[#f4f5f7] ring-2 ring-[#1a3a6e] text-[#4338ca]'
          : 'bg-[#f4f5f7] text-gray-800 focus:ring-2 focus:ring-[#1a3a6e]/30 focus:bg-white'
      }
    `}
  />
);

// ─── Main Page ────────────────────────────────────────────
const OtpVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { email?: string; phone?: string } };
  const email = location.state?.email;

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const setDigitAt = useCallback((index: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const handleChange = (index: number, raw: string) => {
    const value = raw.replace(/\D/g, '');
    if (error) setError(undefined);

    if (!value) {
      setDigitAt(index, '');
      return;
    }

    // Handle single or multi-character input (e.g. mobile keyboard predictions)
    const chars = value.split('');
    chars.forEach((ch, i) => {
      const target = index + i;
      if (target < OTP_LENGTH) setDigitAt(target, ch);
    });

    const nextIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
    inputsRef.current[nextIndex]?.focus();
    inputsRef.current[nextIndex]?.select();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        setDigitAt(index, '');
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        setDigitAt(index - 1, '');
      }
      if (error) setError(undefined);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    setError(undefined);
    const lastIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[lastIndex]?.focus();
  };

  const code = digits.join('');
  const isComplete = code.length === OTP_LENGTH;

  const handleVerify = async () => {
    if (!isComplete) {
      setError('Enter the full 6-digit code');
      return;
    }
    if (!email) {
      setError('Email is missing. Please restart registration.');
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      const result = await tenantAuthService.verifyTenantOtp({ email, otp: code });
      setAccessToken(result.accessToken, 'tenant');
      navigate(ROUTES.TENANT.BUSINESS_INFO);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Invalid or expired code. Please try again.');
      } else {
        setError('Invalid or expired code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return;
    if (!email) {
      setError('Email is missing. Please restart registration.');
      return;
    }
    setResending(true);
    setError(undefined);
    try {
      await tenantAuthService.resendTenantOtp({ email });
      setDigits(Array(OTP_LENGTH).fill(''));
      setSecondsLeft(RESEND_SECONDS);
      inputsRef.current[0]?.focus();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } finally {
      setResending(false);
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
              <ShieldKeyIcon />
            </div>

            {/* Heading */}
            <h1 className="text-[24px] sm:text-[26px] font-black text-gray-900 mb-2">
              Verify your identity
            </h1>
            <p className="text-[13.5px] text-gray-500 leading-relaxed max-w-[300px] mb-8">
              We've sent a 6-digit security code to{' '}
              <span className="font-bold text-gray-700">{maskEmail(email) || 'your registered email'}</span>
              . Please enter it below to continue.
            </p>

            {/* OTP boxes */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 w-full mb-4" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <OtpBox
                  key={i}
                  index={i}
                  value={d}
                  error={!!error}
                  inputRef={(el) => { inputsRef.current[i] = el; }}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                />
              ))}
            </div>

            {error && (
              <p className="text-[12px] text-red-500 font-medium mb-2 -mt-1">{error}</p>
            )}

            {/* Timer / resend */}
            <div className="flex flex-col items-center gap-1.5 mt-2 mb-8">
              <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
                <ClockIcon />
                {secondsLeft > 0 ? (
                  <span>
                    Code expires in <span className="font-bold text-gray-700">{formatTime(secondsLeft)}</span>
                  </span>
                ) : (
                  <span>Your code has expired</span>
                )}
              </div>
              <button
                type="button"
                onClick={handleResend}
                disabled={secondsLeft > 0 || resending}
                className={`
                  text-[12px] font-bold tracking-wide uppercase transition-colors
                  ${secondsLeft > 0 || resending
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-[#1e3fa8] hover:text-[#1a2f6e] hover:underline'
                  }
                `}
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>

            {/* Verify button */}
            <button
              type="button"
              onClick={handleVerify}
              disabled={loading}
              className={`
                w-full flex items-center justify-center gap-2
                py-[14px] px-6 rounded-xl font-bold text-[15px] text-white
                transition-all duration-200
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110 active:scale-[0.98] shadow-lg'}
              `}
              style={{ background: 'linear-gradient(135deg, #1a2f6e 0%, #4338ca 100%)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  Verify &amp; Continue
                  <ChevronRightIcon />
                </>
              )}
            </button>

            {/* Support link */}
            <p className="text-[12.5px] text-gray-400 mt-6">
              Having trouble?{' '}
              <button type="button" className="font-semibold text-[#1e3fa8] hover:underline">
                Contact Institutional Support
              </button>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OtpVerificationPage;