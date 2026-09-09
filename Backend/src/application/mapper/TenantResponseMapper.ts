import { Tenant } from "../../domain/entities/Tenant";
import { LoginTenantResponseDto } from "../auth/dto/LoginTenantDto";
import { TenantDto } from "../auth/dto/RegisterTenantDto";
import { UpdateBankDetailsResponseDto } from "../tenant/dto/UpdateBankDetailsResponseDto";
import { UpdateBusinessInfoResponseDto } from "../tenant/dto/UpdateBusinessInfoResponseDto";
import { UploadKycDocumentsResponseDto } from "../tenant/dto/UploadKycDocumentsResponseDto";
import { TenantProfileResponseDto } from "../tenant/dto/TenantProfileResponseDto";

export class TenantResponseMapper {
    static toLoginTenant(tenant: Tenant): LoginTenantResponseDto["tenant"] {
        return {
            id: tenant.id,
            companyName: tenant.companyName,
            ownerName: tenant.ownerName,
            email: tenant.email,
            status: tenant.status,
            onboardingStep: tenant.onboardingStep
        }
    }

    static toDto(tenant: Tenant): TenantDto {
        return {
            id: tenant.id,
            companyName: tenant.companyName,
            ownerName: tenant.ownerName,
            email: tenant.email,
            phone: tenant.phone,
            isActive: tenant.isActive,
            isEmailVerified: tenant.isEmailVerified,
            status: tenant.status,
            onboardingStep: tenant.onboardingStep,

        }
    }

    static toUpdateBankDetailsResponse (tenant: Tenant): UpdateBankDetailsResponseDto['tenant'] {
        return {
            id: tenant.id,
            onboardingStep: tenant.onboardingStep,
            bankDetails: tenant.bankDetails
        }
    }

    static toUpdateBusinessInfoResponse (tenant: Tenant): UpdateBusinessInfoResponseDto['tenant'] {
        return {
            id: tenant.id,
            onboardingStep: tenant.onboardingStep,
            businessInfo: tenant.businessInfo
        }
    }

    static toUpdateKycDocumentResponseDto(
        tenant: Tenant
    ): UploadKycDocumentsResponseDto["tenant"] {
        return {
            id: tenant.id,
            onboardingStep: tenant.onboardingStep,
            kycDocuments: {
                businessRegistrationCertificate: {
                    objectKey: tenant.kycDocuments!.businessRegistrationCertificate.objectKey,
                    verification: {
                        status: tenant.kycDocuments!.businessRegistrationCertificate.verification.status,
                    },
                },
                ownerIdProof: {
                    objectKey: tenant.kycDocuments!.businessRegistrationCertificate.objectKey,
                    verification: {
                        status: tenant.kycDocuments!.ownerIdProof.verification.status,
                    },
                },
            },
        };
    }

 static toProfileDto(tenant: Tenant): TenantProfileResponseDto {
        return {
            id: tenant.id,
            companyName: tenant.companyName,
            ownerName: tenant.ownerName,
            email: tenant.email,
            phone: tenant.phone,
            status: tenant.status,
            onboardingStep: tenant.onboardingStep,
            rejectionReason: tenant.rejectionReason,
            businessInfo: tenant.businessInfo
                ? {
                    businessType: tenant.businessInfo.businessType,
                    registrationId: tenant.businessInfo.registrationId,
                    registeredBusinessAddress: tenant.businessInfo.registeredBusinessAddress,
                    verification: {
                        status: tenant.businessInfo.verification?.status,
                        rejectionReason: tenant.businessInfo.verification?.rejectionReason,
                        verifiedAt: tenant.businessInfo.verification?.verifiedAt?.toISOString(),
                    },
                }
                : undefined,
            kycDocuments: tenant.kycDocuments
                ? {
                    businessRegistrationCertificate: tenant.kycDocuments.businessRegistrationCertificate
                        ? {
                            objectKey: tenant.kycDocuments.businessRegistrationCertificate.objectKey,
                            verification: {
                                status: tenant.kycDocuments.businessRegistrationCertificate.verification?.status,
                                rejectionReason: tenant.kycDocuments.businessRegistrationCertificate.verification?.rejectionReason,
                                verifiedAt: tenant.kycDocuments.businessRegistrationCertificate.verification?.verifiedAt?.toISOString(),
                            },
                        }
                        : undefined,
                    ownerIdProof: tenant.kycDocuments.ownerIdProof
                        ? {
                            objectKey: tenant.kycDocuments.ownerIdProof.objectKey,
                            verification: {
                                status: tenant.kycDocuments.ownerIdProof.verification?.status,
                                rejectionReason: tenant.kycDocuments.ownerIdProof.verification?.rejectionReason,
                                verifiedAt: tenant.kycDocuments.ownerIdProof.verification?.verifiedAt?.toISOString(),
                            },
                        }
                        : undefined,
                }
                : undefined,
            bankDetails: tenant.bankDetails
                ? {
                    accountHolderName: tenant.bankDetails.accountHolderName,
                    accountNumber: tenant.bankDetails.accountNumber,
                    ifscCode: tenant.bankDetails.ifscCode,
                    verification: {
                        status: tenant.bankDetails.verification?.status,
                        rejectionReason: tenant.bankDetails.verification?.rejectionReason,
                        verifiedAt: tenant.bankDetails.verification?.verifiedAt?.toISOString(),
                    },
                }
                : undefined,
        };
    }
}