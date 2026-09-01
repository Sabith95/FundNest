import { Tenant } from "../../domain/entities/Tenant";
import {
  AdminTenantResponseDto,
  AdminTenantDetailsResponseDto,
} from "../../application/admin/dto/AdminTenantResponseDto";
import { VerificationStatus } from "../../shared/constants/enums/VerificationStatus";

export class AdminTenantResponseDtoMapper {
  static toDto(tenant: Tenant): AdminTenantResponseDto {
    return {
      id: tenant.id,
      companyName: tenant.companyName || tenant.ownerName || "N/A",
      ownerName: tenant.ownerName || "N/A",
      email: tenant.email,
      isActive: tenant.isActive,
      verificationStatus: tenant.status || VerificationStatus.PENDING,
      createdAt: tenant.createdAt,
    };
  }

  static toDtoList(tenants: Tenant[]): AdminTenantResponseDto[] {
    return tenants.map((tenant) => this.toDto(tenant));
  }

  static toDetailsDto(tenant: Tenant): AdminTenantDetailsResponseDto {
    // Map Business KYC verification status
    const businessState: VerificationStatus =
      tenant.businessInfo?.verification?.status ?? VerificationStatus.PENDING;

    // Map Bank Verification status
    const bankState: VerificationStatus =
      tenant.bankDetails?.verification?.status ?? VerificationStatus.PENDING;

    // Map Document status based on KYC documents
    let docState: VerificationStatus = VerificationStatus.PENDING;
    if (tenant.kycDocuments) {
      const busDocStatus = tenant.kycDocuments.businessRegistrationCertificate?.verification?.status;
      const ownerDocStatus = tenant.kycDocuments.ownerIdProof?.verification?.status;
      if (
        busDocStatus === VerificationStatus.APPROVED &&
        ownerDocStatus === VerificationStatus.APPROVED
      ) {
        docState = VerificationStatus.APPROVED;
      } else if (
        busDocStatus === VerificationStatus.REJECTED ||
        ownerDocStatus === VerificationStatus.REJECTED
      ) {
        docState = VerificationStatus.REJECTED;
      }
    }

    // Format registration date
    const formattedRegDate = tenant.createdAt
      ? new Date(tenant.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";

    // Format Financials if bank details are available
    const financials =
      tenant.bankDetails && (tenant.bankDetails.accountNumber || tenant.bankDetails.accountHolderName)
        ? {
            bankName: tenant.bankDetails.ifscCode
              ? `Bank (${tenant.bankDetails.ifscCode})`
              : "Registered Bank",
            accountHolder: tenant.bankDetails.accountHolderName || tenant.ownerName || "N/A",
            accountNumberLast4: tenant.bankDetails.accountNumber
              ? tenant.bankDetails.accountNumber.slice(-4)
              : "••••",
            payoutsVerified: tenant.bankDetails.verification?.status === VerificationStatus.APPROVED,
          }
        : null;

    // Subscription is null when tenant hasn't subscribed yet
    const subscription = null;

    return {
      id: tenant.id,
      name: tenant.companyName || tenant.ownerName || "N/A",
      status: tenant.status || VerificationStatus.PENDING,
      primaryOwner: tenant.ownerName || "N/A",
      email: tenant.email,
      phone: tenant.phone || "N/A",
      registrationDate: formattedRegDate,
      verification: [
        { label: "Business KYC", state: businessState },
        { label: "Bank Verification", state: bankState },
        { label: "Document Status", state: docState },
      ],
      subscription,
      financials,
      businessInfo: tenant.businessInfo ?? null,
      kycDocuments: tenant.kycDocuments ?? null,
      bankDetails: tenant.bankDetails ?? null,
    };
  }
}