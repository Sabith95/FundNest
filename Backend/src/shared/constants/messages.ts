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
    OTP_SENT: 'Otp sent successfully',
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
    REGISTRATION_EXPIRED: "Registration expired. Please register again.",
    NOT_AUTHENTICATED: "Not authenticated"
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
    USERS_FETCHED:  "Users fetched successfully"
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
    BANKING_DETAILS_UPDATED: "Banking details updated successfully",
    COMPLETE_KYC: "Complete KYC before adding bank details.",
    COMPLETE_BUSINESS_INFO: "Complete business information before uploading KYC documents.",
    TENANTS_FETCHED: "Tenants fetched successfully"
    
  },

  SUPER_ADMIN: {
    LOGGED_IN: "Super admin logged in successfully",
    BUSINESS_DETAILS_VERIFIED: "Business details verification updated successfully",
    KYC_VERIFIED: "KYC documents verification updated successfully",
    BANK_DETAILS_VERIFIED: "Bank details verification updated successfully",
    ALL_DOCUMENTS_MUST_BE_VERIFIED: "All sections (Business info, KYC documents, Bank details) must be reviewed before completing verification.",
    TENANT_NOT_SUBMITTED_REQUIRED_DOCS: "Tenant has not submitted all required details yet.",
    UPDATE_VERIFICATION_DOCS: "Your verification documents did not meet our compliance criteria.",
    TENANT_VERIFICATION_COMPLETED: "Tenant verification finalized successfully"
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
    INVALID_PAGINATION: "Invalid pagination values"
  },

  FILE_UPLOAD: {
    INVALID_TYPE: "Invalid file type",
    FILE_NAME_AND_CONTENT_TYPE_ARE_REQUIRED: "fileName and contentType are required",
    BUSINESS_REGISTRATION_CERTIFICATE_KEY_AND_OWNER_ID_PROOF_KEY_ARE_REQUIRED:  "Both businessRegistrationCertificateKey and ownerIdProofKey are required."
  },

  STORAGE: {
    UPLOAD_URL_GENERATED: "Upload URL generated successfully",
    OBJECT_KEY_REQUIRED: "objectKey is required"
  }
} as const;