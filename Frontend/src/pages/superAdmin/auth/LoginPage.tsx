import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import type { ILoginFormValues, ILoginFormErrors } from "../../../types/auth.types";
import { validateLoginForm } from "../../../shared/validation";
import { authService } from "../../../services/authService";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { loginSuccess, setLoading, setError } from "../../../store/slices/authSlice";
import { ROUTES } from "../../../shared/constants";

// ─── Icons ────────────────────────────────────────────────
const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v.217l5 3.2 5-3.2V4a1 1 0 00-1-1H4zm9 2.383l-4.746 3.038a.5.5 0 01-.508 0L3 5.383V12a1 1 0 001 1h8a1 1 0 001-1V5.383z"/>
  </svg>
);

const LockIcon= () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1a3 3 0 00-3 3v2H4a1 1 0 00-1 1v7a1 1 0 001 1h8a1 1 0 001-1V7a1 1 0 00-1-1h-1V4a3 3 0 00-3-3zm-2 5V4a2 2 0 114 0v2H6zm2 3a1 1 0 110 2 1 1 0 010-2z"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM8 11a3 3 0 110-6 3 3 0 010 6z"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.03 7.03 0 00-2.79.588l.77.771A5.944 5.944 0 018 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0114.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
    <path d="M11.297 9.176a3.5 3.5 0 00-4.474-4.474l.823.823a2.5 2.5 0 012.829 2.829l.822.822zm-2.943 1.299l.822.822a3.5 3.5 0 01-4.474-4.474l.823.823a2.5 2.5 0 002.829 2.829z"/>
    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 001.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 018 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884l-12-12 .708-.708 12 12-.708.708z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path fillRule="evenodd" d="M1 8a.5.5 0 01.5-.5h11.793l-3.147-3.146a.5.5 0 01.708-.708l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708L13.293 8.5H1.5A.5.5 0 011 8z"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z"/>
  </svg>
);

const ErrorHintIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm0-2a.75.75 0 110 1.5.75.75 0 010-1.5z"/>
  </svg>
);

// ─── Logo ─────────────────────────────────────────────────
const FundNestLogo = () => (
  <div className="flex flex-col items-center gap-3 mb-8">
    <div className="w-16 h-16 rounded-2xl shadow-md overflow-hidden bg-white flex items-center justify-center border border-gray-100">
      <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
        <ellipse cx="21" cy="30" rx="16" ry="6" fill="#1a3a6e" opacity="0.15"/>
        <ellipse cx="21" cy="27" rx="16" ry="6" fill="#1a3a6e" opacity="0.25"/>
        <ellipse cx="21" cy="24" rx="16" ry="6" fill="#f5c842"/>
        <ellipse cx="21" cy="20" rx="16" ry="6" fill="#3b8bd4"/>
        <ellipse cx="21" cy="16" rx="16" ry="6" fill="#1a3a6e"/>
        <ellipse cx="21" cy="14" rx="10" ry="3.5" fill="#3b8bd4" opacity="0.7"/>
      </svg>
    </div>
    <div className="text-center">
      <h1 className="text-3xl font-bold text-[#1a3a6e] tracking-tight">
        FundNest
      </h1>
      <p className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase mt-0.5">
        Super Admin Portal
      </p>
    </div>
  </div>
);

// ─── Form Input ───────────────────────────────────────────
interface IFormInputProps {
  label: string;
  type: string;
  name: keyof ILoginFormValues;
  value: string;
  placeholder: string;
  error?: string;
  icon: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<IFormInputProps> = ({
  label,
  type,
  name,
  value,
  placeholder,
  error,
  icon,
  rightIcon,
  onRightIconClick,
  onChange,
  onBlur,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-semibold tracking-[0.12em] text-gray-500 uppercase">
      {label}
    </label>
    <div className={`
      flex items-center gap-3 px-4 py-3.5 rounded-xl border bg-gray-50
      transition-all duration-200
      ${error
        ? 'border-red-300 bg-red-50 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100'
        : 'border-gray-200 focus-within:border-[#1a3a6e] focus-within:ring-2 focus-within:ring-[#1a3a6e]/10 focus-within:bg-white'
      }
    `}>
      <span className={`flex-shrink-0 ${error ? 'text-red-400' : 'text-gray-400'}`}>
        {icon}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={name === 'email' ? 'email' : 'current-password'}
        className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
      />
      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {rightIcon}
        </button>
      )}
    </div>
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
        <ErrorHintIcon />
        {error}
      </p>
    )}
  </div>
);


// ─── Main Page ────────────────────────────────────────────
const SuperAdminLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Read from Redux store
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
      const response = await authService.loginSuperAdmin(values);
      dispatch(loginSuccess({
        user: response.user,
        accessToken: response.accessToken,
      }));
      navigate(ROUTES.SUPER_ADMIN.DASHBOARD);
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Invalid credentials. Please try again.';
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ─── Render ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f0f2f7] flex flex-col items-center justify-center px-4 py-12">

      <FundNestLogo />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        <div className="mb-7">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-sm text-gray-400 mt-1">
            Please enter your credentials to access the vault.
          </p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <span className="text-red-500 flex-shrink-0">
              <AlertIcon />
            </span>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

          <FormInput
            label="Email Address"
            type="email"
            name="email"
            value={values.email}
            placeholder="admin@fundnest.com"
            error={touched.email ? errors.email : undefined}
            icon={<EmailIcon />}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={values.password}
            placeholder="••••••••••••"
            error={touched.password ? errors.password : undefined}
            icon={<LockIcon />}
            rightIcon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
            onRightIconClick={() => setShowPassword((prev) => !prev)}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`
              mt-2 w-full flex items-center justify-center gap-2.5
              py-4 px-6 rounded-xl font-semibold text-sm tracking-wide text-white
              transition-all duration-200
              ${isLoading
                ? 'bg-[#1a3a6e]/70 cursor-not-allowed'
                : 'bg-[#1a3a6e] hover:bg-[#152d57] active:scale-[0.98] shadow-md hover:shadow-lg'
              }
            `}
          >
            {isLoading ? (
              <>
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
                Signing in...
              </>
            ) : (
              <>
                Login to Dashboard
                <ArrowRightIcon />
              </>
            )}
          </button>

        </form>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
          © 2026 FundNest. The Digital Vault for your Capital.
        </p>
        <div className="flex items-center justify-center gap-3 mt-2">
          {['Security Protocol', 'Privacy Policy', 'Contact Support'].map(
            (item, i, arr) => (
              <React.Fragment key={item}>
                <button className="text-xs text-gray-400 hover:text-[#1a3a6e] transition-colors">
                  {item}
                </button>
                {i < arr.length - 1 && (
                  <span className="text-gray-300 text-xs">•</span>
                )}
              </React.Fragment>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLoginPage;
