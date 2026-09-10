export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  TENANT: "TENANT_ADMIN",
  USER: "USER",
} as const;

export const TENANT_STATUS = {
  PENDING: "PENDING",

  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type TenantStatus = (typeof TENANT_STATUS)[keyof typeof TENANT_STATUS];

export const ONBOARDING_STEP = {
  REGISTERED: "REGISTERED",
  OTP_VERIFIED: "OTP_VERIFIED",
  BUSINESS_INFO_COMPLETED: "BUSINESS_INFO_COMPLETED",
  KYC_COMPLETED: "KYC_COMPLETED",
  BANK_DETAILS_COMPLETED: "BANK_DETAILS_COMPLETED",
  COMPLETED: "COMPLETED",
} as const;

export type OnboardingStep =
  (typeof ONBOARDING_STEP)[keyof typeof ONBOARDING_STEP];

export const ROUTES = {
  COMMON: {
    LANDING: "/",
    PRICING: "/pricing",
    NOT_FOUND: "*",
  },
  SUPER_ADMIN: {
    LOGIN: "/superadmin/login",
    DASHBOARD: "/superadmin/dashboard",
    TENANT_MANAGEMENT: "/superadmin/tenants",
    USER_MANAGEMENT: "/superadmin/users",
    TENANT_DETAILS: "/superadmin/tenants/:tenantId",
    KYC: "/superadmin/tenants/:tenantId/kyc",
  },
  TENANT: {
    LANDING: "/tenants",
    REGISTER: "/tenants/register",
    VERIFY_OTP: "/tenants/verify-otp",
    LOGIN: "/tenants/login",
    DASHBOARD: "/tenants/dashboard",
    BUSINESS_INFO: "/tenants/business-info",
    KYC_UPLOAD: "/tenants/kyc-upload",
    BANKING: "/tenants/banking",
    FORGOT_PASSWORD: "/tenants/forgot-password",
    RESET_PASSWORD: "/tenants/reset-password",
    FORGOT_PASSWORD_OTP: "/tenants/forgot-password/otp",
  },
  USER: {
    LANDING: "/users",
    LOGIN: "/login",
    REGISTER: "/register",
    VERIFY_OTP: "/user/verify-otp",
    DASHBOARD: "/dashboard",
    FORGOT_PASSWORD: "/forgot-password",
    FORGOT_PASSWORD_OTP: "/forgot-password/otp",
    RESET_PASSWORD: "/reset-password",
    PROFILE: "/profile",
    PROFILE_INFO: "/profile/info",
  },
} as const;
