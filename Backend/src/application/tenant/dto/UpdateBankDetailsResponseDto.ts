import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep"
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus"

export interface UpdateBankDetailsResponseDto {
    tenant: {
        id: string
        onboardingStep: OnboardingStep
        bankDetails?: {
            accountHolderName: string
            accountNumber: string
            ifscCode: string
            verification:  {
                status: VerificationStatus
            }
        }
    }
}