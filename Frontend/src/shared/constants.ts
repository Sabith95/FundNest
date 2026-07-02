export const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  TENANT: 'Tenant',
  USER: 'User',
} as const;

export const ROUTES = {
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
  },
} as const;