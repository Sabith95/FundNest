import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { ICreateSubscriptionCheckoutUseCase } from "../../../../application/interface/tenant/ICreateSubscriptionCheckoutUseCase";
import { IVerifySubscriptionCheckoutUseCase } from "../../../../application/interface/tenant/IVerifySubscriptionCheckoutUseCase";
import { IGetCurrentTenantSubscriptionUseCase } from "../../../../application/interface/tenant/IGetCurrentTenantSubscriptionUseCase";
import { IHandlePaymentWebhookUseCase } from "../../../../application/interface/tenant/IHandlePaymentWebhookUseCase";
import {
  createSubscriptionCheckoutSchema,
  verifySubscriptionCheckoutSchema,
} from "../../validators/tenant/subscriptionCheckoutValidator";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { TOKENS } from "../../../../shared/tokens";
import { MESSAGES } from "../../../../shared/constants/messages";

@injectable()
export class TenantSubscriptionCheckoutController {
  constructor(
    @inject(TOKENS.CreateSubscriptionCheckoutUseCase)
    private readonly _createCheckoutUseCase: ICreateSubscriptionCheckoutUseCase,
    @inject(TOKENS.VerifySubscriptionCheckoutUseCase)
    private readonly _verifyCheckoutUseCase: IVerifySubscriptionCheckoutUseCase,
    @inject(TOKENS.GetCurrentTenantSubscriptionUseCase)
    private readonly _getCurrentSubscriptionUseCase: IGetCurrentTenantSubscriptionUseCase,
    @inject(TOKENS.HandlePaymentWebhookUseCase)
    private readonly _handleWebhookUseCase: IHandlePaymentWebhookUseCase,
  ) {}

  createCheckout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenantId = req.user?.id;
      if (!tenantId) throw new UnauthorizedError(MESSAGES.TENANT.NOT_AUTHENTICATED);

      const { planId } = createSubscriptionCheckoutSchema.parse(req.body);
      const checkout = await this._createCheckoutUseCase.execute(
        tenantId,
        planId,
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.CREATED,
        MESSAGES.PAYMENT.CHECKOUT_CREATED,
        { checkout },
      );
    } catch (error) {
      next(error);
    }
  };

  verifyCheckout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenantId = req.user?.id;
      if (!tenantId) throw new UnauthorizedError(MESSAGES.TENANT.NOT_AUTHENTICATED);

      const subscription = await this._verifyCheckoutUseCase.execute(
        tenantId,
        verifySubscriptionCheckoutSchema.parse(req.body),
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.SUBSCRIPTION.SUBSCRIPTION_ACTIVATED,
        { subscription },
      );
    } catch (error) {
      next(error);
    }
  };

  getCurrent = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenantId = req.user?.id;
      if (!tenantId) throw new UnauthorizedError(MESSAGES.TENANT.NOT_AUTHENTICATED);

      const subscription =
        await this._getCurrentSubscriptionUseCase.execute(tenantId);

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        "Current subscription fetched successfully",
        { subscription },
      );
    } catch (error) {
      next(error);
    }
  };

  webhook = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!Buffer.isBuffer(req.body)) {
        throw new Error("Razorpay webhook must use the raw request body");
      }

      await this._handleWebhookUseCase.execute(
        req.body,
        req.header("x-razorpay-signature") ?? undefined,
      );

      res.sendStatus(HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  };
}
