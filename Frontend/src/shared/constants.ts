export const ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    TENANT: "TENANT",
    USER: "USER",
} as const;

export const TENANT_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type TenantStatus =
  (typeof TENANT_STATUS)[keyof typeof TENANT_STATUS];

export const ONBOARDING_STEP = {
  REGISTERED: "REGISTERED",
  BUSINESS_INFO: "BUSINESS_INFO",
  KYC_UPLOAD: "KYC_UPLOAD",
  BANK_DETAILS: "BANK_DETAILS",
  COMPLETED: "COMPLETED",
} as const;

export type OnboardingStep =
  (typeof ONBOARDING_STEP)[keyof typeof ONBOARDING_STEP];



export const ROUTES = {

  COMMON: {
    LANDING: '/',
    PRICING: '/PRICING',
  },
  SUPER_ADMIN: {
    LOGIN: '/superadmin/login',
    DASHBOARD: '/superadmin/dashboard',
  },
  TENANT: {
    REGISTER: '/tenants/register',
    VERIFY_OTP: '/tenants/verify-otp',
    LOGIN: '/tenants/login',
    DASHBOARD: '/tenants/dashboard',
    BUSINESS_INFO: '/tenants/business-info',
    KYC_UPLOAD: '/tenants/kyc-upload'
  },
  USER: {
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_OTP: '/user/verify-otp',
    DASHBOARD: '/dashboard',
    FORGOT_PASSWORD: '/forgot-password',
    FORGOT_PASSWORD_OTP: '/forgot-password/otp',
    RESET_PASSWORD: '/reset-password',
    PROFILE: '/profile',
    PROFILE_INFO: '/profile/info',
  },
} as const;