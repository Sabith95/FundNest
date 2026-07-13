import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tenantAuthService } from '../../../services/tenantAuthService';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ROUTES } from '../../../shared/constants';

// ─── Types ────────────────────────────────────────────────
interface IRegisterForm {
  companyName: string;
  ownerName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface IRegisterErrors {
  companyName?: string;
  ownerName?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

// ─── Validation ───────────────────────────────────────────
const validate = (v: IRegisterForm): IRegisterErrors => {
  const e: IRegisterErrors = {};
  if (!v.companyName.trim()) e.companyName = 'Company name is required';
  if (!v.ownerName.trim()) e.ownerName = 'Owner name is required';
  if (!v.phone.trim()) e.phone = 'Phone is required';
  else if (!/^\+?[\d\s\-(). ]{7,}$/.test(v.phone)) e.phone = 'Enter a valid phone number';
  if (!v.email.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter a valid email address';
  if (!v.password) e.password = 'Password is required';
  else if (v.password.length < 8) e.password = 'Minimum 8 characters required';
  if (!v.confirmPassword) e.confirmPassword = 'Please confirm your password';
  else if (v.confirmPassword !== v.password) e.confirmPassword = 'Passwords do not match';
  if (!v.agreeToTerms) e.agreeToTerms = 'You must agree to continue';
  return e;
};

// ─── SVG Icons ────────────────────────────────────────────
const FundNestLogo = () => (
  <svg width="28" height="28" viewBox="0 0 42 42" fill="none">
    <ellipse cx="21" cy="27" rx="16" ry="6" fill="#1a3a6e" opacity="0.25" />
    <ellipse cx="21" cy="24" rx="16" ry="6" fill="#f5c842" />
    <ellipse cx="21" cy="20" rx="16" ry="6" fill="#3b8bd4" />
    <ellipse cx="21" cy="16" rx="16" ry="6" fill="#1a3a6e" />
  </svg>
);

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const BankBuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22" />
    <line x1="6" y1="22" x2="6" y2="11" />
    <line x1="10" y1="22" x2="10" y2="11" />
    <line x1="14" y1="22" x2="14" y2="11" />
    <line x1="18" y1="22" x2="18" y2="11" />
    <polygon points="12 2 20 7 4 7" fill="#9ca3af" stroke="none" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Navbar ───────────────────────────────────────────────
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Home', path: ROUTES.COMMON.LANDING },
    { label: 'Pricing', path: ROUTES.COMMON.PRICING },
    { label: 'Register', path: ROUTES.TENANT.REGISTER, active: true },
    { label: 'Login', path: '/login' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1180px] mx-auto px-6 sm:px-8 h-[60px] flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => navigate(ROUTES.COMMON.LANDING)}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <FundNestLogo />
          <span className="text-[17px] font-black text-[#1a3a6e] tracking-tight">FundNest</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className={`text-[14px] font-medium transition-colors ${link.active
                  ? 'text-[#1a3a6e] font-semibold border-b-2 border-[#1a3a6e] pb-0.5'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Get Started + hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(ROUTES.TENANT.REGISTER)}
            className="hidden md:flex items-center px-5 py-[9px] rounded-xl text-[13px] font-bold text-white shadow-md hover:shadow-lg hover:opacity-95 active:scale-[0.97] transition-all duration-150"
            style={{ background: 'linear-gradient(135deg, #1a2f6e 0%, #1e3fa8 100%)' }}
          >
            Get Started
          </button>
          <button
            className="md:hidden p-1 text-gray-600"
            onClick={() => setOpen(!open)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-3 shadow-lg">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => { setOpen(false); navigate(link.path); }}
              className={`text-[14px] font-medium text-left py-1 ${link.active ? 'text-[#1a3a6e] font-semibold' : 'text-gray-600'
                }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { setOpen(false); navigate(ROUTES.TENANT.REGISTER); }}
            className="mt-1 py-2.5 rounded-xl text-[13px] font-bold text-white text-center"
            style={{ background: 'linear-gradient(135deg, #1a2f6e, #1e3fa8)' }}
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

// ─── Reusable Input Field ─────────────────────────────────
interface IFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  error?: string;
  icon: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const Field: React.FC<IFieldProps> = ({
  label, name, type = 'text', placeholder,
  value, error, icon, onChange, onBlur,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[13px] font-bold text-[#1a3a6e]">{label}</label>
    <div className={`
      flex items-center gap-2.5 px-3.5 py-[11px] rounded-xl
      transition-all duration-150
      ${error
        ? 'bg-red-50 ring-1 ring-red-300'
        : 'bg-[#f4f5f7] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1a3a6e]/20 focus-within:shadow-sm'
      }
    `}>
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={
          name === 'email' ? 'email' :
            name === 'password' ? 'new-password' :
              name === 'confirmPassword' ? 'new-password' :
                name === 'phone' ? 'tel' : 'off'
        }
        className="flex-1 bg-transparent text-[14px] text-gray-800 placeholder-gray-400 outline-none min-w-0"
      />
    </div>
    {error && (
      <p className="text-[11px] text-red-500 flex items-center gap-1 leading-none">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm0-2a.75.75 0 110 1.5.75.75 0 010-1.5z" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

// ─── Footer ───────────────────────────────────────────────
const Footer: React.FC = () => (
  <footer className="bg-white border-t border-gray-100 pt-10 pb-8">
    <div className="max-w-[1180px] mx-auto px-6 sm:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">

        {/* Brand */}
        <div className="col-span-2 sm:col-span-1">
          <p className="text-[15px] font-black text-[#1a3a6e] mb-2">FundNest</p>
          <p className="text-[12px] text-gray-400 leading-relaxed">
            © 2024 FundNest. The Digital Vault for your Capital.
          </p>
        </div>

        <div>
          <p className="text-[13px] font-bold text-[#1a3a6e] mb-3">Company</p>
          <div className="flex flex-col gap-2.5">
            {['About Us', 'Security'].map((l) => (
              <button key={l} className="text-[13px] text-gray-500 hover:text-gray-800 text-left transition-colors">{l}</button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[13px] font-bold text-[#1a3a6e] mb-3">Legal</p>
          <div className="flex flex-col gap-2.5">
            {['Terms of Service', 'Privacy Policy'].map((l) => (
              <button key={l} className="text-[13px] text-gray-500 hover:text-gray-800 text-left transition-colors">{l}</button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[13px] font-bold text-[#1a3a6e] mb-3">Support</p>
          <div className="flex flex-col gap-2.5">
            {['Contact Support', 'Help Center'].map((l) => (
              <button key={l} className="text-[13px] text-gray-500 hover:text-gray-800 text-left transition-colors">{l}</button>
            ))}
          </div>
        </div>

      </div>
    </div>
  </footer>
);

// ─── Main Page ────────────────────────────────────────────
const TenantRegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState<IRegisterForm>({
    companyName: '',
    ownerName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<IRegisterErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    const nextValues = { ...values, [name]: val };
    setValues(nextValues);
    if (touched[name] || (name === 'password' && touched.confirmPassword)) {
      const errs = validate(nextValues);
      setErrors((p) => ({
        ...p,
        [name]: errs[name as keyof IRegisterErrors],
        ...(name === 'password' && touched.confirmPassword
          ? { confirmPassword: errs.confirmPassword }
          : {}),
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    const errs = validate(values);
    setErrors((p) => ({ ...p, [name]: errs[name as keyof IRegisterErrors] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ companyName: true, ownerName: true, phone: true, email: true, password: true, confirmPassword: true, agreeToTerms: true });
    if (Object.keys(errs).length > 0) return;
    setLoading(true);

    try {
      await tenantAuthService.registerTenant({
        companyName: values.companyName,
        ownerName: values.ownerName,
        phone: values.phone,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      navigate(ROUTES.TENANT.VERIFY_OTP, {
        state: {
          email: values.email,
          phone: values.phone,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Registration failed");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const err = (f: string) => touched[f] ? errors[f as keyof IRegisterErrors] : undefined;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
    >
      <Navbar />

      {/* ── Main ──────────────────────────────────────── */}
      <main className="flex-1" style={{ background: '#eef0f5' }}>
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 py-10 sm:py-14">

          {/* Outer wrapper — slight white bg, rounded, subtle shadow */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.45)' }}
          >
            <div className="flex flex-col lg:flex-row min-h-[600px]">

              {/* ── LEFT ─────────────────────────────── */}
              <div className="lg:w-[46%] px-8 sm:px-12 py-12 flex flex-col justify-center relative overflow-hidden">

                {/* Green blob top-left */}
                <div
                  className="absolute -top-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(134,239,172,0.35) 0%, rgba(134,239,172,0.08) 60%, transparent 100%)',
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <h1 className="font-black leading-[1.1] mb-5" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)' }}>
                    <span className="block text-[#1a3a6e]">Establish Your</span>
                    <span className="block" style={{ color: '#4338ca' }}>Digital Vault</span>
                  </h1>

                  <p className="text-[14px] text-gray-500 leading-relaxed mb-8 max-w-[340px]">
                    Join the next generation of chit fund management. Ěecure,
                    transparent, and built for modern capital growth.
                  </p>

                  {/* Feature cards */}
                  <div className="flex flex-col gap-4">

                    {/* Card 1 — Military-Grade Security */}
                    <div
                      className="flex items-start gap-4 rounded-2xl px-5 py-4"
                      style={{
                        background: 'rgba(255,255,255,0.75)',
                        border: '1px solid rgba(219,224,255,0.8)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #1a2f6e 0%, #1e3fa8 100%)' }}
                      >
                        <ShieldCheckIcon />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-[13px] font-bold text-[#1a3a6e] mb-1">Military-Grade Security</p>
                        <p className="text-[12px] text-gray-500 leading-relaxed">
                          Your capital data is encrypted and vaulted.
                        </p>
                      </div>
                    </div>

                    {/* Card 2 — Compliance Ready */}
                    <div
                      className="flex items-start gap-4 rounded-2xl px-5 py-4"
                      style={{
                        background: 'rgba(255,255,255,0.65)',
                        border: '1px solid rgba(219,224,255,0.7)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: '#f3f4f6' }}
                      >
                        <BankBuildingIcon />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-[13px] font-bold text-[#1a3a6e] mb-1">Compliance Ready</p>
                        <p className="text-[12px] text-gray-500 leading-relaxed">
                          Built-in tools for regulatory adherence.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* ── RIGHT — Form Card ─────────────────── */}
              <div className="lg:w-[54%] flex items-stretch">
                <div
                  className="flex-1 bg-white rounded-3xl shadow-xl my-3 mr-3 px-8 sm:px-10 py-9 flex flex-col justify-center"
                  style={{ border: '1px solid #f0f0f5' }}
                >

                  {/* Form header */}
                  <div className="mb-6">
                    <h2 className="text-[22px] font-black text-[#1a3a6e] mb-1">
                      Create Tenant Account
                    </h2>
                    <p className="text-[13px] text-gray-400">
                      Start managing your funds with precision.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

                    {/* Company Name */}
                    <Field
                      label="Company Name"
                      name="companyName"
                      placeholder="e.g. Skyline Capital"
                      value={values.companyName}
                      error={err('companyName')}
                      icon={<GridIcon />}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    {/* Owner Name + Phone row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="Owner Name"
                        name="ownerName"
                        placeholder="John Doe"
                        value={values.ownerName}
                        error={err('ownerName')}
                        icon={<UserIcon />}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Field
                        label="Phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={values.phone}
                        error={err('phone')}
                        icon={<PhoneIcon />}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>

                    {/* Email */}
                    <Field
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="owner@company.com"
                      value={values.email}
                      error={err('email')}
                      icon={<MailIcon />}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    {/* Password + Confirm Password row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="••••••••••••"
                        value={values.password}
                        error={err('password')}
                        icon={<LockIcon />}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Field
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••••••"
                        value={values.confirmPassword}
                        error={err('confirmPassword')}
                        icon={<LockIcon />}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>

                    {/* Terms */}
                    <div className="flex flex-col gap-1">
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          name="agreeToTerms"
                          checked={values.agreeToTerms}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="mt-0.5 w-[15px] h-[15px] rounded accent-[#1a3a6e] cursor-pointer flex-shrink-0"
                        />
                        <span className="text-[13px] text-gray-500 leading-snug">
                          I agree to the{' '}
                          <button type="button" className="text-[#1a3a6e] font-semibold hover:underline">
                            Terms of Service
                          </button>
                          {' '}and{' '}
                          <button type="button" className="text-[#1a3a6e] font-semibold hover:underline">
                            Privacy Policy
                          </button>
                          .
                        </span>
                      </label>
                      {err('agreeToTerms') && (
                        <p className="text-[11px] text-red-500 ml-6">{err('agreeToTerms')}</p>
                      )}
                    </div>

                    {/* Continue button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`
                        w-full flex items-center justify-center gap-2.5
                        py-[14px] px-6 rounded-xl font-bold text-[15px] text-white mt-1
                        transition-all duration-200
                        ${loading
                          ? 'opacity-70 cursor-not-allowed'
                          : 'hover:brightness-110 active:scale-[0.98] shadow-lg'
                        }
                      `}
                      style={{
                        background: 'linear-gradient(135deg, #1a2f6e 0%, #1a78d4 100%)',
                      }}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                          </svg>
                          Creating account...
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRightIcon />
                        </>
                      )}
                    </button>

                    {/* Login redirect */}
                    <p className="text-center text-[13px] text-gray-400">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/tenant/login')}
                        className="font-bold text-[#1a3a6e] hover:underline"
                      >
                        Log In
                      </button>
                    </p>

                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TenantRegisterPage;