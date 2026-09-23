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
    ACCOUNT_INACTIVE: "Your account has been deactivated.",
    EMAIL_NOT_VERIFIED: "Email not verified",
    REFRESH_TOKEN_MISSING: "Refresh token is missing.",
    EMAIL_ALREADY_REGISTERED: "Email already registered",
    GOOGLE_LOGIN: "This account uses google login",
    EMAIL_VERIFIED: "Email already verified",
    PASSWORD_MISMATCH: "Passwords do not match",
    INVALID_OTP: "Invalid otp",
    OTP_VERIFIED: "Otp verified successfully",
    OTP_RESENT: "OTP resent successfully",
    OTP_SENT: "Otp sent successfully",
    PASSWORD_RESET_OTP_SENT: "Password reset OTP sent successfully",
    PASSWORD_RESET_OTP_VERIFIED: "Password reset OTP verified successfully",
    PASSWORD_CHANGE_NOT_ALLOWED:
      "Password change is not available for Google Sign-In accounts.",
    PASSWORD_UPDATED: "Password reset successfully",
    CURRENT_PASSWORD_INCORRECT: "Current password is incorrect.",
    NEW_PASSWORD_MUST_BE_DIFFERENT:
      "New password must be different from your current password.",
    GOOGLE_LOGIN_SUCCESSFULL: "Google login successful",
    REFRESH_TOKEN_CREATED: "Access token refreshed successfully",
    REGISTRATION_EXPIRED: "Registration expired. Please register again.",
    NOT_AUTHENTICATED: "Not authenticated",
  },

  USER: {
    CREATED: "User created successfully",
    UPDATED: "User updated successfully",
    DELETED: "User deleted successfully",
    LOGGED_IN: "User logged in successfully",
    NOT_FOUND: "User not found",
    NOT_AUTHENTICATED: "Not authenticated",
    BLOCKED: "User has been blocked",
    UNBLOCKED: "User has been unblocked",
    EMAIL_ALREADY_EXISTS: "Email already exists",
    PROFILE_UPDATED: "Profile updated successfully",
    PROFILE_FETCHED: "Profile fetched successfully",
    PROFILE_UPDATE_FAILED: "Failed to update profile",
    PROFILE_PHOTO_UPDATED: "Profile photo updated successfully",
    PROFILE_PHOTO_UPDATE_FAILED: "Failed to update profile photo.",
    PROFILE_PHOTO_REQUIRED: "Profile photo is required",
    USERS_FETCHED: "Users fetched successfully",
  },

  TENANT: {
    CREATED: "Tenant created successfully",
    UPDATED: "Tenant updated successfully",
    NOT_FOUND: "Tenant not found",
    BLOCKED: "Tenant blocked successfully",
    UNBLOCKED: "Tenant unblocked successfully",
    REGISTER_WITH_EMAIL:
      "Please verify your email before completing business information.",
    BUSINESS_INFO_UPDATED: "Business info updated successfully",
    KYC_DOCUMENTS_REQUIRED:
      "Business registration certificate and owner ID proof are required.",
    KYC_UPLOADED_SUCCESSFULLY: "KYC documents uploaded successfully.",
    NOT_AUTHENTICATED: "Tenant is not authenticated.",
    BANKING_DETAILS_UPDATED: "Banking details updated successfully",
    COMPLETE_KYC: "Complete KYC before adding bank details.",
    COMPLETE_BUSINESS_INFO:
      "Complete business information before uploading KYC documents.",
    TENANTS_FETCHED: "Tenants fetched successfully",
    NOT_APPROVED:
      "Only approved tenants with completed onboarding can purchase a subscription",
  },

  SUPER_ADMIN: {
    LOGGED_IN: "Super admin logged in successfully",
    BUSINESS_DETAILS_VERIFIED:
      "Business details verification updated successfully",
    KYC_VERIFIED: "KYC documents verification updated successfully",
    BANK_DETAILS_VERIFIED: "Bank details verification updated successfully",
    ALL_DOCUMENTS_MUST_BE_VERIFIED:
      "All sections (Business info, KYC documents, Bank details) must be reviewed before completing verification.",
    TENANT_NOT_SUBMITTED_REQUIRED_DOCS:
      "Tenant has not submitted all required details yet.",
    UPDATE_VERIFICATION_DOCS:
      "Your verification documents did not meet our compliance criteria.",
    TENANT_VERIFICATION_COMPLETED: "Tenant verification finalized successfully",
  },

  SUBSCRIPTION: {
    PURCHASED: "Subscription purchased successfully",
    EXPIRED: "Subscription has expired",
    REQUIRED: "An active subscription is required",
    ALREADY_EXISTS: "A  subscription plan already exists",
    NOT_FOUND: "Subscription plan not found",
    SUBSCRIPTION_ACTIVATED: "Subscription activated successfully",
  },

  PLAN: {
    PLAN_NOT_FOUND: "The selected plan is unavailable",
    ALREADY_ACTIVE: "This plan is already active for your tenant",
    INVALID_PRICE: "The selected plan has an invalid price",
  },

  PAYMENT: {
    CHECKOUT_CREATED: "Checkout created successfully",
    ORDER_DETAILS_NOT_MATCHING:
      "Razorpay order details do not match the selected plan",
    CHECKOUT_SESSION_NOT_FOUND: "Checkout session not found",
    CHECKOUT_ORDER_MISMATCH: "Checkout order mismatch",
    CHECKOUT_SESSSION_EXPIRED: "This checkout session has expired",
    CHECKOUT_ALREADY_COMPLETED: "This checkout was already completed",
    INVALID_PAYMENT_SIGNATURE: "Invalid Razorpay payment signature",
    DETAILS_NOT_MATCHING: "Payment details do not match the checkout",
    NOT_CAPTURED:
      "Payment is not captured yet. Please wait and check your subscription again.",
  },

  FUND: {
    CREATED: "Fund created successfully",
    UPDATED: "Fund updated successfully",
    NOT_FOUND: "Fund not found",
    CLOSED: "Fund has been closed",
    DUPLICATE_NAME: "A chit fund with this name already exists",
    BLOCKED: "Chit fund blocked successfully",
    UNBLOCKED: "Chit fund unblocked successfully",
    FETCHED: "Chit funds fetched successfully",
    MULTI_DIVISION_FUND_MUST_HAVE_DIVISION:
      "Multi-division chit fund must specify a valid division count (at least 2)",
    NO_ACTIVE_SUBSCRIPTION:
      "No active subscription plan found. Please purchase a subscription plan to create funds.",
    MAX_FUNDS_EXCEEDED:
      "You have reached the maximum number of funds allowed by your subscription plan.",
    MAX_USERS_EXCEEDED:
      "Creating this fund would exceed the total member limit allowed by your subscription plan.",
  },

  COMMON: {
    SUCCESS: "Operation completed successfully",
    FAILED: "Operation failed",
    INTERNAL_SERVER_ERROR: "Something went wrong",
    LOGGED_OUT: "Logged out successfully",
    INVALID_PAGINATION: "Invalid pagination values",
  },

  FILE_UPLOAD: {
    INVALID_TYPE: "Invalid file type",
    FILE_NAME_AND_CONTENT_TYPE_ARE_REQUIRED:
      "fileName and contentType are required",
    BUSINESS_REGISTRATION_CERTIFICATE_KEY_AND_OWNER_ID_PROOF_KEY_ARE_REQUIRED:
      "Both businessRegistrationCertificateKey and ownerIdProofKey are required.",
  },

  STORAGE: {
    UPLOAD_URL_GENERATED: "Upload URL generated successfully",
    OBJECT_KEY_REQUIRED: "objectKey is required",
  },
} as const;
