import { injectable, inject } from "tsyringe";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { UpdateBusinessInfoDto } from "../dto/UpdateBusinessInfoDto";
import { TOKENS } from "../../../shared/tokens";
import { MESSAGES } from "../../../shared/constants/messages";
import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { TenantStatus } from "../../../shared/constants/enums/TenantStatus";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";
import { IUpdateBusinessInfoUseCase } from "../../interface/tenant/IUpdateBusinessInfoUseCase";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";
import { TenantResponseMapper } from "../../mapper/TenantResponseMapper";
import { UpdateBusinessInfoResponseDto } from "../dto/UpdateBusinessInfoResponseDto";
import { syncOverallTenantStatus } from "../../admin/services/syncOverallTenantStatus";

@injectable()
export class UpdateBusinessInfoUseCase implements IUpdateBusinessInfoUseCase {
  constructor(
    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(
    tenantId: string,
    input: UpdateBusinessInfoDto,
  ): Promise<UpdateBusinessInfoResponseDto> {
    const tenant = await this._tenantRepository.findById(tenantId);

    if (!tenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    if (!tenant.isEmailVerified) {
      throw new ForbiddenError(MESSAGES.TENANT.REGISTER_WITH_EMAIL);
    }

    // Allow execution if tenant is doing initial onboarding OR re-submitting after rejection
    const isReupload = tenant.status === TenantStatus.REJECTED;
    const isValidStep =
      tenant.onboardingStep === OnboardingStep.REGISTERED ||
      tenant.onboardingStep === OnboardingStep.OTP_VERIFIED;

    if (!isValidStep && !isReupload) {
      throw new ForbiddenError(
        "Business info update is not allowed at this step.",
      );
    }

    const nextStep = isReupload
      ? tenant.onboardingStep
      : OnboardingStep.BUSINESS_INFO_COMPLETED;

    const updatedTenant = await this._tenantRepository.updateBusinessInfo(
      tenantId,
      {
        businessType: input.businessType,
        registrationId: input.registrationId,
        registeredBusinessAddress: input.registeredBusinessAddress,
        verification: {
          status: VerificationStatus.PENDING,
        },
      },
      nextStep,
    );

    if (!updatedTenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    // Reset overall tenant status to UNDER_REVIEW if resubmitting rejected info
    const finalTenant = await syncOverallTenantStatus(
      updatedTenant,
      this._tenantRepository,
    );

    return {
      tenant: TenantResponseMapper.toUpdateBusinessInfoResponse(finalTenant),
    };
  }
}
