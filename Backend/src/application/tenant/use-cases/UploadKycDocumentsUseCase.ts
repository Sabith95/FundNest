import { inject, injectable } from "tsyringe";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { IImageStorageService } from "../../../infrastructure/storage/interfaces/IImageStorageService";
import { UploadKycDocumentsDto } from "../dto/UploadKycDocumentsDto";
import { Tenant } from "../../../domain/entities/Tenant";
import { TOKENS } from "../../../shared/tokens";
import { MESSAGES } from "../../../shared/constants/messages";
import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";
import { IUploadKycDocumentsUseCase } from "../../interface/tenant/IUploadKycDocumentsUseCase";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";
import { UploadKycDocumentsResponseDto } from "../dto/UploadKycDocumentsResponseDto";
import { TenantResponseMapper } from "../../mapper/TenantResponseMapper";

@injectable()
export class UploadKycDocumentsUseCase implements IUploadKycDocumentsUseCase {
    constructor(
        @inject(TOKENS.TenantRepository)
        private readonly _tenantRepository: ITenantRepository,

        @inject(TOKENS.ImageStorageService)
        private readonly _imageStorageService: IImageStorageService
    ) {}

    async execute(
        tenantId: string,
        input: UploadKycDocumentsDto
    ): Promise<UploadKycDocumentsResponseDto> {

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
            tenant.onboardingStep !==
            OnboardingStep.BUSINESS_INFO_COMPLETED
        ) {
            throw new ForbiddenError(
                MESSAGES.TENANT.COMPLETE_BUSINESS_INFO
            );
        }

        const businessCertificate =
            await this._imageStorageService.uploadImage({
                buffer: input.businessRegistrationCertificate.buffer,
                filename: input.businessRegistrationCertificate.originalName,
                folder: "tenants/business-registration-certificates",
            });

        const ownerIdProof =
            await this._imageStorageService.uploadImage({
                buffer: input.ownerIdProof.buffer,
                filename: input.ownerIdProof.originalName,
                folder: "tenants/owner-id-proofs",
            });

        const updatedTenant =
            await this._tenantRepository.updateKycDocuments(
                tenantId,
                {
                    businessRegistrationCertificate: {
                        url: businessCertificate.url,
                        publicId: businessCertificate.publicId,
                        verification: {
                            status: VerificationStatus.PENDING
                        },
                    },
                    ownerIdProof: {
                        url: ownerIdProof.url,
                        publicId: ownerIdProof.publicId,
                        verification: {
                            status: VerificationStatus.PENDING
                        },
                    },
                },
                OnboardingStep.KYC_COMPLETED
            );

        if (!updatedTenant) {
            throw new NotFoundError(
                MESSAGES.TENANT.NOT_FOUND
            );
        }

        return {tenant: TenantResponseMapper.toUpdateKycDocumentResponseDto(updatedTenant)};
    }
}