import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { ROUTES } from '../../../shared/constants';

// ─── Types ────────────────────────────────────────────────
interface IForgotPasswordValues {
  email: string;
}

interface IForgotPasswordErrors {
  email?: string;
  general?: string;
}

// ─── Validation ───────────────────────────────────────────
const validateForm = (values: IForgotPasswordValues): IForgotPasswordErrors => {
  const errors: IForgotPasswordErrors = {};
  const val = values.email.trim();

  if (!val) {
    errors.email = 'Email or phone number is required';
  } else {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const isPhone = /^\+?\d{7,15}$/.test(val.replace(/\s/g, ''));
    if (!isEmail && !isPhone) {
      errors.email = 'Enter a valid email address or phone number';
    }
  }

  return errors;
};

// ─── Icons ────────────────────────────────────────────────
const ContactIcon: React.FC = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
    <path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const ArrowRightIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const ArrowLeftIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

// ─── Left Panel ───────────────────────────────────────────
const LeftPanel: React.FC = () => (
  <div
    className="hidden lg:flex lg:flex-col relative overflow-hidden h-full"
    style={{
      background: 'linear-gradient(160deg, #0a1f6e 0%, #0d2580 60%, #0a2080 100%)',
    }}
  >
    {/* Subtle dot pattern */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    />

    <div className="relative z-10 flex flex-col h-full min-h-0 p-6 xl:p-8">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-6 xl:mb-8">
        <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white/10 border border-white/20">
          <svg width="25" height="25" viewBox="0 0 42 42" fill="none">
            <ellipse cx="21" cy="27" rx="16" ry="6" fill="#1a3a6e" opacity="0.3"/>
            <ellipse cx="21" cy="24" rx="16" ry="6" fill="#f5c842"/>
            <ellipse cx="21" cy="20" rx="16" ry="6" fill="#3b8bd4"/>
            <ellipse cx="21" cy="16" rx="16" ry="6" fill="#e8f4fd"/>
          </svg>
        </div>
        <span className="text-white text-lg font-bold tracking-tight">FundNest</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center py-5 xl:py-7">
        <p className="text-cyan-300 text-xs font-bold tracking-[0.25em] uppercase mb-5 opacity-90">
          Smart Saving. Secure Future.
        </p>

        <h2 className="text-white font-black leading-tight mb-2" style={{ fontSize: 'clamp(2.5rem, 3.6vw, 3.8rem)' }}>
          Institutional<br />
          Grade
        </h2>
        <h2
          className="font-black leading-tight mb-6"
          style={{
            fontSize: 'clamp(2.5rem, 3.6vw, 3.8rem)',
            color: '#00e5cc',
            textShadow: '0 0 40px rgba(0,229,204,0.3)',
          }}
        >
          Security
        </h2>

        <div className="w-16 h-1 rounded-full bg-cyan-300/70 mb-6" />

        <p className="text-blue-100 text-sm xl:text-base leading-relaxed max-w-sm opacity-80">
          Experience the authority of legacy banking
          combined with the fluid precision of modern
          architectural design.
        </p>
      </div>

      {/* Vault illustration card */}
      <div
        className="hidden"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Vault image placeholder — SVG illustration */}
        <div
          className="w-full relative overflow-hidden"
          style={{ aspectRatio: '16/9', maxHeight: '24vh', background: 'linear-gradient(135deg, #0a1628 0%, #0d3320 100%)' }}
        >
          <svg viewBox="0 0 380 280" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="vaultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a4a3a"/>
                <stop offset="100%" stopColor="#0a2015"/>
              </linearGradient>
              <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2a6a4a"/>
                <stop offset="50%" stopColor="#1a4a2a"/>
                <stop offset="100%" stopColor="#0a2a1a"/>
              </linearGradient>
            </defs>

            {/* Background */}
            <rect width="380" height="280" fill="url(#vaultGrad)"/>

            {/* Floor reflection */}
            <ellipse cx="190" cy="260" rx="160" ry="20" fill="#00aa66" opacity="0.08"/>

            {/* Vault door main */}
            <rect x="90" y="40" width="200" height="200" rx="12" fill="url(#metalGrad)" stroke="#2a8a5a" strokeWidth="2"/>

            {/* Vault door inner ring */}
            <rect x="110" y="60" width="160" height="160" rx="8" fill="none" stroke="#1a6a3a" strokeWidth="1.5" strokeDasharray="4,4"/>

            {/* Vault wheel */}
            <circle cx="190" cy="140" r="55" fill="none" stroke="#2a7a4a" strokeWidth="3"/>
            <circle cx="190" cy="140" r="45" fill="rgba(20,60,30,0.5)" stroke="#1a5a3a" strokeWidth="1.5"/>
            <circle cx="190" cy="140" r="15" fill="#1a5a3a" stroke="#2a7a4a" strokeWidth="2"/>

            {/* Wheel spokes */}
            {[0,45,90,135,180,225,270,315].map((angle, i) => {
              const rad = angle * Math.PI / 180;
              return (
                <line key={i}
                  x1={190 + 17 * Math.cos(rad)}
                  y1={140 + 17 * Math.sin(rad)}
                  x2={190 + 43 * Math.cos(rad)}
                  y2={140 + 43 * Math.sin(rad)}
                  stroke="#2a7a4a" strokeWidth="2.5" strokeLinecap="round"
                />
              );
            })}

            {/* Vault handle */}
            <rect x="235" y="128" width="30" height="24" rx="5" fill="#1a5a3a" stroke="#2a7a4a" strokeWidth="1.5"/>

            {/* Bolts */}
            {[[110,60],[270,60],[110,220],[270,220]].map(([cx,cy],i) => (
              <circle key={i} cx={cx} cy={cy} r="8" fill="#1a5a3a" stroke="#2a7a4a" strokeWidth="1.5"/>
            ))}

            {/* Green tint overlay */}
            <rect width="380" height="280" fill="#00aa66" opacity="0.05"/>

            {/* Light effect top */}
            <ellipse cx="190" cy="0" rx="200" ry="60" fill="#00ff99" opacity="0.04"/>
          </svg>
        </div>

        {/* Quote */}
        <div className="px-4 py-3">
          <p className="text-blue-200 text-xs xl:text-sm italic leading-relaxed opacity-80">
            "The architecture of your wealth deserves
            nothing less than precision."
          </p>
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────
const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState<IForgotPasswordValues>({
    email: '',
  });
  const [errors, setErrors] = useState<IForgotPasswordErrors>({});
  const [touched, setTouched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // ─── Handlers ─────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setValues({ email: value });

    if (touched) {
      const newErrors = validateForm({ email: value });
      setErrors(newErrors);
    }
  };

  const handleBlur = (): void => {
    setTouched(true);
    const newErrors = validateForm(values);
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    setTouched(true);
    const formErrors = validateForm(values);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    setIsLoading(true);

    try {
      await authService.requestPasswordResetOtp({
        email: values.email,
      });

      setIsSuccess(true);

      setTimeout(() => {
        navigate(ROUTES.USER.FORGOT_PASSWORD_OTP, {
          state: {
            email: values.email.trim().toLowerCase(),
          },
        });
      }, 1500);

    } catch (err: any) {
      setErrors({
        general:
          err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          'Failed to send OTP. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fieldError = touched ? errors.email : undefined;

  // ─── Render ───────────────────────────────────────────
  return (
    <div
      className="min-h-screen lg:h-screen flex overflow-hidden"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >

      {/* Left panel */}
      <div className="hidden lg:block lg:w-[52%] xl:w-[55%] flex-shrink-0 h-screen overflow-hidden">
        <LeftPanel />
      </div>

      {/* Right panel */}
      <div
        className="flex-1 min-h-screen lg:h-screen overflow-y-auto"
        style={{ background: '#f8f9fb' }}
      >
        <div className="min-h-full flex flex-col justify-center px-6 py-8 sm:px-10 lg:px-14 xl:px-20 max-w-xl w-full mx-auto">

          {/* Form section */}
          <div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-black mb-3" style={{ color: '#1a3a6e' }}>
                Forgot Password?
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                We'll send a verification code to reset your password. Please enter
                the details associated with your account.
              </p>
            </div>

            {/* Success state */}
            {isSuccess ? (
              <div className="px-5 py-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    OTP Sent Successfully!
                  </p>
                  <p className="text-xs text-green-600 mt-0.5">
                    Redirecting you to verification page...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>

                {/* General error */}
                {errors.general && (
                  <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600">
                    {errors.general}
                  </div>
                )}

                {/* Input field */}
                <div className="mb-5">
                  <label className="block text-xs font-bold tracking-[0.12em] text-gray-600 uppercase mb-2">
                    Email or Phone Number
                  </label>
                  <div className={`
                    flex items-center gap-3 px-4 py-4 rounded-2xl border
                    transition-all duration-200
                    ${fieldError
                      ? 'border-red-300 bg-red-50 focus-within:ring-2 focus-within:ring-red-100'
                      : 'border-gray-200 bg-gray-100 focus-within:bg-white focus-within:border-[#1a3a6e] focus-within:ring-2 focus-within:ring-[#1a3a6e]/10'
                    }
                  `}>
                    <span className={`flex-shrink-0 ${fieldError ? 'text-red-400' : 'text-gray-400'}`}>
                      <ContactIcon />
                    </span>
                    <input
                      type="text"
                      name="email"
                      value={values.email}
                      placeholder="name@example.com"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="email"
                      autoFocus
                      className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                    />
                  </div>
                  {fieldError && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm0-2a.75.75 0 110 1.5.75.75 0 010-1.5z"/>
                      </svg>
                      {fieldError}
                    </p>
                  )}
                </div>

                {/* Send OTP button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    w-full flex items-center justify-center gap-2.5
                    py-4 px-6 rounded-2xl font-bold text-sm text-white
                    transition-all duration-200
                    ${isLoading
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:opacity-90 active:scale-[0.98] shadow-md hover:shadow-lg'
                    }
                  `}
                  style={{
                    background: isLoading
                      ? '#1a3a6e'
                      : 'linear-gradient(135deg, #1a3a6e 0%, #1a5276 100%)',
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin"
                        width="16" height="16"
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
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRightIcon />
                    </>
                  )}
                </button>

              </form>
            )}

            {/* Back to Login */}
            <div className="flex justify-center mt-8">
              <button
                type="button"
                onClick={() => navigate(ROUTES.USER.LOGIN)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#1a3a6e] transition-colors duration-150"
              >
                <ArrowLeftIcon />
                Back to Login
              </button>
            </div>

          </div>

          {/* Footer links */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {['Privacy Policy', 'Support Center', 'Security Details'].map(
              (item, i, arr) => (
                <React.Fragment key={item}>
                  <button className="text-xs text-gray-400 hover:text-[#1a3a6e] transition-colors">
                    {item}
                  </button>
                  {i < arr.length - 1 && (
                    <span className="text-gray-200 text-lg leading-none">•</span>
                  )}
                </React.Fragment>
              )
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
