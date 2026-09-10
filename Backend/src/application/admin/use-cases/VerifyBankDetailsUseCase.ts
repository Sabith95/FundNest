import { inject, injectable } from "tsyringe";
import { IVerifyBankDetailsUseCase } from "../../interface/admin/IVerifyBankDetailsUseCase";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { Tenant } from "../../../domain/entities/Tenant";
import { VerifyBankDetailsDto } from "../dto/AdminVerificationDto";
import { TOKENS } from "../../../shared/tokens";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { BadRequestError } from "../../../shared/errors/BadRequestError";
import { MESSAGES } from "../../../shared/constants/messages";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";
import { syncOverallTenantStatus } from "../services/syncOverallTenantStatus";

@injectable()
export class VerifyBankDetailsUseCase implements IVerifyBankDetailsUseCase {
  constructor(
    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(tenantId: string, dto: VerifyBankDetailsDto): Promise<Tenant> {
    const tenant = await this._tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    if (!tenant.bankDetails) {
      throw new BadRequestError("Tenant has not submitted bank details yet.");
    }

    if (dto.status === VerificationStatus.REJECTED && !dto.rejectionReason) {
      throw new BadRequestError(
        "Rejection reason is required when rejecting bank details.",
      );
    }

    const updatedTenant = await this._tenantRepository.verifyBankDetails(
      tenantId,
      {
        status: dto.status,
        rejectionReason: dto.rejectionReason,
        verifiedAt: new Date(),
      },
    );

    if (!updatedTenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    return await syncOverallTenantStatus(updatedTenant, this._tenantRepository);
  }
}
