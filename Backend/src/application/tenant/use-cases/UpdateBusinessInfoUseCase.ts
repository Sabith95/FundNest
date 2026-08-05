import { injectable, inject } from "tsyringe";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { UpdateBusinessInfoDto } from "../dto/UpdateBusinessInfoDto";
import { Tenant } from "../../../domain/entities/Tenant";
import { TOKENS } from "../../../shared/tokens";
import { MESSAGES } from "../../../shared/constants/messages";
import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { IUpdateBusinessInfoUseCase } from "../../interface/tenant/IUpdateBusinessInfoUseCase";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";

@injectable()
export class UpdateBusinessInfoUseCase implements IUpdateBusinessInfoUseCase {
    constructor(
        @inject(TOKENS.TenantRepository)
        private readonly _tenantRepository: ITenantRepository

    ) { }

    async execute(tenantId: string, input: UpdateBusinessInfoDto): Promise<Tenant> {
        const tenant = await this._tenantRepository.findById(tenantId)

        if (!tenant) {
            throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND)
        }

        if(!tenant.isEmailVerified){
            throw new ForbiddenError(MESSAGES.TENANT.REGISTER_WITH_EMAIL)
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
            throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND)
        }

        return updatedTenant
    }
}