import { Types } from "mongoose";
import { Tenant } from "../../../domain/entities/Tenant";
import { TenantDocument } from "../models/TenantModel";
import { TenantStatus } from "../../../shared/constants/enums/TenantStatus";
import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";

export type TenantRecord = TenantDocument & {
  _id: Types.ObjectId;
};

export class TenantPersistenceMapper {
  static toEntity(tenant: TenantRecord): Tenant {
    return {
      id: tenant._id.toString(),

      companyName: tenant.companyName,
      ownerName: tenant.ownerName,

      email: tenant.email,
      phone: tenant.phone,
      password: tenant.password,

      role: tenant.role,

      isEmailVerified: tenant.isEmailVerified,
      isActive: tenant.isActive,

      status: tenant.status as TenantStatus,
      onboardingStep: tenant.onboardingStep as OnboardingStep,

      businessInfo: tenant.businessInfo
        ? {
            businessType: tenant.businessInfo.businessType,
            registrationId: tenant.businessInfo.registrationId,
            registeredBusinessAddress:
              tenant.businessInfo.registeredBusinessAddress,
            verification: {
              status:
                tenant.businessInfo.verification.status as VerificationStatus,
              rejectionReason:
                tenant.businessInfo.verification.rejectionReason,
              verifiedAt: tenant.businessInfo.verification.verifiedAt,
            },
          }
        : undefined,

      kycDocuments: tenant.kycDocuments
        ? {
            businessRegistrationCertificate: {
              objectKey: tenant.kycDocuments.businessRegistrationCertificate.objectKey,
              verification: {
                status:
                  tenant.kycDocuments.businessRegistrationCertificate
                    .verification.status as VerificationStatus,
                rejectionReason:
                  tenant.kycDocuments.businessRegistrationCertificate
                    .verification.rejectionReason,
                verifiedAt:
                  tenant.kycDocuments.businessRegistrationCertificate
                    .verification.verifiedAt,
              },
            },

            ownerIdProof: {
              objectKey: tenant.kycDocuments.businessRegistrationCertificate.objectKey,
              verification: {
                status:
                  tenant.kycDocuments.ownerIdProof.verification
                    .status as VerificationStatus,
                rejectionReason:
                  tenant.kycDocuments.ownerIdProof.verification
                    .rejectionReason,
                verifiedAt:
                  tenant.kycDocuments.ownerIdProof.verification
                    .verifiedAt,
              },
            },
          }
        : undefined,

      bankDetails: tenant.bankDetails
        ? {
            accountHolderName: tenant.bankDetails.accountHolderName,
            accountNumber: tenant.bankDetails.accountNumber,
            ifscCode: tenant.bankDetails.ifscCode,
            verification: {
              status:
                tenant.bankDetails.verification.status as VerificationStatus,
              rejectionReason:
                tenant.bankDetails.verification.rejectionReason,
              verifiedAt: tenant.bankDetails.verification.verifiedAt,
            },
          }
        : undefined,

      rejectionReason: tenant.rejectionReason,
      approvedAt: tenant.approvedAt,

      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    };
  }
}