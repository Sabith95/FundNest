import { inject, injectable } from "tsyringe";
import { ICompleteTenantVerificationUseCase } from "../../interface/admin/ICompleteTenantVerificationUseCase";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { IEmailService } from "../../../infrastructure/notification/interfaces/IEmailService";
import { Tenant } from "../../../domain/entities/Tenant";
import { TOKENS } from "../../../shared/tokens";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { BadRequestError } from "../../../shared/errors/BadRequestError";
import { MESSAGES } from "../../../shared/constants/messages";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";
import { TenantStatus } from "../../../shared/constants/enums/TenantStatus";
import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";

@injectable()
export class CompleteTenantVerificationUseCase implements ICompleteTenantVerificationUseCase {
  constructor(
    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository,
    @inject(TOKENS.EmailService)
    private readonly _emailService: IEmailService,
  ) {}

  async execute(tenantId: string): Promise<Tenant> {
    const tenant = await this._tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    // 1. Ensure tenant has submitted all required sections
    if (!tenant.businessInfo || !tenant.kycDocuments || !tenant.bankDetails) {
      throw new BadRequestError(
        MESSAGES.SUPER_ADMIN.TENANT_NOT_SUBMITTED_REQUIRED_DOCS,
      );
    }

    const busStatus = tenant.businessInfo.verification?.status;
    const bankStatus = tenant.bankDetails.verification?.status;
    const kycBusStatus =
      tenant.kycDocuments.businessRegistrationCertificate?.verification?.status;
    const kycOwnerStatus =
      tenant.kycDocuments.ownerIdProof?.verification?.status;

    // 2. Ensure all 4 items have been reviewed by Admin
    if (
      busStatus === VerificationStatus.PENDING ||
      bankStatus === VerificationStatus.PENDING ||
      kycBusStatus === VerificationStatus.PENDING ||
      kycOwnerStatus === VerificationStatus.PENDING
    ) {
      throw new BadRequestError(
        MESSAGES.SUPER_ADMIN.ALL_DOCUMENTS_MUST_BE_VERIFIED,
      );
    }

    // 3. Determine if all are approved or any rejected
    const isApproved =
      busStatus === VerificationStatus.APPROVED &&
      bankStatus === VerificationStatus.APPROVED &&
      kycBusStatus === VerificationStatus.APPROVED &&
      kycOwnerStatus === VerificationStatus.APPROVED;

    let updatedTenant: Tenant | null;

    if (isApproved) {
      updatedTenant = await this._tenantRepository.updateOverallStatus(
        tenant.id,
        TenantStatus.APPROVED,
        undefined,
        new Date(),
        OnboardingStep.COMPLETED,
      );

      // Send Approval Email
      await this._emailService.sendTenantVerificationApprovedEmail(
        tenant.email,
        tenant.companyName,
      );
    } else {
      // Consolidate rejection reasons
      const rejectionReasons = [
        tenant.businessInfo.verification?.rejectionReason,
        tenant.bankDetails.verification?.rejectionReason,
        tenant.kycDocuments.businessRegistrationCertificate?.verification
          ?.rejectionReason,
        tenant.kycDocuments.ownerIdProof?.verification?.rejectionReason,
      ]
        .filter(Boolean)
        .join("; ");

      updatedTenant = await this._tenantRepository.updateOverallStatus(
        tenant.id,
        TenantStatus.REJECTED,
        rejectionReasons || "Verification failed.",
      );

      // Send Rejection Email
      await this._emailService.sendTenantVerificationRejectedEmail(
        tenant.email,
        tenant.companyName,
        rejectionReasons || MESSAGES.SUPER_ADMIN.UPDATE_VERIFICATION_DOCS,
      );
    }

    if (!updatedTenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    return updatedTenant;
  }
}
