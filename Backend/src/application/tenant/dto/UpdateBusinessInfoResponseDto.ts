import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { BusinessType } from "../../../shared/constants/enums/BusinessType";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";

export interface UpdateBusinessInfoResponseDto {
    tenant: {
        id: string;
        onboardingStep: OnboardingStep;
        businessInfo?: {
            businessType: BusinessType;
            registrationId: string;
            registeredBusinessAddress: string;
            verification: {
                status: VerificationStatus;
            };
        };
    };
}