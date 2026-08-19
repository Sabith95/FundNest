import { ONBOARDING_STEP, ROUTES, type OnboardingStep } from "../shared/constants";

const COMPLETED_STEPS: OnboardingStep[] = [
  ONBOARDING_STEP.BANK_DETAILS_COMPLETED,
  ONBOARDING_STEP.COMPLETED,
];

export const isOnboardingComplete = (step: OnboardingStep): boolean =>
  COMPLETED_STEPS.includes(step);

export const getTenantDestination = (step: OnboardingStep): string => {
  switch (step) {
    case ONBOARDING_STEP.REGISTERED:
    case ONBOARDING_STEP.OTP_VERIFIED:
      return ROUTES.TENANT.BUSINESS_INFO;
    case ONBOARDING_STEP.BUSINESS_INFO_COMPLETED:
      return ROUTES.TENANT.KYC_UPLOAD;
    case ONBOARDING_STEP.KYC_COMPLETED:
      return ROUTES.TENANT.BANKING;
    case ONBOARDING_STEP.BANK_DETAILS_COMPLETED:
    case ONBOARDING_STEP.COMPLETED:
      return ROUTES.TENANT.DASHBOARD;
    default:
      return ROUTES.TENANT.BUSINESS_INFO;
  }
};

export const mapTenantVerificationStatus = (
  status: string
): "pending" | "active" | "rejected" => {
  if (status === "APPROVED") return "active";
  if (status === "REJECTED") return "rejected";
  return "pending";
};