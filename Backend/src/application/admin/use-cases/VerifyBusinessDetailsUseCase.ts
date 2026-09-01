import { inject, injectable } from "tsyringe";
import { IVerifyBusinessDetailsUseCase } from "../../interface/admin/IVerifyBusinessDetailsUseCase";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { Tenant } from "../../../domain/entities/Tenant";
import { VerifyBusinessDetailsDto } from "../dto/AdminVerificationDto";
import { TOKENS } from "../../../shared/tokens";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { BadRequestError } from "../../../shared/errors/BadRequestError";
import { MESSAGES } from "../../../shared/constants/messages";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";
import { syncOverallTenantStatus } from "../services/syncOverallTenantStatus";

@injectable()
export class VerifyBusinessDetailsUseCase implements IVerifyBusinessDetailsUseCase {
  constructor(
    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository
  ) {}

  async execute(tenantId: string, dto: VerifyBusinessDetailsDto): Promise<Tenant> {
    const tenant = await this._tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    if (!tenant.businessInfo) {
      throw new BadRequestError("Tenant has not submitted business info yet.");
    }

    if (dto.status === VerificationStatus.REJECTED && !dto.rejectionReason) {
      throw new BadRequestError("Rejection reason is required when rejecting business info.");
    }

    const updatedTenant = await this._tenantRepository.verifyBusinessDetails(tenantId, {
      status: dto.status,
      rejectionReason: dto.rejectionReason,
      verifiedAt: new Date(),
    });

    if (!updatedTenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    return await syncOverallTenantStatus(updatedTenant, this._tenantRepository);
  }
}