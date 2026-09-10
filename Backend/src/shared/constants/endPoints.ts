export const ENDPOINTS = {
  USER: {
    AUTH: {
      REGISTER: "/register",
      VERIFY_OTP: "/register/verify-otp",
      RESEND_OTP: "/register/resend-otp",
      LOGIN: "/login",
      GOOGLE_LOGIN: "/google",
    },

    PASSWORD: {
      SEND_OTP: "/forgot-password/send-otp",
      RESEND_OTP: "/forgot-password/resend-otp",
      VERIFY_OTP: "/forgot-password/verify-otp",
      RESET: "/forgot-password/reset",
      CHANGE: "/me/password",
    },

    PROFILE: {
      GET: "/me",
      UPDATE: "/me/profile",
      PHOTO: "/me/photo",
    },

    SESSION: {
      REFRESH_TOKEN: "/user/refresh-token",
      LOGOUT: "/user/logout",
    },
  },

  SUPER_ADMIN: {
    AUTH: {
      LOGIN: "/super-admin/login",
    },

    SESSION: {
      REFRESH_TOKEN: "/super-admin/refresh-token",
      LOGOUT: "/super-admin/logout",
    },

    TENANT: {
      GET_ALL: "/tenants",
      GET_ONE: "/tenants/:id",
      UPDATE_STATUS: "/tenants/:id/status",

      VERIFICATION: {
        BUSINESS: "/tenants/:id/verify-business",
        KYC: "/tenants/:id/verify-kyc",
        BANK: "/tenants/:id/verify-bank",
        COMPLETE: "/tenants/:id/complete-verification",
      },
    },

    USER: {
      GET_ALL: "/users",
      GET_ONE: "/users/:id",
      UPDATE_STATUS: "/users/:id/status",
    },
  },

  TENANT: {
    AUTH: {
      REGISTER: "/register",
      VERIFY_OTP: "/register/verify-otp",
      RESEND_OTP: "/register/resend-otp",
      LOGIN: "/login",
    },

    PROFILE: {
      GET: "/me",
    },

    PASSWORD: {
      SEND_OTP: "/forgot-password/send-otp",
      VERIFY_OTP: "/forgot-password/verify-otp",
      RESET: "/forgot-password/reset",
      RESEND_OTP: "/forgot-password/resend-otp",
      CHANGE: "/me/password",
    },

    BUSINESS: {
      BUSINESS_INFO: "/business-info",
    },

    KYC: {
      KYC_UPLOAD: "/kyc",
    },

    BANKING: {
      BANK_DETAILS: "/bank-details",
    },

    SESSION: {
      REFRESH_TOKEN: "/tenants/refresh-token",
      LOGOUT: "/tenants/logout",
    },
  },
} as const;
