import { inject, injectable } from "tsyringe";
import { IVerifyKycDocumentsUseCase } from "../../interface/admin/IVerifyKycDocumentsUseCase";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { Tenant } from "../../../domain/entities/Tenant";
import { VerifyKycDocumentsDto } from "../dto/AdminVerificationDto";
import { TOKENS } from "../../../shared/tokens";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { BadRequestError } from "../../../shared/errors/BadRequestError";
import { MESSAGES } from "../../../shared/constants/messages";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";
import { syncOverallTenantStatus } from "../services/syncOverallTenantStatus";

@injectable()
export class VerifyKycDocumentsUseCase implements IVerifyKycDocumentsUseCase {
  constructor(
    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository
  ) {}

  async execute(tenantId: string, dto: VerifyKycDocumentsDto): Promise<Tenant> {
    const tenant = await this._tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    if (!tenant.kycDocuments) {
      throw new BadRequestError("Tenant has not submitted KYC documents yet.");
    }

    if (
      (dto.businessRegistrationStatus === VerificationStatus.REJECTED && !dto.businessRegistrationRejectionReason) ||
      (dto.ownerIdProofStatus === VerificationStatus.REJECTED && !dto.ownerIdProofRejectionReason)
    ) {
      throw new BadRequestError("Rejection reason is required for rejected KYC documents.");
    }

    const updatedTenant = await this._tenantRepository.verifyKycDocuments(tenantId, {
      businessRegistrationCertificateVerification: {
        status: dto.businessRegistrationStatus,
        rejectionReason: dto.businessRegistrationRejectionReason,
        verifiedAt: new Date(),
      },
      ownerIdProofVerification: {
        status: dto.ownerIdProofStatus,
        rejectionReason: dto.ownerIdProofRejectionReason,
        verifiedAt: new Date(),
      },
    });

    if (!updatedTenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    return await syncOverallTenantStatus(updatedTenant, this._tenantRepository);
  }
}