import { inject, injectable } from "tsyringe";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { IImageStorageService } from "../../../infrastructure/storage/interfaces/IImageStorageService";
import { UploadKycDocumentsDto } from "../dto/UploadKycDocumentsDto";
import { Tenant } from "../../../domain/entities/Tenant";
import { TOKENS } from "../../../shared/tokens";
import { AppError } from "../../../shared/errors/AppError";
import { MESSAGES } from "../../../shared/constants/messages";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";

@injectable()
export class UploadKycDocumentsUseCase {
    constructor(
        @inject(TOKENS.TenantRepository)
        private readonly _tenantRepository: ITenantRepository,

        @inject(TOKENS.ImageStorageService)
        private readonly _imageStorageService: IImageStorageService
    ) {}

    async execute(
        tenantId: string,
        input: UploadKycDocumentsDto
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
            tenant.onboardingStep !==
            OnboardingStep.BUSINESS_INFO_COMPLETED
        ) {
            throw new AppError(
                "Complete business information before uploading KYC documents.",
                HTTP_STATUS.FORBIDDEN
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
            throw new AppError(
                MESSAGES.TENANT.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            );
        }

        return updatedTenant;
    }
}