import { injectable, inject } from "tsyringe";
import { IUpdateBusinessInfoUseCase } from "../../../../application/interface/tenant/IUpdateBusinessInfoUseCase";
import { updateBusinessInfoSchema } from "../../validators/tenant/tenantBusinessInfoValidatior";
import { MESSAGES } from "../../../../shared/constants/messages";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { TOKENS } from "../../../../shared/tokens";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";

@injectable()
export class TenantBusinessInfoController {
  constructor(
    @inject(TOKENS.UpdateBusinessInfoUseCase)
    private readonly _updateBusinessInfoUseCase: IUpdateBusinessInfoUseCase,
  ) {}

  updateBusinessInfo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenantId = req.tenantId || (req.user as any)?.id;
      if (!tenantId) {
        throw new UnauthorizedError(MESSAGES.TENANT.NOT_FOUND);
      }
      const payload = updateBusinessInfoSchema.parse(req.body);
      const result = await this._updateBusinessInfoUseCase.execute(
        tenantId,
        payload,
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.TENANT.BUSINESS_INFO_UPDATED,
        result,
      );
    } catch (error) {
      next(error);
    }
  };
}
