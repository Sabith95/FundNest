import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";

import { UploadKycDocumentsUseCase } from "../../../../application/tenant/use-cases/UploadKycDocumentsUseCase";
import { ApiResponse } from "../../../../shared/ApiResponse";
import { AppError } from "../../../../shared/errors/AppError";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { MESSAGES } from "../../../../shared/constants/messages";
import { TOKENS } from "../../../../shared/tokens";


@injectable()
export class TenantKycController {
    constructor(
        @inject(TOKENS.UploadKycDocumentsUseCase)
        private readonly _uploadKycDocumentsUseCase: UploadKycDocumentsUseCase
    ) {}

    uploadKycDocuments = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const tenantId = req.tenantId || (req.user as any)?.id;
            if (!tenantId) {
                throw new AppError(
                    MESSAGES.TENANT.NOT_AUTHENTICATED,
                    HTTP_STATUS.UNAUTHORIZED
                );
            }

            const files = req.files as {
                businessRegistrationCertificate?: Express.Multer.File[];
                ownerIdProof?: Express.Multer.File[];
            };

            const businessCertificate =
                files?.businessRegistrationCertificate?.[0];

            const ownerIdProof =
                files?.ownerIdProof?.[0];

            if (!businessCertificate || !ownerIdProof) {
                throw new AppError(
                    MESSAGES.TENANT.KYC_DOCUMENTS_REQUIRED,
                    HTTP_STATUS.BAD_REQUEST
                );
            }

            const result = await this._uploadKycDocumentsUseCase.execute(
                tenantId,
                {
                    businessRegistrationCertificate: {
                        buffer: businessCertificate.buffer,
                        originalName: businessCertificate.originalname,
                        mimeType: businessCertificate.mimetype,
                    },
                    ownerIdProof: {
                        buffer: ownerIdProof.buffer,
                        originalName: ownerIdProof.originalname,
                        mimeType: ownerIdProof.mimetype,
                    },
                }
            );

            res
                .status(HTTP_STATUS.OK)
                .json(
                    ApiResponse.success(
                        result,
                        MESSAGES.TENANT.KYC_UPLOADED_SUCCESSFULLY
                    )
                );
        } catch (error) {
            next(error);
        }
    };
}