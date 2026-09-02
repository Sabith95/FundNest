


// import { inject, injectable } from "tsyringe";
// import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
// import { UploadKycDocumentsDto } from "../dto/UploadKycDocumentsDto";
// import { TOKENS } from "../../../shared/tokens";
// import { MESSAGES } from "../../../shared/constants/messages";
// import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
// import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";
// import { IUploadKycDocumentsUseCase } from "../../interface/tenant/IUploadKycDocumentsUseCase";
// import { NotFoundError } from "../../../shared/errors/NotFoundError";
// import { ForbiddenError } from "../../../shared/errors/ForbiddenError";
// import { UploadKycDocumentsResponseDto } from "../dto/UploadKycDocumentsResponseDto";
// import { TenantResponseMapper } from "../../mapper/TenantResponseMapper";

// @injectable()
// export class UploadKycDocumentsUseCase
//     implements IUploadKycDocumentsUseCase {

//     constructor(
//         @inject(TOKENS.TenantRepository)
//         private readonly _tenantRepository: ITenantRepository
//     ) {}

//     async execute(
//         tenantId: string,
//         input: UploadKycDocumentsDto
//     ): Promise<UploadKycDocumentsResponseDto> {

//         const tenant = await this._tenantRepository.findById(tenantId);

//         if (!tenant) {
//             throw new NotFoundError(
//                 MESSAGES.TENANT.NOT_FOUND
//             );
//         }

//         if (!tenant.isEmailVerified) {
//             throw new ForbiddenError(
//                 MESSAGES.TENANT.REGISTER_WITH_EMAIL
//             );
//         }

//         if (
//             tenant.onboardingStep !==
//             OnboardingStep.BUSINESS_INFO_COMPLETED
//         ) {
//             throw new ForbiddenError(
//                 MESSAGES.TENANT.COMPLETE_BUSINESS_INFO
//             );
//         }

//         const updatedTenant =
//             await this._tenantRepository.updateKycDocuments(
//                 tenantId,
//                 {
//                     businessRegistrationCertificate: {
//                         objectKey: input.businessRegistrationCertificateKey,
//                         verification: {
//                             status: VerificationStatus.PENDING,
//                         },
//                     },

//                     ownerIdProof: {
//                         objectKey: input.ownerIdProofKey,
//                         verification: {
//                             status: VerificationStatus.PENDING,
//                         },
//                     },
//                 },
//                 OnboardingStep.KYC_COMPLETED
//             );

//         if (!updatedTenant) {
//             throw new NotFoundError(
//                 MESSAGES.TENANT.NOT_FOUND
//             );
//         }

//         return {
//             tenant:
//                 TenantResponseMapper.toUpdateKycDocumentResponseDto(
//                     updatedTenant
//                 ),
//         };
//     }
// }


import { inject, injectable } from "tsyringe";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { UploadKycDocumentsDto } from "../dto/UploadKycDocumentsDto";
import { TOKENS } from "../../../shared/tokens";
import { MESSAGES } from "../../../shared/constants/messages";
import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { TenantStatus } from "../../../shared/constants/enums/TenantStatus";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";
import { IUploadKycDocumentsUseCase } from "../../interface/tenant/IUploadKycDocumentsUseCase";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";
import { UploadKycDocumentsResponseDto } from "../dto/UploadKycDocumentsResponseDto";
import { TenantResponseMapper } from "../../mapper/TenantResponseMapper";
import { syncOverallTenantStatus } from "../../admin/services/syncOverallTenantStatus";

@injectable()
export class UploadKycDocumentsUseCase implements IUploadKycDocumentsUseCase {
    constructor(
        @inject(TOKENS.TenantRepository)
        private readonly _tenantRepository: ITenantRepository
    ) {}

    async execute(
        tenantId: string,
        input: UploadKycDocumentsDto
    ): Promise<UploadKycDocumentsResponseDto> {
        const tenant = await this._tenantRepository.findById(tenantId);

        if (!tenant) {
            throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
        }

        if (!tenant.isEmailVerified) {
            throw new ForbiddenError(MESSAGES.TENANT.REGISTER_WITH_EMAIL);
        }

        // Allow execution if tenant is doing initial onboarding OR re-uploading after rejection
        const isReupload = tenant.status === TenantStatus.REJECTED;
        const isValidStep = tenant.onboardingStep === OnboardingStep.BUSINESS_INFO_COMPLETED;

        if (!isValidStep && !isReupload) {
            throw new ForbiddenError(MESSAGES.TENANT.COMPLETE_BUSINESS_INFO);
        }

        const nextStep = isReupload ? tenant.onboardingStep : OnboardingStep.KYC_COMPLETED;

        const updatedTenant = await this._tenantRepository.updateKycDocuments(
            tenantId,
            {
                businessRegistrationCertificate: {
                    objectKey: input.businessRegistrationCertificateKey,
                    verification: {
                        status: VerificationStatus.PENDING,
                    },
                },
                ownerIdProof: {
                    objectKey: input.ownerIdProofKey,
                    verification: {
                        status: VerificationStatus.PENDING,
                    },
                },
            },
            nextStep
        );

        if (!updatedTenant) {
            throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
        }

        // Sync status: updates overall tenant status back to UNDER_REVIEW
        const finalTenant = await syncOverallTenantStatus(updatedTenant, this._tenantRepository);

        return {
            tenant: TenantResponseMapper.toUpdateKycDocumentResponseDto(finalTenant),
        };
    }
}