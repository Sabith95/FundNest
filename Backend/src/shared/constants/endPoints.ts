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

  },

  TENANT: {
    AUTH: {
      REGISTER: '/register',
      VERIFY_OTP: '/register/verify-otp',
      RESEND_OTP: '/register/resend-otp',      
    },

    BUSINESS: {
      BUSINESS_INFO: '/business-info',
    },
    
    KYC: {
      KYC_UPLOAD: '/kyc',
    },

    BANKING: {
      BANK_DETAILS: '/bank-details',
    },

    SESSION: {
    REFRESH_TOKEN: "/tenants/refresh-token",
    LOGOUT: "/tenants/logout",
    },
}
} as const;