export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "Login successful",
    INVALID_CREDENTIALS: "Invalid email or password",
    ACCESS_DENIED: "Access denied",
    TOKEN_EXPIRED: "Token has expired",
    LOGOUT_SUCCESS: "Logged out successfully",
    EMAIL_ALREADY_REGISTERED_WITH_PASSWORD:
    "This email is already registered with password login. Please sign in using your password.",
    EMAIL_ALREADY_REGISTERED_WITH_GOOGLE:
    "This email is already registered with Google. Please continue with Google Sign-In.",
    ACCOUNT_INACTIVE:
    "Your account has been deactivated.",
    EMAIL_NOT_VERIFIED: "Email not verified",
    REFRESH_TOKEN_MISSING: "Refresh token is missing.",
    EMAIL_ALREADY_REGISTERED: "Email already registered",
    GOOGLE_LOGIN: "This account uses google login",
    EMAIL_VERIFIED: "Email already verified",
    PASSWORD_MISMATCH: "Passwords do not match",
    INVALID_OTP: "Invalid otp",
    OTP_VERIFIED: "Otp verified successfully",
    OTP_RESENT: 'OTP resent successfully',
    PASSWORD_RESET_OTP_SENT: 'Password reset OTP sent successfully',
    PASSWORD_RESET_OTP_VERIFIED: 'Password reset OTP verified successfully',
    PASSWORD_CHANGE_NOT_ALLOWED:
    "Password change is not available for Google Sign-In accounts.",
    PASSWORD_UPDATED: 'Password reset successfully',
    CURRENT_PASSWORD_INCORRECT: "Current password is incorrect.",
    NEW_PASSWORD_MUST_BE_DIFFERENT:
    "New password must be different from your current password.",
    GOOGLE_LOGIN_SUCCESSFULL: "Google login successful",
    REFRESH_TOKEN_CREATED: "Access token refreshed successfully",
  },

  USER: {
    CREATED: "User created successfully",
    UPDATED: "User updated successfully",
    DELETED: "User deleted successfully",
    LOGGED_IN: "User logged in successfully",
    NOT_FOUND: "User not found",
    NOT_AUTHENTICATED: 'Not authenticated',
    BLOCKED: "User has been blocked",
    UNBLOCKED: "User has been unblocked",
    EMAIL_ALREADY_EXISTS: "Email already exists",
    PROFILE_UPDATED: "Profile updated successfully",
    PROFILE_FETCHED: 'Profile fetched successfully',
    PROFILE_UPDATE_FAILED: "Failed to update profile",  
    PROFILE_PHOTO_UPDATED: "Profile photo updated successfully",
    PROFILE_PHOTO_UPDATE_FAILED: "Failed to update profile photo.",
    PROFILE_PHOTO_REQUIRED:'Profile photo is required',
  },

  TENANT: {
    CREATED: "Tenant created successfully",
    UPDATED: "Tenant updated successfully",
    NOT_FOUND: "Tenant not found",
    BLOCKED: "Tenant blocked successfully",
    UNBLOCKED: "Tenant unblocked successfully",
    REGISTER_WITH_EMAIL: "Please verify your email before completing business information.",
    BUSINESS_INFO_UPDATED: "Business info updated successfully",
    KYC_DOCUMENTS_REQUIRED: "Business registration certificate and owner ID proof are required.",
    KYC_UPLOADED_SUCCESSFULLY: "KYC documents uploaded successfully.",
    NOT_AUTHENTICATED: "Tenant is not authenticated.",
    
  },

  SUPER_ADMIN: {
    LOGGED_IN: "Super admin logged in successfully",
  },

  SUBSCRIPTION: {
    PURCHASED: "Subscription purchased successfully",
    EXPIRED: "Subscription has expired",
    REQUIRED: "An active subscription is required",
  },

  FUND: {
    CREATED: "Fund created successfully",
    UPDATED: "Fund updated successfully",
    NOT_FOUND: "Fund not found",
    CLOSED: "Fund has been closed",
  },

  COMMON: {
    SUCCESS: "Operation completed successfully",
    FAILED: "Operation failed",
    INTERNAL_SERVER_ERROR: "Something went wrong",
    LOGGED_OUT: 'Logged out successfully',
  },
} as const;