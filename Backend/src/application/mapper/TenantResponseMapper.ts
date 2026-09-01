import { Tenant } from "../../domain/entities/Tenant";
import { LoginTenantResponseDto } from "../auth/dto/LoginTenantDto";
import { RegisterTenantResponseDto, TenantDto } from "../auth/dto/RegisterTenantDto";
import { UpdateBankDetailsResponseDto } from "../tenant/dto/UpdateBankDetailsResponseDto";
import { UpdateBusinessInfoResponseDto } from "../tenant/dto/UpdateBusinessInfoResponseDto";
import { UploadKycDocumentsResponseDto } from "../tenant/dto/UploadKycDocumentsResponseDto";

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
}