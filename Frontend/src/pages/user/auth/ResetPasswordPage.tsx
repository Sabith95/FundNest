import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { ROUTES } from '../../../shared/constants';

// ─── Types ────────────────────────────────────────────────
interface IResetPasswordValues {
  newPassword: string;
  confirmPassword: string;
}

interface IResetPasswordErrors {
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

interface IPasswordStrength {
  score: number;
  label: string;
  color: string;
}

interface IResetPasswordLocationState {
  email: string;
}

// ─── Validation ───────────────────────────────────────────
const validateForm = (values: IResetPasswordValues): IResetPasswordErrors => {
  const errors: IResetPasswordErrors = {};

  if (!values.newPassword) {
    errors.newPassword = 'New password is required';
  } else if (values.newPassword.length < 8) {
    errors.newPassword = 'Password must be at least 8 characters';
  } else if (!/[A-Z]/.test(values.newPassword)) {
    errors.newPassword = 'Password must contain at least one uppercase letter';
  } else if (!/[a-z]/.test(values.newPassword)) {
    errors.newPassword = 'Password must contain at least one lowercase letter';
  } else if (!/\d/.test(values.newPassword)) {
    errors.newPassword = 'Password must contain at least one digit';
  } else if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`;']/.test(values.newPassword)) {
    errors.newPassword = 'Password must contain at least one special character';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

// ─── Password strength checker ────────────────────────────
const getPasswordStrength = (password: string): IPasswordStrength => {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak', color: '#ef4444' };
  if (score <= 3) return { score, label: 'Fair', color: '#f97316' };
  if (score <= 4) return { score, label: 'Good', color: '#eab308' };
  if (score <= 5) return { score, label: 'Strong', color: '#22c55e' };
  return { score, label: 'Very Strong', color: '#10b981' };
};

// ─── Icons ────────────────────────────────────────────────
const LockIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const LockCheckIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
    <polyline points="9 16 11 18 15 14"/>
  </svg>
);

const EyeIcon: React.FC = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon: React.FC = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
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

const ShieldIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const CheckCircleIcon: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

// ─── Left Panel ───────────────────────────────────────────
const LeftPanel: React.FC = () => (
  <div
    className="hidden lg:flex lg:flex-col relative overflow-hidden"
    style={{ minHeight: '100vh' }}
  >
    {/* City background — SVG illustration */}
    <div className="absolute inset-0">
      <svg
        viewBox="0 0 600 900"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a1f6e"/>
            <stop offset="60%" stopColor="#1a3a8e"/>
            <stop offset="100%" stopColor="#0d2580"/>
          </linearGradient>
          <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a3a8e"/>
            <stop offset="100%" stopColor="#0a1a5e"/>
          </linearGradient>
          <linearGradient id="overlayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a3a8e" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#0a1f6e" stopOpacity="0.7"/>
          </linearGradient>
        </defs>

        {/* Sky background */}
        <rect width="600" height="900" fill="url(#skyGrad)"/>

        {/* Stars */}
        {[
          [50,50],[120,80],[200,30],[280,70],[350,40],
          [420,90],[500,25],[560,65],[80,140],[170,110],
          [310,120],[450,130],[530,100],[100,200],[250,180],
        ].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="1.5" fill="white" opacity={0.3 + (i%3)*0.2}/>
        ))}

        {/* Background buildings far */}
        {[
          [0,400,80,500],[90,350,70,550],[170,300,60,600],
          [240,380,70,520],[320,320,80,580],[410,360,70,540],
          [490,340,110,560],
        ].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y} width={w} height={h}
            fill="#1a3a8e" opacity={0.4 + i*0.03}/>
        ))}

        {/* Mid buildings */}
        {[
          [20,250,60,650],[100,200,80,700],[200,180,70,720],
          [290,220,90,680],[400,190,75,710],[490,230,110,670],
        ].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y} width={w} height={h}
            fill="url(#buildingGrad)" opacity={0.7}/>
        ))}

        {/* Front tall building — Empire State style */}
        <rect x="220" y="100" width="160" height="800" fill="#1a3580" opacity="0.85"/>
        <rect x="240" y="60" width="120" height="100" fill="#1a3580" opacity="0.85"/>
        <rect x="265" y="30" width="70" height="60" fill="#1a3580" opacity="0.9"/>
        <rect x="288" y="10" width="24" height="30" fill="#1a3580" opacity="0.95"/>
        <line x1="300" y1="0" x2="300" y2="15" stroke="white" strokeWidth="1" opacity="0.6"/>

        {/* Building windows grid */}
        {Array.from({ length: 20 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={235 + col * 22}
              y={115 + row * 30}
              width={14}
              height={18}
              fill="white"
              opacity={Math.random() > 0.4 ? 0.15 : 0.05}
              rx="1"
            />
          ))
        )}

        {/* Blue overlay */}
        <rect width="600" height="900" fill="url(#overlayGrad)"/>

        {/* Foreground buildings silhouette */}
        <rect x="0" y="600" width="600" height="300" fill="#0a1845" opacity="0.9"/>
        {[
          [0,450,100,450],[110,480,90,420],[220,500,80,400],
          [320,460,110,440],[450,490,80,410],[550,470,50,430],
        ].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y} width={w} height={h}
            fill="#0a1845" opacity={0.95}/>
        ))}
      </svg>
    </div>

    {/* Content overlay */}
    <div className="relative z-10 flex flex-col h-full justify-between p-10 xl:p-14">

      {/* Logo */}
      <div>
        <span className="text-white text-xl font-black tracking-tight">
          FundNest
        </span>
      </div>

      {/* Center text */}
      <div>
        <p className="text-cyan-300 text-xs font-bold tracking-[0.25em] uppercase mb-5 opacity-90">
          Smart Saving. Secure Future.
        </p>
        <h2
          className="text-white font-black leading-tight"
          style={{ fontSize: 'clamp(2.4rem, 4vw, 3.5rem)' }}
        >
          Elevating your<br />
          wealth to the<br />
          next tier.
        </h2>
      </div>

      {/* Bottom badge */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <span className="text-white">
            <ShieldIcon />
          </span>
        </div>
        <div>
          <p className="text-white text-sm font-bold">Bank-Grade Encryption</p>
          <p className="text-blue-200 text-xs opacity-70">
            Your data is secured by the industry's most rigorous protocols.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// ─── Password Field Component ─────────────────────────────
interface IPasswordFieldProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  error?: string;
  show: boolean;
  icon: React.ReactNode;
  onToggleShow: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const PasswordField: React.FC<IPasswordFieldProps> = ({
  label,
  name,
  value,
  placeholder,
  error,
  show,
  icon,
  onToggleShow,
  onChange,
  onBlur,
}) => (
  <div>
    <label className="block text-xs font-bold tracking-[0.12em] text-gray-500 uppercase mb-2">
      {label}
    </label>
    <div className={`
      flex items-center gap-3 px-4 py-4 rounded-2xl border
      transition-all duration-200
      ${error
        ? 'border-red-300 bg-red-50 focus-within:ring-2 focus-within:ring-red-100'
        : 'border-gray-200 bg-gray-100 focus-within:bg-white focus-within:border-[#1a3a6e] focus-within:ring-2 focus-within:ring-[#1a3a6e]/10'
      }
    `}>
      <span className={`flex-shrink-0 ${error ? 'text-red-400' : 'text-gray-400'}`}>
        {icon}
      </span>
      <input
        type={show ? 'text' : 'password'}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={name === 'newPassword' ? 'new-password' : 'new-password'}
        className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
    {error && (
      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm0-2a.75.75 0 110 1.5.75.75 0 010-1.5z"/>
        </svg>
        {error}
      </p>
    )}
  </div>
);

// ─── Main Page ────────────────────────────────────────────
const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as IResetPasswordLocationState | null;
  const email = state?.email || '';

  const [values, setValues] = useState<IResetPasswordValues>({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<IResetPasswordErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const strength = getPasswordStrength(values.newPassword);

  React.useEffect(() => {
    if (!email) {
      navigate(ROUTES.USER.FORGOT_PASSWORD, { replace: true });
    }
  }, [email, navigate]);

  // ─── Handlers ─────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const newErrors = validateForm({ ...values, [name]: value });
      setErrors((prev) => ({
        ...prev,
        [name]: newErrors[name as keyof IResetPasswordErrors],
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validateForm(values);
    setErrors((prev) => ({
      ...prev,
      [name]: newErrors[name as keyof IResetPasswordErrors],
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    setTouched({ newPassword: true, confirmPassword: true });
    const formErrors = validateForm(values);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    if (!email) {
      setErrors({
        general: 'Password reset session expired. Please verify OTP again.',
      });
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetUserPassword({
        email,
        password: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      setIsSuccess(true);

      // Redirect to login after 2.5 seconds
      setTimeout(() => {
        navigate(ROUTES.USER.LOGIN);
      }, 2500);

    } catch (err: any) {
      setErrors({
        general:
          err.response?.data?.message ||
          'Failed to reset password. Please verify OTP again and try once more.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (field: string): string | undefined =>
    touched[field] ? errors[field as keyof IResetPasswordErrors] : undefined;

  // ─── Success State ────────────────────────────────────
  if (isSuccess) {
    return (
      <div
        className="min-h-screen flex"
        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
      >
        <div className="lg:w-[52%] xl:w-[55%] flex-shrink-0">
          <LeftPanel />
        </div>

        <div
          className="flex-1 flex items-center justify-center px-6 py-10"
          style={{ background: '#f8f9fb' }}
        >
          <div className="text-center max-w-sm">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center">
                <CheckCircleIcon />
              </div>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">
              Password Reset!
            </h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Your password has been successfully reset.
              Redirecting you to login...
            </p>
            <div className="flex justify-center">
              <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1a3a6e] rounded-full"
                  style={{
                    animation: 'progress 2.5s linear forwards',
                    width: '0%',
                  }}
                />
              </div>
            </div>
            <style>{`
              @keyframes progress {
                from { width: 0% }
                to { width: 100% }
              }
            `}</style>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >

      {/* Left panel */}
      <div className="lg:w-[52%] xl:w-[55%] flex-shrink-0">
        <LeftPanel />
      </div>

      {/* Right panel */}
      <div
        className="flex-1 flex flex-col overflow-y-auto"
        style={{ background: '#f8f9fb' }}
      >
        <div className="flex-1 flex flex-col justify-between px-6 py-10 sm:px-10 lg:px-14 xl:px-20 max-w-xl w-full mx-auto">

          {/* Top spacer */}
          <div />

          {/* Form section */}
          <div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 mb-3">
                Reset your password
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Choose a strong password to secure your institutional
                assets.
              </p>
            </div>

            {/* General error */}
            {errors.general && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#ef4444">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

              {/* New Password */}
              <div>
                <PasswordField
                  label="New Password"
                  name="newPassword"
                  value={values.newPassword}
                  placeholder="••••••••"
                  error={getFieldError('newPassword')}
                  show={showNew}
                  icon={<LockIcon />}
                  onToggleShow={() => setShowNew((p) => !p)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {/* Password strength bar */}
                {values.newPassword && (
                  <div className="mt-2.5">
                    <div className="flex gap-1 mb-1.5">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{
                            background:
                              strength.score >= level
                                ? strength.color
                                : '#e5e7eb',
                          }}
                        />
                      ))}
                    </div>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: strength.color }}
                    >
                      {strength.label}
                    </p>
                  </div>
                )}

                {/* Password requirements */}
                {values.newPassword && (
                  <div className="mt-3 flex flex-col gap-1.5">
                    {[
                      { rule: values.newPassword.length >= 8, text: 'At least 8 characters' },
                      { rule: /[A-Z]/.test(values.newPassword), text: 'One uppercase letter' },
                      { rule: /[a-z]/.test(values.newPassword), text: 'One lowercase letter' },
                      { rule: /[0-9]/.test(values.newPassword), text: 'One number' },
                      { rule: /[^A-Za-z0-9]/.test(values.newPassword), text: 'One special character' },
                    ].map(({ rule, text }) => (
                      <div key={text} className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
                          style={{
                            background: rule ? '#dcfce7' : '#f3f4f6',
                          }}
                        >
                          {rule ? (
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                          )}
                        </div>
                        <span
                          className="text-xs transition-colors duration-200"
                          style={{ color: rule ? '#16a34a' : '#9ca3af' }}
                        >
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                value={values.confirmPassword}
                placeholder="••••••••"
                error={getFieldError('confirmPassword')}
                show={showConfirm}
                icon={<LockCheckIcon />}
                onToggleShow={() => setShowConfirm((p) => !p)}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {/* Passwords match indicator */}
              {values.confirmPassword && values.newPassword && (
                <div className={`
                  flex items-center gap-2 -mt-2 text-xs font-medium
                  ${values.newPassword === values.confirmPassword
                    ? 'text-green-600'
                    : 'text-red-400'
                  }
                `}>
                  {values.newPassword === values.confirmPassword ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Passwords match
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                      Passwords do not match
                    </>
                  )}
                </div>
              )}

              {/* Reset button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full flex items-center justify-center gap-2.5
                  py-4 px-6 rounded-2xl font-bold text-sm text-white mt-1
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
                    Resetting...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRightIcon />
                  </>
                )}
              </button>

            </form>

            {/* Back to Login */}
            <div className="flex justify-center mt-7">
              <button
                type="button"
                onClick={() => navigate(ROUTES.USER.LOGIN)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-[#1a3a6e] transition-colors duration-150"
              >
                <ArrowLeftIcon />
                Back to Login
              </button>
            </div>

          </div>

          {/* Footer */}
          <div className="mt-10 flex flex-col items-center gap-1">
            <p className="text-xs text-gray-400 text-center">
              FundNest Securities LLC. Member FINRA/SIPC.
            </p>
            <p className="text-xs text-gray-400 text-center">
              Protected by bank-level security.
            </p>

            {/* Secure connection indicator */}
            <div className="flex items-center gap-2 mt-4">
              <div
                className="w-2 h-2 rounded-full bg-green-500"
                style={{ boxShadow: '0 0 6px #22c55e' }}
              />
              <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                Secure Connection Active
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
