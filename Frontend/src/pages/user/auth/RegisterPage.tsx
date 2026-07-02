import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import { ROUTES } from "../../../shared/constants";
import { GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../../../store/hooks";
import { loginSuccess } from "../../../store/slices/authSlice";


// ─── Types ────────────────────────────────────────────────
interface IRegisterFormValues {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  password: string;
  confirmPassword: string
  agreeToTerms: boolean;
}

interface IRegisterFormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string
  agreeToTerms?: string;
  general?: string;
}

const COUNTRY_CODES = [
  { code: '+1',  label: '+1  US/CA' },
  { code: '+91', label: '+91 IN' },
  { code: '+44', label: '+44 UK' },
  { code: '+61', label: '+61 AU' },
  { code: '+971',label: '+971 UAE' },
  { code: '+65', label: '+65 SG' },
  { code: '+60', label: '+60 MY' },
];

const validateForm = (values: IRegisterFormValues): IRegisterFormErrors =>{

    const errors: IRegisterFormErrors = {}

    if(!values.fullName.trim()){
        errors.fullName = 'Full name is required'
    }else if (values.fullName.trim().length < 2) {
        errors.fullName = 'Name must be at least 2 characters';
    }

    if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.phone) {
    errors.phone = 'Phone number is required';
  } else if (!/^\d{7,15}$/.test(values.phone.replace(/\s/g, ''))) {
    errors.phone = 'Enter a valid phone number';
  }

  const passwordRegex = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  digit: /\d/,
  special: /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`;']/,
  };

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }else if (!passwordRegex.uppercase.test(values.password)) {
  errors.password = 'Password must contain at least one uppercase letter';
  } else if (!passwordRegex.lowercase.test(values.password)) {
    errors.password = 'Password must contain at least one lowercase letter';
  } else if (!passwordRegex.digit.test(values.password)) {
    errors.password = 'Password must contain at least one digit';
  } else if (!passwordRegex.special.test(values.password)) {
    errors.password = 'Password must contain at least one special character';
  }

  if (!values.confirmPassword) {
  errors.confirmPassword = 'Confirm password is required';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!values.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms';
  }

  return errors;
};


// ─── Icons ────────────────────────────────────────────────
const EyeIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const ShieldIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

// ─── Left Panel ───────────────────────────────────────────
const LeftPanel: React.FC = () => (
  <div
    className="hidden lg:flex lg:flex-col lg:justify-between relative overflow-hidden"
    style={{
      background: 'linear-gradient(135deg, #0f2c5c 0%, #1a5276 40%, #0e6655 100%)',
      minHeight: '100vh',
    }}
  >
    {/* Noise overlay */}
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      }}
    />

    {/* Grid lines */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    />

    <div className="relative z-10 p-10 xl:p-14 flex flex-col h-full justify-between">

      {/* Top text */}
      <div>
        <p className="text-emerald-400 text-xs font-bold tracking-[0.25em] uppercase mb-6">
          The Future of Wealth
        </p>
        <h2 className="text-white font-black leading-none mb-6" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
          Architecting<br />
          Community<br />
          Prosperity.
        </h2>
        <p className="text-blue-200 text-base leading-relaxed max-w-xs" style={{ opacity: 0.8 }}>
          Experience a modern approach to collaborative growth and institutional-grade private wealth management.
        </p>
      </div>

      {/* Globe illustration */}
      <div className="my-8 relative">
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            aspectRatio: '4/3',
            maxWidth: '440px',
          }}
        >
          {/* Globe SVG illustration */}
          <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="globeGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#0066cc" stopOpacity="0.05"/>
              </radialGradient>
              <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00ffcc" stopOpacity="0.4"/>
                <stop offset="70%" stopColor="#0088ff" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="#0088ff" stopOpacity="0"/>
              </radialGradient>
            </defs>

            {/* Glow */}
            <ellipse cx="200" cy="155" rx="130" ry="130" fill="url(#glowGrad)"/>

            {/* Globe circle */}
            <circle cx="200" cy="155" r="110" fill="url(#globeGrad)" stroke="#00d4aa" strokeWidth="0.5" strokeOpacity="0.6"/>

            {/* Latitude lines */}
            {[-70,-50,-30,-10,10,30,50,70].map((y, i) => {
              const cy = 155 + y;
              const rx = Math.sqrt(Math.max(0, 110*110 - y*y));
              return rx > 0 ? (
                <ellipse key={i} cx="200" cy={cy} rx={rx} ry={rx * 0.3}
                  fill="none" stroke="#00d4aa" strokeWidth="0.4" strokeOpacity="0.25"/>
              ) : null;
            })}

            {/* Longitude lines */}
            {[0,30,60,90,120,150].map((angle, i) => (
              <ellipse key={i} cx="200" cy="155" rx={Math.abs(Math.cos(angle * Math.PI/180)) * 110} ry="110"
                fill="none" stroke="#00d4aa" strokeWidth="0.4" strokeOpacity="0.25"
                transform={`rotate(${angle} 200 155)`}/>
            ))}

            {/* Network dots */}
            {[
              [200,80],[140,120],[260,120],[170,155],[230,155],
              [200,200],[150,180],[250,180],[200,130],[180,165],
              [220,165],[160,145],[240,145],
            ].map(([x,y], i) => (
              <circle key={i} cx={x} cy={y} r="2.5" fill="#00ffcc" opacity="0.8"/>
            ))}

            {/* Network lines */}
            {[
              [200,80,140,120],[200,80,260,120],[140,120,170,155],
              [260,120,230,155],[170,155,200,200],[230,155,200,200],
              [150,180,200,200],[250,180,200,200],[200,130,200,80],
              [180,165,170,155],[220,165,230,155],[160,145,140,120],
              [240,145,260,120],[200,130,170,155],[200,130,230,155],
            ].map(([x1,y1,x2,y2],i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#00d4aa" strokeWidth="0.8" strokeOpacity="0.4"/>
            ))}
          </svg>

          {/* Security badge */}
          <div
            className="absolute bottom-4 left-4 right-4 flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #0e6655, #1a5276)' }}>
              <ShieldIcon />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Bank-Grade Security</p>
              <p className="text-blue-200 text-xs" style={{ opacity: 0.7 }}>
                Your assets are shielded by multi-layer encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
// ─── Main Register Page ───────────────────────────────────
const UserRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch()

  const [values, setValues] = useState<IRegisterFormValues>({
    fullName: '',
    email: '',
    countryCode: '+91',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<IRegisterFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ─── Handlers ──────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const target = e.target;
    const name = target.name;
    const value =
      target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target.value;

    setValues((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const newErrors = validateForm({ ...values, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof IRegisterFormErrors] }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validateForm(values);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof IRegisterFormErrors] }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const formErrors = validateForm(values);
    setErrors(formErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      agreeToTerms: true,
    });

    if (Object.keys(formErrors).length > 0) return;

    setIsLoading(true);

    try {
   
      const response = await authService.registerUser({
        name: values.fullName,
        email: values.email,
        phone: `${values.countryCode}${values.phone}`,
        password: values.password,
        confirmPassword: values.confirmPassword,
      })

      if(response.verificationRequired){
        navigate(ROUTES.USER.VERIFY_OTP,{
          state:{
            phone: `${values.countryCode}${values.phone}`,
            email: response.user.email,
          }
        })
      }
    } catch (err: any) {
      setErrors({
        general: err.response?.data?.errors?.[0].message || err.response?.data?.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async(idToken: string): Promise<void> =>{
    setIsLoading(true)
    setErrors({})

    try {
      const response = await authService.googleLogin(idToken)

      dispatch(loginSuccess({
        user: response.user,
        accessToken: response.accessToken,
      }))

      navigate(ROUTES.USER.DASHBOARD)
    } catch (err: any) {
      setErrors({
        general:
        err.response?.data?.message ||
        'Google signup failed. Please try again.',
      })
    }finally{
      setIsLoading(false)
    }
  }

  // ─── Field helper ──────────────────────────────────────
  const getFieldError = (field: string): string | undefined =>
    touched[field] ? errors[field as keyof IRegisterFormErrors] : undefined;

  // ─── Render ────────────────────────────────────────────
  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Left panel — hidden on mobile */}
      <div className="lg:w-[52%] xl:w-[55%] flex-shrink-0">
        <LeftPanel />
      </div>

      {/* Right panel — registration form */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-white">
        <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16 max-w-xl w-full mx-auto">

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-100">
              <svg width="22" height="22" viewBox="0 0 42 42" fill="none">
                <ellipse cx="21" cy="27" rx="16" ry="6" fill="#1a3a6e" opacity="0.25"/>
                <ellipse cx="21" cy="24" rx="16" ry="6" fill="#f5c842"/>
                <ellipse cx="21" cy="20" rx="16" ry="6" fill="#3b8bd4"/>
                <ellipse cx="21" cy="16" rx="16" ry="6" fill="#1a3a6e"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-[#1a3a6e]">FundNest</span>
          </div>

          {/* Header */}
          <div className="mb-7">
            <h1 className="text-3xl font-black text-gray-900 mb-1.5">
              Create your account
            </h1>
            <p className="text-gray-400 text-sm">
              Join a community of elite private investors today.
            </p>
          </div>

          {/* General error */}
          {errors.general && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {errors.general}
            </div>
          )}

          
        {/* Google button */}
          <div className="relative mb-5">
            <button
              type="button"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-150 text-sm font-medium text-gray-700 shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <GoogleIcon />
              Google
            </button>

            {/* Invisible Google login layer */}
            {!isLoading && (
              <div className="absolute inset-0 z-10 opacity-0">
                <GoogleLogin
                  width="100%"
                  onSuccess={(credentialResponse) => {
                    if (!credentialResponse.credential) {
                      setErrors({
                        general: 'Google signup failed. Please try again.',
                      });
                      return;
                    }

                    handleGoogleAuth(credentialResponse.credential);
                  }}
                  onError={() => {
                    setErrors({
                      general: 'Google signup failed. Please try again.',
                    });
                  }}
                />
              </div>
            )}
          </div>          

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={values.fullName}
                placeholder="Enter your full name"
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="name"
                className={`
                  w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400
                  border bg-gray-50 outline-none transition-all duration-200
                  ${getFieldError('fullName')
                    ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-200 focus:border-[#1a3a6e] focus:ring-2 focus:ring-[#1a3a6e]/10 focus:bg-white'
                  }
                `}
              />
              {getFieldError('fullName') && (
                <p className="mt-1 text-xs text-red-500">{getFieldError('fullName')}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={values.email}
                placeholder="name@company.com"
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
                className={`
                  w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400
                  border bg-gray-50 outline-none transition-all duration-200
                  ${getFieldError('email')
                    ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-200 focus:border-[#1a3a6e] focus:ring-2 focus:ring-[#1a3a6e]/10 focus:bg-white'
                  }
                `}
              />
              {getFieldError('email') && (
                <p className="mt-1 text-xs text-red-500">{getFieldError('email')}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone Number
              </label>
              <div className={`
                flex rounded-xl border bg-gray-50 overflow-hidden
                transition-all duration-200
                ${getFieldError('phone')
                  ? 'border-red-300 bg-red-50 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100'
                  : 'border-gray-200 focus-within:border-[#1a3a6e] focus-within:ring-2 focus-within:ring-[#1a3a6e]/10 focus-within:bg-white'
                }
              `}>
                {/* Country code dropdown */}
                <select
                  name="countryCode"
                  value={values.countryCode}
                  onChange={handleChange}
                  className="px-3 py-3 text-sm text-gray-700 bg-transparent border-r border-gray-200 outline-none cursor-pointer"
                  style={{ minWidth: '80px' }}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>

                {/* Phone input */}
                <input
                  type="tel"
                  name="phone"
                  value={values.phone}
                  placeholder="000 000 0000"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="tel"
                  className="flex-1 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 bg-transparent outline-none"
                />
              </div>
              {getFieldError('phone') && (
                <p className="mt-1 text-xs text-red-500">{getFieldError('phone')}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className={`
                flex items-center rounded-xl border bg-gray-50 px-4
                transition-all duration-200
                ${getFieldError('password')
                  ? 'border-red-300 bg-red-50 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100'
                  : 'border-gray-200 focus-within:border-[#1a3a6e] focus-within:ring-2 focus-within:ring-[#1a3a6e]/10 focus-within:bg-white'
                }
              `}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  placeholder="Min. 8 characters"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  className="flex-1 py-3 text-sm text-gray-800 placeholder-gray-400 bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors ml-2"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {getFieldError('password') && (
                <p className="mt-1 text-xs text-red-500">{getFieldError('password')}</p>
              )}
            </div>


            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                placeholder="Re-enter your password"
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="new-password"
                className={`
                  w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400
                  border bg-gray-50 outline-none transition-all duration-200
                  ${getFieldError('confirmPassword')
                    ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-200 focus:border-[#1a3a6e] focus:ring-2 focus:ring-[#1a3a6e]/10 focus:bg-white'
                  }
                `}
              />

              {getFieldError('confirmPassword') && (
                <p className="mt-1 text-xs text-red-500">
                  {getFieldError('confirmPassword')}
                </p>
              )}
            </div>


            

            {/* Terms checkbox */}
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  id="agreeToTerms"
                  checked={values.agreeToTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-4 h-4 rounded border-gray-300 accent-[#1a3a6e] cursor-pointer"
                />
              </div>
              <label
                htmlFor="agreeToTerms"
                className="text-sm text-gray-500 leading-snug cursor-pointer"
              >
                I agree to the{' '}
                <button
                  type="button"
                  className="text-[#1a3a6e] font-semibold hover:underline"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  className="text-[#1a3a6e] font-semibold hover:underline"
                >
                  Privacy Policy
                </button>
                .
              </label>
            </div>
            {getFieldError('agreeToTerms') && (
              <p className="-mt-2 text-xs text-red-500">
                {getFieldError('agreeToTerms')}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-4 px-6 rounded-xl font-bold text-sm text-white
                transition-all duration-200 mt-1
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
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin"
                    width="16" height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Get Started'
              )}
            </button>

          </form>

          {/* Login link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate(ROUTES.USER.LOGIN)}
              className="text-[#1a3a6e] font-bold hover:underline"
            >
              Log In
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default UserRegisterPage;
