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

    CHIT_FUND: {
      GET_AVAILABLE: "/chit-funds",
      GET_DETAILS: "/chit-funds/:id",
      GET_KYC_REQUIREMENTS: "/chit-funds/:id/kyc-requirements",
      GET_JOIN_STATUS: "/chit-funds/:id/join-status",
      SUBMIT_JOIN_REQUEST: "/chit-funds/:id/join-request",
      REUPLOAD_KYC: "/chit-funds/:id/reupload-kyc",
      CREATE_CHECKOUT: "/chit-funds/:id/checkout",
      VERIFY_CHECKOUT: "/chit-funds/verify-checkout",
      VERIFY_CHECKOUT_BY_ID: "/chit-funds/:id/verify-checkout",
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

    SUBSCRIPTION_PLAN: {
      GET_ALL: "/subscription-plans",
      CREATE: "/subscription-plans",
      BILLING_HISTORY: "/subscription-plans/billing-history",
      UPDATE: "/subscription-plans/:id",
      UPDATE_STATUS: "/subscription-plans/:id/status",
      DELETE: "/subscription-plans/:id",
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

    SUBSCRIPTION_PLAN: {
      GET_AVAILABLE: "/subscription-plans",
      CREATE_CHECKOUT: "/subscriptions/checkout",
      VERIFY_CHECKOUT: "/subscriptions/checkout/verify",
      CURRENT: "/subscriptions/current",
      INVOICES: "/subscriptions/invoices",
    },

    SESSION: {
      REFRESH_TOKEN: "/tenants/refresh-token",
      LOGOUT: "/tenants/logout",
    },

    CHIT_FUND: {
      GET_ALL: "/chit-funds",
      CREATE_NORMAL: "/chit-funds/normal",
      CREATE_MULTI_DIVISION: "/chit-funds/multi-division",
      BLOCK: "/chit-funds/:id/block",
      UNBLOCK: "/chit-funds/:id/unblock",
      GET_JOIN_REQUESTS: "/chit-funds/join-requests",
      REVIEW_JOIN_REQUEST: "/chit-funds/join-requests/:id/review",
    },

    KYC_CONFIG: {
      GET: "/kyc-config",
      CONFIGURE: "/kyc-config",
    },
  },
} as const;
