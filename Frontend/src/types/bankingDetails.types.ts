import type { OnboardingStep } from "../shared/constants";

export interface IUpdateBankDetailsRequest {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface IUpdateBankDetailsResponse {
  tenant: { id: string; onboardingStep: OnboardingStep };
}