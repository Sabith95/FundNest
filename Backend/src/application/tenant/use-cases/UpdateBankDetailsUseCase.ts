import { inject, injectable } from "tsyringe";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { UpdateBankDetailsDto } from "../dto/UpdateBankDetailsDto";
import { TOKENS } from "../../../shared/tokens";
import { MESSAGES } from "../../../shared/constants/messages";
import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";
import { IUpdateBankDetailsUseCase } from "../../interface/tenant/IUpdateBankDetailsUseCase";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";
import { TenantResponseMapper } from "../../mapper/TenantResponseMapper";
import { UpdateBankDetailsResponseDto } from "../dto/UpdateBankDetailsResponseDto";

@injectable()
export class UpdateBankDetailsUseCase implements IUpdateBankDetailsUseCase {
    constructor(
        @inject(TOKENS.TenantRepository)
        private readonly _tenantRepository: ITenantRepository
    ) {}

    async execute(
        tenantId: string,
        input: UpdateBankDetailsDto
    ): Promise<UpdateBankDetailsResponseDto> {

        const tenant = await this._tenantRepository.findById(tenantId);

        if (!tenant) {
            throw new NotFoundError(
                MESSAGES.TENANT.NOT_FOUND
            );
        }

        if (!tenant.isEmailVerified) {
            throw new ForbiddenError(
                MESSAGES.TENANT.REGISTER_WITH_EMAIL
            );
        }

        if (
            tenant.onboardingStep !== OnboardingStep.KYC_COMPLETED
        ) {
            throw new ForbiddenError(
                MESSAGES.TENANT.COMPLETE_KYC
            );
        }

        const updatedTenant =
            await this._tenantRepository.updateBankDetails(
                tenantId,
                {
                    accountHolderName: input.accountHolderName,
                    accountNumber: input.accountNumber,
                    ifscCode: input.ifscCode,
                    verification: {
                        status: VerificationStatus.PENDING,
                    },
                },
                OnboardingStep.BANK_DETAILS_COMPLETED
            );

        if (!updatedTenant) {
            throw new NotFoundError(
                MESSAGES.TENANT.NOT_FOUND
            );
        }

        return {
           tenant: TenantResponseMapper.toUpdateBankDetailsResponse(updatedTenant)
        }
    }
}