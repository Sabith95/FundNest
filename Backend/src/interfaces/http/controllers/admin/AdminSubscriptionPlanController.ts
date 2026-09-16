import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { ICreateSubscriptionPlanUseCase } from "../../../../application/interface/admin/subscription/ICreateSubsctiptionPlanUseCase";
import { IGetSubscriptionPlansUseCase } from "../../../../application/interface/admin/subscription/IGetSubscriptionPlansUseCase";
import { IUpdateSubscriptionPlanUseCase } from "../../../../application/interface/admin/subscription/IUpdateSubscriptionPlanUseCase";
import { IUpdateSubscriptionPlanStatusUseCase } from "../../../../application/interface/admin/subscription/IUpdateSubscriptionPlanStatusUseCase";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { TOKENS } from "../../../../shared/tokens";
import {
  createSubscriptionPlanSchema,
  updateSubscriptionPlanSchema,
  updateSubscriptionPlanStatusSchema,
} from "../../../../interfaces/http/validators/admin/subscriptionPlanValidatior";

@injectable()
export class AdminSubscriptionPlanController {
  constructor(
    @inject(TOKENS.CreateSubscriptionPlanUseCase)
    private readonly _createSubscriptionPlanUseCase: ICreateSubscriptionPlanUseCase,

    @inject(TOKENS.GetSubscriptionPlansUseCase)
    private readonly _getSubscriptionPlansUseCase: IGetSubscriptionPlansUseCase,

    @inject(TOKENS.UpdateSubscriptionPlanUseCase)
    private readonly _updateSubscriptionPlanUseCase: IUpdateSubscriptionPlanUseCase,

    @inject(TOKENS.UpdateSubscriptionPlanStatusUseCase)
    private readonly _updateSubscriptionPlanStatusUseCase: IUpdateSubscriptionPlanStatusUseCase,
  ) {}

  getAll = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const plans = await this._getSubscriptionPlansUseCase.execute();

      ResponseHandler.success(res, HTTP_STATUS.OK, "Plans fetched successfully", {
        plans,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const payload = createSubscriptionPlanSchema.parse(req.body);

      const plan = await this._createSubscriptionPlanUseCase.execute(payload);

      ResponseHandler.success(
        res,
        HTTP_STATUS.CREATED,
        "Subscription plan created successfully",
        { plan },
      );
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const payload = updateSubscriptionPlanSchema.parse(req.body);

      const plan = await this._updateSubscriptionPlanUseCase.execute(
        String(req.params.id),
        payload,
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        "Subscription plan updated successfully",
        { plan },
      );
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const payload = updateSubscriptionPlanStatusSchema.parse(req.body);

      const plan = await this._updateSubscriptionPlanStatusUseCase.execute(
        String(req.params.id),
        payload.isActive,
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        plan.isActive
          ? "Subscription plan unblocked successfully"
          : "Subscription plan blocked successfully",
        { plan },
      );
    } catch (error) {
      next(error);
    }
  };
}