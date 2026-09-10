import { inject, injectable } from "tsyringe";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { UpdateBankDetailsDto } from "../dto/UpdateBankDetailsDto";
import { TOKENS } from "../../../shared/tokens";
import { MESSAGES } from "../../../shared/constants/messages";
import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { TenantStatus } from "../../../shared/constants/enums/TenantStatus";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";
import { IUpdateBankDetailsUseCase } from "../../interface/tenant/IUpdateBankDetailsUseCase";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";
import { TenantResponseMapper } from "../../mapper/TenantResponseMapper";
import { UpdateBankDetailsResponseDto } from "../dto/UpdateBankDetailsResponseDto";
import { syncOverallTenantStatus } from "../../admin/services/syncOverallTenantStatus";

@injectable()
export class UpdateBankDetailsUseCase implements IUpdateBankDetailsUseCase {
  constructor(
    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(
    tenantId: string,
    input: UpdateBankDetailsDto,
  ): Promise<UpdateBankDetailsResponseDto> {
    const tenant = await this._tenantRepository.findById(tenantId);

    if (!tenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    if (!tenant.isEmailVerified) {
      throw new ForbiddenError(MESSAGES.TENANT.REGISTER_WITH_EMAIL);
    }

    // Allow execution if tenant is completing onboarding OR re-submitting bank details after rejection
    const isReupload = tenant.status === TenantStatus.REJECTED;
    const isValidStep = tenant.onboardingStep === OnboardingStep.KYC_COMPLETED;

    if (!isValidStep && !isReupload) {
      throw new ForbiddenError(MESSAGES.TENANT.COMPLETE_KYC);
    }

    const nextStep = isReupload
      ? tenant.onboardingStep
      : OnboardingStep.BANK_DETAILS_COMPLETED;

    const updatedTenant = await this._tenantRepository.updateBankDetails(
      tenantId,
      {
        accountHolderName: input.accountHolderName,
        accountNumber: input.accountNumber,
        ifscCode: input.ifscCode,
        verification: {
          status: VerificationStatus.PENDING,
        },
      },
      nextStep,
    );

    if (!updatedTenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    // Reset overall tenant status back to UNDER_REVIEW
    const finalTenant = await syncOverallTenantStatus(
      updatedTenant,
      this._tenantRepository,
    );

    return {
      tenant: TenantResponseMapper.toUpdateBankDetailsResponse(finalTenant),
    };
  }
}
