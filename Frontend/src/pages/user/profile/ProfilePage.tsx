import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { mapProfileDto, mapAddressToRequest, userProfileService } from '../../../services/userProfileService';
import type {
  IProfileFormValues,
  IProfileFormErrors,
  IPasswordFormValues,
  IPasswordFormErrors,
  IUserProfile,
  IAddressFormValues,
} from '../../../types/profile.types';
import { EMPTY_ADDRESS } from '../../../types/profile.types';

// ─── Mock data — replace with Redux state later ───────────
const EMPTY_PROFILE: IUserProfile = {
  id: '',
  fullName: '',
  email: '',
  phone: '',
  address: { ...EMPTY_ADDRESS },
  role: 'Member',
  isVerified: false,
  lastUpdated: 'Not updated yet',
  kycStatus: 'PENDING',
  authProvider: 'LOCAL',
};

const ADDRESS_FIELD_NAMES = ['line1', 'line2', 'city', 'state', 'pincode', 'country'] as const;

const isAddressField = (name: string): name is keyof IAddressFormValues =>
  ADDRESS_FIELD_NAMES.includes(name as keyof IAddressFormValues);

const addressesEqual = (a: IAddressFormValues, b: IAddressFormValues): boolean =>
  ADDRESS_FIELD_NAMES.every((field) => a[field].trim() === b[field].trim());

// ─── Validation ───────────────────────────────────────────
const validateProfile = (values: IProfileFormValues): IProfileFormErrors => {
  const errors: IProfileFormErrors = {};
  if (!values.fullName.trim()) errors.fullName = 'Full name is required';
  if (!values.email) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = 'Enter a valid email';
  if (!values.phone.trim()) errors.phone = 'Phone number is required';
  if (!values.address.line1.trim()) errors.line1 = 'Address line 1 is required';
  if (!values.address.city.trim()) errors.city = 'City is required';
  if (!values.address.state.trim()) errors.state = 'State is required';
  if (!values.address.pincode.trim()) errors.pincode = 'Pincode is required';
  else if (!/^\d{6}$/.test(values.address.pincode.trim()))
    errors.pincode = 'Enter a valid 6-digit pincode';
  if (!values.address.country.trim()) errors.country = 'Country is required';
  return errors;
};

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      fallback
    );
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const validatePassword = (values: IPasswordFormValues): IPasswordFormErrors => {
  const errors: IPasswordFormErrors = {};
  if (!values.currentPassword) errors.currentPassword = 'Current password is required';
  if (!values.newPassword) errors.newPassword = 'New password is required';
  else if (values.newPassword.length < 8)
    errors.newPassword = 'Password must be at least 8 characters';
  if (!values.confirmPassword) errors.confirmPassword = 'Please confirm password';
  else if (values.newPassword !== values.confirmPassword)
    errors.confirmPassword = 'Passwords do not match';
  return errors;
};

// ─── Icons ────────────────────────────────────────────────
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const DocIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a78d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// ─── Form field ───────────────────────────────────────────
interface IFieldProps {
  label: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  error?: string;
  readOnly?: boolean;
  rightElement?: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<IFieldProps> = ({
  label, name, value, type = 'text',
  placeholder, error, readOnly, rightElement,
  onChange, onBlur,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold tracking-widest text-gray-500 uppercase">
      {label}
    </label>
    <div className={`
      flex items-center gap-2 px-4 py-3 rounded-xl border
      transition-all duration-200
      ${readOnly
        ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
        : error
          ? 'border-red-300 bg-red-50 focus-within:ring-2 focus-within:ring-red-100'
          : 'border-gray-200 bg-gray-50 focus-within:bg-white focus-within:border-[#1a3a6e] focus-within:ring-2 focus-within:ring-[#1a3a6e]/10'
      }
    `}>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={onChange}
        onBlur={onBlur}
        className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
      />
      {rightElement}
    </div>
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm0-2a.75.75 0 110 1.5.75.75 0 010-1.5z"/>
        </svg>
        {error}
      </p>
    )}
  </div>
);

// ─── Password strength ────────────────────────────────────
const getStrength = (pw: string) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: s, label: 'Weak', color: '#ef4444' };
  if (s <= 2) return { score: s, label: 'Fair', color: '#f97316' };
  if (s <= 3) return { score: s, label: 'Good', color: '#eab308' };
  if (s <= 4) return { score: s, label: 'Strong', color: '#22c55e' };
  return { score: s, label: 'Very Strong', color: '#10b981' };
};

// ─── Avatar ───────────────────────────────────────────────
const Avatar: React.FC<{
  name: string;
  avatarUrl?: string;
  uploading?: boolean;
  onEdit: () => void;
}> = ({ name, avatarUrl, uploading, onEdit }) => {
  const initials = (name || 'User').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="relative w-28 h-28 mx-auto">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name || 'Profile photo'}
          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
        />
      ) : (
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-black border-4 border-white shadow-lg"
          style={{ background: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)' }}
        >
          {initials}
        </div>
      )}
      {/* Edit button */}
      <button
        type="button"
        onClick={onEdit}
        disabled={uploading}
        className="absolute bottom-1 right-1 w-8 h-8 bg-[#1a78d4] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#1a3a6e] transition-colors border-2 border-white disabled:opacity-70"
        title="Update profile photo"
      >
        {uploading ? (
          <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
          </svg>
        ) : <EditIcon />}
      </button>
    </div>
  );
};

// ─── Main Profile Page ────────────────────────────────────
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<IUserProfile>(EMPTY_PROFILE);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [profileLoadError, setProfileLoadError] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState<boolean>(false);

  // ── Profile form state ────────────────────────────────
  const [profileValues, setProfileValues] = useState<IProfileFormValues>({
    fullName: EMPTY_PROFILE.fullName,
    email: EMPTY_PROFILE.email,
    phone: EMPTY_PROFILE.phone,
    address: { ...EMPTY_ADDRESS },
  });
  const [profileErrors, setProfileErrors] = useState<IProfileFormErrors>({});
  const [profileTouched, setProfileTouched] = useState<Record<string, boolean>>({});
  const [profileSaving, setProfileSaving] = useState<boolean>(false);
  const [savedProfileValues, setSavedProfileValues] = useState<IProfileFormValues>({
    fullName: EMPTY_PROFILE.fullName,
    email: EMPTY_PROFILE.email,
    phone: EMPTY_PROFILE.phone,
    address: { ...EMPTY_ADDRESS },
  });

  // ── Password form state ───────────────────────────────
  const [passwordValues, setPasswordValues] = useState<IPasswordFormValues>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<IPasswordFormErrors>({});
  const [passwordTouched, setPasswordTouched] = useState<Record<string, boolean>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [passwordSaving, setPasswordSaving] = useState<boolean>(false);

  const strength = getStrength(passwordValues.newPassword);

  const hasProfileChanges = useMemo(
    () =>
      profileValues.fullName.trim() !== savedProfileValues.fullName.trim() ||
      profileValues.email.trim() !== savedProfileValues.email.trim() ||
      profileValues.phone.trim() !== savedProfileValues.phone.trim() ||
      !addressesEqual(profileValues.address, savedProfileValues.address),
    [profileValues, savedProfileValues]
  );

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileLoadError(null);
        const data = await userProfileService.getProfile();

        if (!isMounted) return;

        setProfile(data);
        const loadedValues: IProfileFormValues = {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: { ...data.address },
        };
        setProfileValues(loadedValues);
        setSavedProfileValues(loadedValues);
      } catch (error) {
        if (!isMounted) return;
        const message = getApiErrorMessage(error, 'Unable to load profile');
        setProfileLoadError(message);
        toast.error(message);
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  // ── Profile handlers ──────────────────────────────────
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const nextValues: IProfileFormValues = isAddressField(name)
      ? {
          ...profileValues,
          address: { ...profileValues.address, [name]: value },
        }
      : { ...profileValues, [name]: value };

    setProfileValues(nextValues);

    if (profileTouched[name]) {
      const errs = validateProfile(nextValues);
      setProfileErrors((prev) => ({ ...prev, [name]: errs[name as keyof IProfileFormErrors] }));
    }
  };

  const handleProfileBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { name } = e.target;
    setProfileTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validateProfile(profileValues);
    setProfileErrors((prev) => ({ ...prev, [name]: errs[name as keyof IProfileFormErrors] }));
  };

  const handleProfileSave = async (): Promise<void> => {
    if (!hasProfileChanges) {
      toast.info('No changes to save');
      return;
    }

    const errs = validateProfile(profileValues);
    setProfileErrors(errs);
    setProfileTouched({
      fullName: true,
      email: true,
      phone: true,
      line1: true,
      line2: true,
      city: true,
      state: true,
      pincode: true,
      country: true,
    });
    if (Object.keys(errs).length > 0) return;

    try {
      setProfileSaving(true);
      const result = await userProfileService.updateProfile({
        name: profileValues.fullName.trim(),
        email: profileValues.email.trim(),
        phone: profileValues.phone.trim(),
        address: mapAddressToRequest(profileValues.address),
      });
      const updatedProfile = mapProfileDto(result.user);
      const nextValues: IProfileFormValues = {
        fullName: updatedProfile.fullName,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
        address: { ...updatedProfile.address },
      };

      setProfile(updatedProfile);
      setProfileValues(nextValues);
      setSavedProfileValues(nextValues);
      toast.success(result.emailChanged
        ? 'Profile updated. Please verify your new email.'
        : 'Profile updated successfully');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to update profile'));
    } finally {
      setProfileSaving(false);
    }
  };

  const handleProfileCancel = (): void => {
    setProfileValues(savedProfileValues);
    setProfileErrors({});
    setProfileTouched({});
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setPhotoUploading(true);
      const updatedProfile = await userProfileService.updateProfilePhoto(file);
      setProfile(updatedProfile);
      toast.success('Profile photo updated successfully');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to update profile photo'));
    } finally {
      setPhotoUploading(false);
      e.target.value = '';
    }
  };

  // ── Password handlers ─────────────────────────────────
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setPasswordValues((prev) => ({ ...prev, [name]: value }));
    if (passwordTouched[name]) {
      const errs = validatePassword({ ...passwordValues, [name]: value });
      setPasswordErrors((prev) => ({ ...prev, [name]: errs[name as keyof IPasswordFormErrors] }));
    }
  };

  const handlePasswordBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { name } = e.target;
    setPasswordTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validatePassword(passwordValues);
    setPasswordErrors((prev) => ({ ...prev, [name]: errs[name as keyof IPasswordFormErrors] }));
  };

  const handlePasswordSave = async (): Promise<void> => {
    const errs = validatePassword(passwordValues);
    setPasswordErrors(errs);
    setPasswordTouched({ currentPassword: true, newPassword: true, confirmPassword: true });
    if (Object.keys(errs).length > 0) return;

    try {
      setPasswordSaving(true);
      await userProfileService.changePassword(passwordValues);
      setPasswordValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordTouched({});
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to update password'));
    } finally {
      setPasswordSaving(false);
    }
  };

  const toggleShowPassword = (field: string): void => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const getProfileError = (field: string) =>
    profileTouched[field] ? profileErrors[field as keyof IProfileFormErrors] : undefined;

  const getPasswordError = (field: string) =>
    passwordTouched[field] ? passwordErrors[field as keyof IPasswordFormErrors] : undefined;

  // ── Render ────────────────────────────────────────────
  return (
    <DashboardLayout
      userName={profile.fullName || 'User'}
      userRole={profile.role}
      notificationCount={0}
    >
      <div className="p-5 sm:p-6 lg:p-7 space-y-6 max-w-5xl">

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-black text-gray-900">Profile Settings</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your personal information and account preferences.
          </p>
        </div>

        {profileLoadError && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {profileLoadError}
          </div>
        )}

        {/* ── Main layout ─────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-5">

          {/* ── Left — Avatar card ──────────────────── */}
          <div className="lg:w-56 xl:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoSelect}
              />
              <Avatar
                name={profileValues.fullName}
                avatarUrl={profile.avatarUrl}
                uploading={photoUploading}
                onEdit={() => fileInputRef.current?.click()}
              />

              <h3 className="mt-4 text-base font-black text-gray-900">
                {profileLoading ? 'Loading...' : profileValues.fullName || 'User'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {profile.role}
              </p>

              {/* Verified badge */}
              <div className={`
                mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                ${profile.isVerified
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-orange-50 text-orange-700 border border-orange-200'
                }
              `}>
                <span className={`w-1.5 h-1.5 rounded-full ${profile.isVerified ? 'bg-green-500' : 'bg-orange-400'}`}/>
                {profile.isVerified ? 'Verified Account' : 'Pending Verification'}
              </div>
            </div>

            {/* Identity Documents card */}
            <button
              onClick={() => navigate('/profile/kyc-upload')}
              className="w-full mt-4 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm p-4 flex items-center gap-3 hover:border-blue-300 hover:shadow-md transition-all duration-200 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <DocIcon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 group-hover:text-[#1a3a6e] transition-colors">
                  Identity Documents
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Update your KYC/AML docs
                </p>
              </div>
              <span className="text-gray-300 group-hover:text-[#1a78d4] transition-colors">
                <ChevronRightIcon />
              </span>
            </button>
          </div>

          {/* ── Right — Forms ───────────────────────── */}
          <div className="flex-1 flex flex-col gap-5 min-w-0">

            {/* Profile info form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <div className="mb-5">
                <h2 className="text-base font-black text-gray-900">Personal Information</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Update your name, email and contact details.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <FormField
                  label="Full Name"
                  name="fullName"
                  value={profileValues.fullName}
                  placeholder="Enter your full name"
                  error={getProfileError('fullName')}
                  onChange={handleProfileChange}
                  onBlur={handleProfileBlur}
                />
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profileValues.email}
                  placeholder="Enter your email"
                  error={getProfileError('email')}
                  onChange={handleProfileChange}
                  onBlur={handleProfileBlur}
                />
              </div>

              <div className="mb-4">
                <FormField
                  label="Phone Number"
                  name="phone"
                  value={profileValues.phone}
                  placeholder="+1 (000) 000-0000"
                  error={getProfileError('phone')}
                  onChange={handleProfileChange}
                  onBlur={handleProfileBlur}
                />
              </div>

              <div className="mb-4">
                <p className="text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-3">
                  Residential Address
                </p>
                <div className="flex flex-col gap-4">
                  <FormField
                    label="Address Line 1"
                    name="line1"
                    value={profileValues.address.line1}
                    placeholder="House / building / street"
                    error={getProfileError('line1')}
                    onChange={handleProfileChange}
                    onBlur={handleProfileBlur}
                  />
                  <FormField
                    label="Address Line 2"
                    name="line2"
                    value={profileValues.address.line2}
                    placeholder="Apartment, suite, landmark (optional)"
                    error={getProfileError('line2')}
                    onChange={handleProfileChange}
                    onBlur={handleProfileBlur}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="City"
                      name="city"
                      value={profileValues.address.city}
                      placeholder="Enter city"
                      error={getProfileError('city')}
                      onChange={handleProfileChange}
                      onBlur={handleProfileBlur}
                    />
                    <FormField
                      label="State"
                      name="state"
                      value={profileValues.address.state}
                      placeholder="Enter state"
                      error={getProfileError('state')}
                      onChange={handleProfileChange}
                      onBlur={handleProfileBlur}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Pincode"
                      name="pincode"
                      value={profileValues.address.pincode}
                      placeholder="6-digit pincode"
                      error={getProfileError('pincode')}
                      onChange={handleProfileChange}
                      onBlur={handleProfileBlur}
                    />
                    <FormField
                      label="Country"
                      name="country"
                      value={profileValues.address.country}
                      placeholder="Enter country"
                      error={getProfileError('country')}
                      onChange={handleProfileChange}
                      onBlur={handleProfileBlur}
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 mb-5" />

              {/* Actions row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-gray-400">
                  Last updated: {profile.lastUpdated}
                </p>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleProfileCancel}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileSave}
                    disabled={profileSaving || !hasProfileChanges}
                    className={`
                      flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white
                      transition-all duration-200
                      ${profileSaving || !hasProfileChanges ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 active:scale-95 shadow-sm'}
                    `}
                    style={{ background: 'linear-gradient(135deg, #1a3a6e, #1a78d4)' }}
                  >
                    {profileSaving ? (
                      <>
                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>

            {/* ── Change Password section ──────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <div className="flex items-start gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-[#1a3a6e]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#1a3a6e]"><LockIcon /></span>
                </div>
                <div>
                  <h2 className="text-base font-black text-gray-900">Change Password</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Keep your account secure with a strong password.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">

                {/* Current password */}
                <FormField
                  label="Current Password"
                  name="currentPassword"
                  type={showPasswords['currentPassword'] ? 'text' : 'password'}
                  value={passwordValues.currentPassword}
                  placeholder="Enter current password"
                  error={getPasswordError('currentPassword')}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => toggleShowPassword('currentPassword')}
                      className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPasswords['currentPassword'] ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* New password */}
                  <div>
                    <FormField
                      label="New Password"
                      name="newPassword"
                      type={showPasswords['newPassword'] ? 'text' : 'password'}
                      value={passwordValues.newPassword}
                      placeholder="Min 8 characters"
                      error={getPasswordError('newPassword')}
                      onChange={handlePasswordChange}
                      onBlur={handlePasswordBlur}
                      rightElement={
                        <button
                          type="button"
                          onClick={() => toggleShowPassword('newPassword')}
                          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPasswords['newPassword'] ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      }
                    />
                    {/* Strength bar */}
                    {passwordValues.newPassword && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1,2,3,4,5].map((l) => (
                            <div key={l} className="flex-1 h-1 rounded-full transition-all duration-300"
                              style={{ background: strength.score >= l ? strength.color : '#e5e7eb' }}/>
                          ))}
                        </div>
                        <p className="text-xs font-semibold" style={{ color: strength.color }}>
                          {strength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <FormField
                      label="Confirm New Password"
                      name="confirmPassword"
                      type={showPasswords['confirmPassword'] ? 'text' : 'password'}
                      value={passwordValues.confirmPassword}
                      placeholder="Re-enter new password"
                      error={getPasswordError('confirmPassword')}
                      onChange={handlePasswordChange}
                      onBlur={handlePasswordBlur}
                      rightElement={
                        <button
                          type="button"
                          onClick={() => toggleShowPassword('confirmPassword')}
                          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPasswords['confirmPassword'] ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      }
                    />
                    {/* Match indicator */}
                    {passwordValues.confirmPassword && passwordValues.newPassword && (
                      <div className={`flex items-center gap-1.5 mt-2 text-xs font-medium
                        ${passwordValues.newPassword === passwordValues.confirmPassword
                          ? 'text-green-600' : 'text-red-400'}`}>
                        {passwordValues.newPassword === passwordValues.confirmPassword ? (
                          <>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Passwords match
                          </>
                        ) : (
                          <>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            Does not match
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 my-5" />

              {/* Password actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-gray-400">
                  Use a mix of letters, numbers and symbols.
                </p>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      setPasswordValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setPasswordErrors({});
                      setPasswordTouched({});
                    }}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordSave}
                    disabled={passwordSaving}
                    className={`
                      flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white
                      transition-all duration-200
                      ${passwordSaving ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 active:scale-95 shadow-sm'}
                    `}
                    style={{ background: 'linear-gradient(135deg, #1a3a6e, #1a78d4)' }}
                  >
                    {passwordSaving ? (
                      <>
                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
                        </svg>
                        Updating...
                      </>
                    ) : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
