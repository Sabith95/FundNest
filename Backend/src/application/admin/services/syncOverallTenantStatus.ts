import { Tenant } from "../../../domain/entities/Tenant";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";
import { TenantStatus } from "../../../shared/constants/enums/TenantStatus";
import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";

export async function syncOverallTenantStatus(
  tenant: Tenant,
  tenantRepository: ITenantRepository
): Promise<Tenant> {
  const busStatus = tenant.businessInfo?.verification?.status;
  const bankStatus = tenant.bankDetails?.verification?.status;
  const kycBusDocStatus = tenant.kycDocuments?.businessRegistrationCertificate?.verification?.status;
  const kycOwnerDocStatus = tenant.kycDocuments?.ownerIdProof?.verification?.status;

  const isBusinessApproved = busStatus === VerificationStatus.APPROVED;
  const isBankApproved = bankStatus === VerificationStatus.APPROVED;
  const isKycApproved = kycBusDocStatus === VerificationStatus.APPROVED && kycOwnerDocStatus === VerificationStatus.APPROVED;

  const isAnyRejected =
    busStatus === VerificationStatus.REJECTED ||
    bankStatus === VerificationStatus.REJECTED ||
    kycBusDocStatus === VerificationStatus.REJECTED ||
    kycOwnerDocStatus === VerificationStatus.REJECTED;

  if (isBusinessApproved && isBankApproved && isKycApproved) {
    const updated = await tenantRepository.updateOverallStatus(
      tenant.id,
      TenantStatus.APPROVED,
      undefined,
      new Date(),
      OnboardingStep.COMPLETED
    );
    return updated || tenant;
  } else if (isAnyRejected) {
    const rejectionReasons = [
      tenant.businessInfo?.verification?.rejectionReason,
      tenant.bankDetails?.verification?.rejectionReason,
      tenant.kycDocuments?.businessRegistrationCertificate?.verification?.rejectionReason,
      tenant.kycDocuments?.ownerIdProof?.verification?.rejectionReason,
    ].filter(Boolean).join("; ");

    const updated = await tenantRepository.updateOverallStatus(
      tenant.id,
      TenantStatus.REJECTED,
      rejectionReasons || "Verification failed."
    );
    return updated || tenant;
  } else {
    const updated = await tenantRepository.updateOverallStatus(
      tenant.id,
      TenantStatus.UNDER_REVIEW
    );
    return updated || tenant;
  }
}