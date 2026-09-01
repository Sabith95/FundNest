export const API_ROUTES = {
    SUPER_ADMIN: {
        LOGIN: '/auth/super-admin/login',
        LOGOUT: '/auth/super-admin/logout',
        GET_USERS: "/admin/users",
        GET_USER: (id: string) => `/admin/users/${id}`,
        UPDATE_STATUS: (id: string) => `/admin/users/${id}/status`,
        GET_TENANTS: "/admin/tenants",
        GET_TENANT: (id: string) => `/admin/tenants/${id}`,
        UPDATE_TENANT_STATUS: (id: string) => `/admin/tenants/${id}/status` ,
        VERIFY_BUSINESS_DETAILS: (id: string) => `/admin/tenants/${id}/verify-business`,
        VERIFY_BANK_DETAILS: (id: string) => `/admin/tenants/${id}/verify-bank`,
        VERIFY_KYC_DOCUMENTS: (id: string) => `/admin/tenants/${id}/verify-kyc`,
        COMPLETE_TENANT_VERIFICATION: (id: string) => `/admin/tenants/${id}/complete-verification`,
    },

    USERS: {
        REGISTER: '/users/register',
        LOGIN: '/users/login',
        VERIFY_OTP: '/users/register/verify-otp',
        REQUEST_PASSWORD_RESET_OTP: '/users/forgot-password/send-otp',
        RESEND_PASSWORD_RESET_OTP: '/users/forgot-password/resend-otp',
        VERIFY_PASSWORD_RESET_OTP: '/users/forgot-password/verify-otp',
        RESET_PASSWORD: '/users/forgot-password/reset',
        GOOGLE_LOGIN: '/users/google',
        RESEND_OTP: '/users/register/resend-otp',
        LOGOUT: '/auth/user/logout',
        GET_PROFILE: '/users/me',
        UPDATE_PROFILE: '/users/me/profile',
        UPDATE_PROFILE_PHOTO: '/users/me/photo',
        CHANGE_PASSWORD: '/users/me/password'
    },

    TENANTS: {
        REGISTER: '/tenants/register',
        VERIFY_OTP: '/tenants/register/verify-otp',
        RESEND_OTP:  '/tenants/register/resend-otp',
        LOGIN: "/tenants/login",
        UPDATE_BUSINESS_INFO: '/tenants/business-info',
        UPDATE_BANK_DETAILS: "/tenants/bank-details",
        UPDATE_KYC: "/tenants/kyc",

    }
}