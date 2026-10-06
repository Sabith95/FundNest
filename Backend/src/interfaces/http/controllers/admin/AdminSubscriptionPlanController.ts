import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { ICreateSubscriptionPlanUseCase } from "../../../../application/interface/admin/subscription/ICreateSubsctiptionPlanUseCase";
import { IGetSubscriptionPlansUseCase } from "../../../../application/interface/admin/subscription/IGetSubscriptionPlansUseCase";
import { IUpdateSubscriptionPlanUseCase } from "../../../../application/interface/admin/subscription/IUpdateSubscriptionPlanUseCase";
import { IUpdateSubscriptionPlanStatusUseCase } from "../../../../application/interface/admin/subscription/IUpdateSubscriptionPlanStatusUseCase";
import { IDeleteSubscriptionPlanUseCase } from "../../../../application/interface/admin/subscription/IDeleteSubscriptionPlanUseCase";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { TOKENS } from "../../../../shared/tokens";
import {
  createSubscriptionPlanSchema,
  updateSubscriptionPlanSchema,
  updateSubscriptionPlanStatusSchema,
} from "../../../../interfaces/http/validators/admin/subscriptionPlanValidatior";
import { MESSAGES } from "../../../../shared/constants/messages";

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

    @inject(TOKENS.DeleteSubscriptionPlanUseCase)
    private readonly _deleteSubscriptionPlanUseCase: IDeleteSubscriptionPlanUseCase,
  ) {}

  getAll = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const plans = await this._getSubscriptionPlansUseCase.execute();

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.PLAN.PLAN_FETCHED,
        {
          plans,
        },
      );
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
        MESSAGES.PLAN.PLAN_CREATED,
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
        MESSAGES.PLAN.PLAN_UPDATED,
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
          ? MESSAGES.PLAN.PLAN_BLOCKED
          : MESSAGES.PLAN.PLAN_UNBLOCKED,
        { plan },
      );
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const plan = await this._deleteSubscriptionPlanUseCase.execute(
        String(req.params.id),
      );
      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.PLAN.PLAN_DELETED,
        { plan },
      );
    } catch (error) {
      next(error);
    }
  };
}
