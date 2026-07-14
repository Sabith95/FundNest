import { injectable, inject } from "tsyringe";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { UpdateBusinessInfoDto } from "../dto/UpdateBusinessInfoDto";
import { Tenant } from "../../../domain/entities/Tenant";
import { TOKENS } from "../../../shared/tokens";
import { AppError } from "../../../shared/errors/AppError";
import { MESSAGES } from "../../../shared/constants/messages";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";

@injectable()
export class UpdateBusinessInfoUseCase {
    constructor(
        @inject(TOKENS.TenantRepository)
        private readonly _tenantRepository: ITenantRepository

    ) { }

    async execute(tenantId: string, input: UpdateBusinessInfoDto): Promise<Tenant> {
        const tenant = await this._tenantRepository.findById(tenantId)

        if (!tenant) {
            throw new AppError(MESSAGES.TENANT.NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        }

        if(!tenant.isEmailVerified){
            throw new AppError(MESSAGES.TENANT.REGISTER_WITH_EMAIL,HTTP_STATUS.FORBIDDEN)
        }

        const updatedTenant = await this._tenantRepository.updateBusinessInfo(
            tenantId,
            {
                businessType: input.businessType,
                registrationId: input.registrationId,
                registeredBusinessAddress: input.registeredBusinessAddress,
            },
            OnboardingStep.BUSINESS_INFO_COMPLETED
        )

        if (!updatedTenant) {
            throw new AppError(MESSAGES.TENANT.NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        }

        return updatedTenant
    }
}