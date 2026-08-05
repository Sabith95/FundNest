import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";

import { IUploadKycDocumentsUseCase } from "../../../../application/interface/tenant/IUploadKycDocumentsUseCase";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { MESSAGES } from "../../../../shared/constants/messages";
import { TOKENS } from "../../../../shared/tokens";
import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";


@injectable()
export class TenantKycController {
    constructor(
        @inject(TOKENS.UploadKycDocumentsUseCase)
        private readonly _uploadKycDocumentsUseCase: IUploadKycDocumentsUseCase
    ) {}

    uploadKycDocuments = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const tenantId = req.tenantId || (req.user as any)?.id;
            if (!tenantId) {
                throw new UnauthorizedError(
                    MESSAGES.TENANT.NOT_AUTHENTICATED
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
                throw new BadRequestError(
                    MESSAGES.TENANT.KYC_DOCUMENTS_REQUIRED
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

            ResponseHandler.success(
                res,
                HTTP_STATUS.OK,
                MESSAGES.TENANT.KYC_UPLOADED_SUCCESSFULLY,
                result
            )
        } catch (error) {
            next(error);
        }
    };
}