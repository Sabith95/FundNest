import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";

export interface UploadKycDocumentsResponseDto {
    tenant: {
        id: string;
        onboardingStep: OnboardingStep
        kycDocuments: {
            businessRegistrationCertificate: {
                url: string;
                publicId: string;
                verification: {
                    status: VerificationStatus;
                };
            };
            ownerIdProof: {
                url: string;
                publicId: string;
                verification: {
                    status: VerificationStatus;
                };
            };
        };
    };
}