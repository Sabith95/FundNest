import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";

export interface UploadKycDocumentsResponseDto {
  tenant: {
    id: string;
    onboardingStep: OnboardingStep;
    kycDocuments: {
      businessRegistrationCertificate: {
        objectKey: string;
        verification: {
          status: VerificationStatus;
        };
      };
      ownerIdProof: {
        objectKey: string;
        verification: {
          status: VerificationStatus;
        };
      };
    };
  };
}
