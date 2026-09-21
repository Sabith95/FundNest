import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IGetAvailableSubscriptionPlansUseCase } from "../../../../application/interface/tenant/IGetAvailableSubscriptionPlansUseCase";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { TOKENS } from "../../../../shared/tokens";

@injectable()
export class TenantSubscriptionPlanController {
  constructor(
    @inject(TOKENS.GetAvailableSubscriptionPlansUseCase)
    private readonly _getAvailableSubscriptionPlansUseCase: IGetAvailableSubscriptionPlansUseCase,
  ) {}

  getAvailable = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const plans = await this._getAvailableSubscriptionPlansUseCase.execute();

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        "Available subscription plans fetched successfully",
        { plans },
      );
    } catch (error) {
      next(error);
    }
  };
}
