import { inject, injectable } from "tsyringe";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { UpdateBankDetailsDto } from "../dto/UpdateBankDetailsDto";
import { Tenant } from "../../../domain/entities/Tenant";
import { TOKENS } from "../../../shared/tokens";
import { AppError } from "../../../shared/errors/AppError";
import { MESSAGES } from "../../../shared/constants/messages";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";

@injectable()
export class UpdateBankDetailsUseCase {
    constructor(
        @inject(TOKENS.TenantRepository)
        private readonly _tenantRepository: ITenantRepository
    ) {}

    async execute(
        tenantId: string,
        input: UpdateBankDetailsDto
    ): Promise<Tenant> {

        const tenant = await this._tenantRepository.findById(tenantId);

        if (!tenant) {
            throw new AppError(
                MESSAGES.TENANT.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            );
        }

        if (!tenant.isEmailVerified) {
            throw new AppError(
                MESSAGES.TENANT.REGISTER_WITH_EMAIL,
                HTTP_STATUS.FORBIDDEN
            );
        }

        if (
            tenant.onboardingStep !== OnboardingStep.KYC_COMPLETED
        ) {
            throw new AppError(
                "Complete KYC before adding bank details.",
                HTTP_STATUS.FORBIDDEN
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
            throw new AppError(
                MESSAGES.TENANT.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            );
        }

        return updatedTenant;
    }
}