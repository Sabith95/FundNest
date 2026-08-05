import { injectable, inject } from "tsyringe";
import { MESSAGES } from "../../../../shared/constants/messages";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { TOKENS } from "../../../../shared/tokens";
import { NextFunction, Request, Response } from "express";
import { updateBankDetailsSchema } from "../../validators/tenant/updateBankDetailsSchema";
import { IUpdateBankDetailsUseCase } from "../../../../application/interface/tenant/IUpdateBankDetailsUseCase";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";

@injectable()
export class TenantBankDetailsController {
    constructor (
        @inject(TOKENS.UpdateBankDetailsUseCase)
        private readonly _updateBankDetailsUseCase: IUpdateBankDetailsUseCase
    ){ }

    updateBankingDetails = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            const tenantId = req.tenantId || (req.user as any)?.id;
            if (!tenantId) {
                throw new UnauthorizedError(MESSAGES.TENANT.NOT_FOUND);
            }

            const payload = updateBankDetailsSchema.parse(req.body)
            const result = await this._updateBankDetailsUseCase.execute(tenantId,payload)

            ResponseHandler.success(
                res,
                HTTP_STATUS.OK,
                MESSAGES.TENANT.BANKING_DETAILS_UPDATED,
                result
            )
        } catch (error) {
            next(error)
        }
    }
}