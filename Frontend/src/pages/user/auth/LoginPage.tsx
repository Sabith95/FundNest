import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginSuccess, setLoading, setError } from '../../../store/slices/authSlice';
import { authService } from '../../../services/authService';
import { validateLoginForm } from '../../../shared/validation';
import type { ILoginFormValues, ILoginFormErrors } from '../../../types/auth.types';
import { GoogleLogin } from '@react-oauth/google';
import { ROUTES } from '../../../shared/constants';

// ─── Icons ────────────────────────────────────────────────
const EmailIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
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

const GoogleIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// const AppleIcon: React.FC = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
//   </svg>
// );

// ─── Left Panel ───────────────────────────────────────────
const LeftPanel: React.FC = () => (
  <div
    className="hidden lg:flex lg:flex-col lg:justify-between relative overflow-hidden"
    style={{
      background: 'linear-gradient(160deg, #0f2c5c 0%, #1a5276 45%, #0e7a6e 100%)',
      minHeight: '100vh',
    }}
  >
    {/* Noise texture overlay */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      }}
    />

    <div className="relative z-10 flex flex-col h-full justify-between p-10 xl:p-14">

      {/* Top label */}
      <div>
        <p className="text-blue-200 text-xs font-bold tracking-[0.25em] uppercase opacity-80">
          Private Wealth
        </p>
      </div>

      {/* Center content */}
      <div>
        <h2
          className="text-white font-black leading-tight mb-5"
          style={{ fontSize: 'clamp(2.4rem, 4vw, 3.6rem)' }}
        >
          Your assets,<br />
          architected for<br />
          growth.
        </h2>
        <p className="text-blue-200 text-base leading-relaxed max-w-xs opacity-75 mb-10">
          Experience a new standard in digital wealth
          management where precision meets prestige.
        </p>

        {/* Chart illustration */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            maxWidth: '420px',
          }}
        >
          <svg viewBox="0 0 420 240" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="arrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00d4aa"/>
                <stop offset="100%" stopColor="#00aaff"/>
              </linearGradient>
              <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1a4a7a"/>
                <stop offset="100%" stopColor="#0d2137"/>
              </linearGradient>
              <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#00aaff" stopOpacity="0.05"/>
              </linearGradient>
            </defs>

            {/* Background glow */}
            <rect width="420" height="240" fill="url(#glowGrad)"/>

            {/* Grid lines */}
            {[40, 80, 120, 160, 200].map((y) => (
              <line key={y} x1="30" y1={y} x2="400" y2={y}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            ))}

            {/* Bar chart */}
            {[
              [45,  180, 30],
              [90,  160, 30],
              [135, 140, 30],
              [180, 120, 30],
              [225, 100, 30],
              [270, 80,  30],
              [315, 60,  30],
              [360, 40,  30],
            ].map(([x, y, w], i) => (
              <rect
                key={i}
                x={x} y={y}
                width={w} height={220 - y}
                fill="url(#barGrad)"
                rx="3"
                opacity={0.6 + i * 0.05}
              />
            ))}

            {/* Growth arrow line */}
            <path
              d="M 45 195 C 90 185, 135 165, 180 140 C 225 115, 270 85, 360 35"
              fill="none"
              stroke="url(#arrowGrad)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Arrow head */}
            <polygon
              points="360,28 348,42 372,42"
              fill="url(#arrowGrad)"
            />

            {/* Glow effect on line */}
            <path
              d="M 45 195 C 90 185, 135 165, 180 140 C 225 115, 270 85, 360 35"
              fill="none"
              stroke="#00d4aa"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.15"
            />
          </svg>
        </div>
      </div>

      {/* Bottom — investor count */}
      <div className="flex items-center gap-3">
        {/* Avatar stack */}
        <div className="flex -space-x-2">
          {['#c0392b','#27ae60','#2980b9'].map((color, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
              style={{ background: color }}
            >
              {['JD','AS','MK'][i]}
            </div>
          ))}
        </div>
        <p className="text-white text-sm font-medium opacity-80">
          Joined by{' '}
          <span className="font-bold opacity-100">12,000+</span>{' '}
          investors globally
        </p>
      </div>
    </div>
  </div>
);

// ─── Main Login Page ──────────────────────────────────────
const UserLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const error = useAppSelector((state) => state.auth.error);

  const [values, setValues] = useState<ILoginFormValues>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<ILoginFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // ─── Handlers ─────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const newErrors = validateLoginForm({ ...values, [name]: value });
      setErrors((prev) => ({
        ...prev,
        [name]: newErrors[name as keyof ILoginFormErrors],
      }));
    }
    dispatch(setError(null));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validateLoginForm(values);
    setErrors((prev) => ({
      ...prev,
      [name]: newErrors[name as keyof ILoginFormErrors],
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const formErrors = validateLoginForm(values);
    setErrors(formErrors);
    setTouched({ email: true, password: true });

    if (Object.keys(formErrors).length > 0) return;

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await authService.loginUser(values);
      dispatch(loginSuccess({
        user: response.user,
        accessToken: response.accessToken,
      }));
      navigate(ROUTES.USER.DASHBOARD);
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Invalid credentials. Please try again.';
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleSuccess = async(idToken: string): Promise<void> =>{
    dispatch(setLoading(true))
    dispatch(setError(null))

    try{
      const response = await authService.googleLogin(idToken)

      dispatch(loginSuccess({
        user: response.user,
        accessToken: response.accessToken,
      }))

      navigate(ROUTES.USER.DASHBOARD)
    }catch(err: any) {
      const message = err.response?.data?.message || "Google login failed. Please try again"
      dispatch(setError(message))
    }finally{
      dispatch(setLoading(false))
    }
  }
  

  const getFieldError = (field: string): string | undefined =>
    touched[field] ? errors[field as keyof ILoginFormErrors] : undefined;

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
      <div className="flex-1 flex flex-col overflow-y-auto bg-white">
        <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16 max-w-lg w-full mx-auto">

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-100 shadow-sm">
              <svg width="26" height="26" viewBox="0 0 42 42" fill="none">
                <ellipse cx="21" cy="27" rx="16" ry="6" fill="#1a3a6e" opacity="0.25"/>
                <ellipse cx="21" cy="24" rx="16" ry="6" fill="#f5c842"/>
                <ellipse cx="21" cy="20" rx="16" ry="6" fill="#3b8bd4"/>
                <ellipse cx="21" cy="16" rx="16" ry="6" fill="#1a3a6e"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-[#1a3a6e]">FundNest</span>
          </div>

          {/* Header */}
          <div className="mb-7">
            <h1 className="text-3xl font-black text-gray-900 mb-1.5">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-sm">
              Access your investment dashboard.
            </p>
          </div>

          {/* General error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#ef4444">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-bold tracking-[0.1em] text-gray-600 uppercase mb-2">
                Email Address
              </label>
              <div className={`
                flex items-center gap-3 px-4 py-3.5 rounded-2xl border bg-gray-50
                transition-all duration-200
                ${getFieldError('email')
                  ? 'border-red-300 bg-red-50 focus-within:ring-2 focus-within:ring-red-100'
                  : 'border-gray-200 focus-within:border-[#1a3a6e] focus-within:ring-2 focus-within:ring-[#1a3a6e]/10 focus-within:bg-white'
                }
              `}>
                <span className={`flex-shrink-0 ${getFieldError('email') ? 'text-red-400' : 'text-gray-400'}`}>
                  <EmailIcon />
                </span>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  placeholder="name@company.com"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                />
              </div>
              {getFieldError('email') && (
                <p className="mt-1.5 text-xs text-red-500">
                  {getFieldError('email')}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold tracking-[0.1em] text-gray-600 uppercase">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.USER.FORGOT_PASSWORD)}
                  className="text-xs font-bold text-[#1a5276] hover:text-[#1a3a6e] hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className={`
                flex items-center gap-3 px-4 py-3.5 rounded-2xl border bg-gray-50
                transition-all duration-200
                ${getFieldError('password')
                  ? 'border-red-300 bg-red-50 focus-within:ring-2 focus-within:ring-red-100'
                  : 'border-gray-200 focus-within:border-[#1a3a6e] focus-within:ring-2 focus-within:ring-[#1a3a6e]/10 focus-within:bg-white'
                }
              `}>
                <span className={`flex-shrink-0 ${getFieldError('password') ? 'text-red-400' : 'text-gray-400'}`}>
                  <LockIcon />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  placeholder="••••••••"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="current-password"
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {getFieldError('password') && (
                <p className="mt-1.5 text-xs text-red-500">
                  {getFieldError('password')}
                </p>
              )}
            </div>

            {/* Sign In button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-4 px-6 rounded-2xl font-bold text-sm text-white
                transition-all duration-200 mt-1
                ${isLoading
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:opacity-90 active:scale-[0.98] shadow-md hover:shadow-lg'
                }
              `}
              style={{
                background: isLoading
                  ? '#1a3a6e'
                  : 'linear-gradient(135deg, #1a3a6e 0%, #0e7a6e 100%)',
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
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
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs font-semibold text-gray-300 tracking-widest uppercase">
              Or Sign In With
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          
{/* google login */}
          <div className="relative">
            <button
              type="button"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all duration-150 text-sm font-semibold text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <GoogleIcon />
              Google
            </button>

            {/* Actual Google login click layer */}
            <div className="absolute inset-0 opacity-0">
              <GoogleLogin
                width="100%"
                onSuccess={(credentialResponse) => {
                  if (!credentialResponse.credential) {
                    dispatch(setError('Google login failed. Please try again.'));
                    return;
                  }

                  handleGoogleSuccess(credentialResponse.credential);
                }}
                onError={() => {
                  dispatch(setError('Google login failed. Please try again.'));
                }}
              />
            </div>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-400 mt-8">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate(ROUTES.USER.REGISTER)}
              className="font-bold text-[#1a3a6e] hover:underline"
            >
              Sign Up
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
