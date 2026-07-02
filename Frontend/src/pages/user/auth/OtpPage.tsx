import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { ROUTES } from '../../../shared/constants';
import { toast } from 'react-toastify';
// ─── Types ────────────────────────────────────────────────

interface IOtpLocationState {
  phone?: string;
  email: string;
}

// ─── Left Panel ───────────────────────────────────────────
const LeftPanel: React.FC = () => (
  <div
    className="hidden lg:flex lg:flex-col lg:justify-between relative overflow-hidden"
    style={{
      background: 'linear-gradient(160deg, #0a1f5c 0%, #0d2680 50%, #0a1f5c 100%)',
      minHeight: '100vh',
    }}
  >
    {/* Network grid background */}
    <svg
      className="absolute inset-0 w-full h-full opacity-20"
      viewBox="0 0 600 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Network lines */}
      {[
        [50,100,200,250],[200,250,380,150],[380,150,500,300],
        [500,300,420,480],[420,480,250,520],[250,520,100,400],
        [100,400,50,100],[200,250,250,520],[380,150,420,480],
        [50,100,500,300],[100,400,380,150],[250,520,500,300],
        [200,250,100,400],[420,480,50,100],[150,650,300,700],
        [300,700,480,620],[480,620,520,800],[520,800,300,850],
        [300,850,100,750],[100,750,150,650],[300,700,100,750],
        [480,620,300,850],[150,650,520,800],
      ].map(([x1,y1,x2,y2], i) => (
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#4a7fd4"
          strokeWidth="0.8"
          strokeOpacity="0.6"
        />
      ))}

      {/* Network dots */}
      {[
        [50,100],[200,250],[380,150],[500,300],[420,480],
        [250,520],[100,400],[150,650],[300,700],[480,620],
        [520,800],[300,850],[100,750],
      ].map(([cx,cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill="#4a9fd4" opacity="0.8"/>
      ))}
    </svg>

    {/* Content */}
    <div className="relative z-10 flex flex-col h-full justify-between p-10 xl:p-14">

      {/* Top label */}
      <div>
        <p className="text-white text-sm font-bold tracking-widest uppercase opacity-90">
          Architectural Fintech
        </p>
      </div>

      {/* Middle text */}
      <div>
        <p className="text-blue-300 text-xs font-bold tracking-[0.2em] uppercase mb-5 opacity-80">
          Smart Saving. Secure Future.
        </p>
        <h2
          className="text-white font-black leading-none mb-6"
          style={{ fontSize: 'clamp(2.8rem, 4.5vw, 4rem)' }}
        >
          Elevate Your<br />
          Wealth<br />
          Management.
        </h2>
        <p className="text-blue-200 text-base leading-relaxed max-w-xs opacity-70">
          Your institutional-grade portal to precise financial
          curation and global asset oversight.
        </p>
      </div>

      {/* Bottom security badge */}
      <div className="flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(74, 127, 212, 0.25)', border: '1px solid rgba(74,127,212,0.3)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7ab3e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>
        <div>
          <p className="text-white text-sm font-bold">Bank-Grade Security</p>
          <p className="text-blue-300 text-xs opacity-70">AES-256 Bit Encryption</p>
        </div>
      </div>
    </div>
  </div>
);

// ─── OTP Input Component ──────────────────────────────────
interface IOtpInputProps {
  value: string[];
  onChange: (otp: string[]) => void;
  hasError: boolean;
}

const OtpInput: React.FC<IOtpInputProps> = ({ value, onChange, hasError }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, val: string): void => {
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...value];
    newOtp[index] = val.slice(-1);
    onChange(newOtp);

    // Auto focus next
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    // Backspace — clear current or go to previous
    if (e.key === 'Backspace') {
      if (value[index]) {
        const newOtp = [...value];
        newOtp[index] = '';
        onChange(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent): void => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);

    if (pasted.length > 0) {
      const newOtp = ['', '', '', '', '', ''];
      pasted.split('').forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      onChange(newOtp);
      const focusIndex = Math.min(pasted.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex gap-2 sm:gap-3">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={`
            flex-1 text-center text-2xl font-bold rounded-2xl border-2
            outline-none transition-all duration-200
            ${hasError
              ? 'border-red-300 bg-red-50 text-red-600'
              : digit
                ? 'border-[#1a3a6e] bg-white text-[#1a3a6e] shadow-sm'
                : 'border-gray-200 bg-gray-100 text-gray-800 focus:border-[#1a3a6e] focus:bg-white focus:border-2 focus:shadow-sm'
            }
          `}
          style={{
            height: '64px',
            minWidth: '0',
          }}
        />
      ))}
    </div>
  );
};

// ─── Clock Icon ───────────────────────────────────────────
const ClockIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

// ─── Arrow Left Icon ──────────────────────────────────────
const ArrowLeftIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

// ─── Main OTP Page ────────────────────────────────────────
const OtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as IOtpLocationState | null;
  const email = state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate(ROUTES.USER.REGISTER, { replace: true });
    }
  }, [email, navigate]);

  // Mask email — m***@fundnest.com
  const maskEmail = (email: string): string => {
    const [local, domain] = email.split('@');
    if (!domain) return email;
    const masked = local[0] + '***';
    return `${masked}@${domain}`;
  };

    const OTP_TIMER_SECONDS = 60;

    const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(OTP_TIMER_SECONDS);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);



  // ─── Countdown timer ──────────────────────────────────
  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  // ─── Handlers ─────────────────────────────────────────
  const handleOtpChange = (newOtp: string[]): void => {
    setOtp(newOtp);
    if (error) setError('');
  };

  const handleVerify = async (): Promise<void> => {
    const otpValue = otp.join('');

    if (otpValue.length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.verifyUserOtp({
        email,
        otp: otpValue,
      });
        toast.success('OTP verified. Please login.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
      navigate(ROUTES.USER.LOGIN);
    } catch (err: any) {
      setError(
          err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          'Invalid code. Please try again.'
);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (): Promise<void> => {
  if (!canResend || !email) return;

  setIsResending(true);
  setError('');

  try {
    await authService.resendUserOtp({ email });

    setOtp(['', '', '', '', '', '']);
    setCanResend(false);
    setResendTimer(OTP_TIMER_SECONDS);
  } catch (err: any) {
    setError(
      err.response?.data?.errors?.[0]?.message ||
      err.response?.data?.message ||
      'Failed to resend OTP. Please try again.'
    );
  } finally {
    setIsResending(false);
  }
};

  const isComplete = otp.join('').length === 6;

  // ─── Render ───────────────────────────────────────────
  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Left panel */}
      <div className="lg:w-[52%] xl:w-[55%] flex-shrink-0">
        <LeftPanel />
      </div>

      {/* Right panel */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-10"
        style={{ background: '#f0f2f7' }}
      >
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">

            {/* Header */}
            <div className="mb-7">
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                Verification Required
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                A 6-digit code has been sent to{' '}
                <span className="font-bold text-[#1a3a6e]">
                  {maskEmail(email)}
                </span>
                . Please enter it below.
              </p>
            </div>

            {/* OTP inputs */}
            <div className="mb-5">
              <OtpInput
                value={otp}
                onChange={handleOtpChange}
                hasError={!!error}
              />
              {error && (
                <p className="mt-2.5 text-xs text-red-500 text-center">
                  {error}
                </p>
              )}
            </div>

            {/* Verify button */}
            <button
              type="button"
              onClick={handleVerify}
              disabled={isLoading || !isComplete}
              className={`
                w-full py-4 rounded-xl font-bold text-sm text-white mb-5
                transition-all duration-200
                ${isLoading || !isComplete
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:opacity-90 active:scale-[0.98] shadow-md hover:shadow-lg'
                }
              `}
              style={{
                background: 'linear-gradient(135deg, #1a3a6e 0%, #1a5276 100%)',
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
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
                  Verifying...
                </span>
              ) : (
                'Verify OTP'
              )}
            </button>

            {/* Resend section */}
            <div className="flex flex-col items-center gap-2 mb-6">
              {/* Timer */}
              <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                <ClockIcon />
                <span>
                  Resend in{' '}
                  <span className="font-bold text-gray-700">
                    {formatTime(resendTimer)}
                  </span>
                </span>
              </div>

              {/* Resend button */}
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || isResending}
                className={`
                  text-sm font-semibold transition-all duration-200
                  ${canResend
                    ? 'text-[#1a3a6e] hover:underline cursor-pointer'
                    : 'text-gray-300 cursor-not-allowed'
                  }
                `}
              >
                Resend OTP
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 mb-5" />

            {/* Back to login */}
            <button
              type="button"
              onClick={() => navigate(ROUTES.USER.LOGIN)}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1a3a6e] transition-colors duration-150"
            >
              <ArrowLeftIcon />
              Back to Login
            </button>

          </div>

          {/* Footer help text */}
          <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed px-4">
            Having trouble? Please check your spam folder or contact our
            institutional support desk at{' '}
            <span className="text-gray-500 font-medium">
              support@fundnest.com
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default OtpPage;