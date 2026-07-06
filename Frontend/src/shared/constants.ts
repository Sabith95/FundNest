export const ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    TENANT: "TENANT",
    USER: "USER",
} as const;

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
    LOGIN: '/tenant/login',
    DASHBOARD: '/tenant/dashboard',
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