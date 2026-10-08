import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/tokens";
import { IGetKycRequirementsForFundUseCase } from "../../../../application/interface/tenant/kyc-config/IGetKycRequirementsForFundUseCase";
import { IGetUserFundJoinStatusUseCase } from "../../../../application/interface/user/IGetUserFundJoinStatusUseCase";
import { ISubmitFundJoinRequestUseCase } from "../../../../application/interface/user/ISubmitFundJoinRequestUseCase";
import { IReuploadFundKycUseCase } from "../../../../application/interface/user/IReuploadFundKycUseCase";
import { ICreateFundJoinCheckoutUseCase } from "../../../../application/interface/user/ICreateFundJoinCheckoutUseCase";
import { IVerifyFundJoinCheckoutUseCase } from "../../../../application/interface/user/IVerifyFundJoinCheckoutUseCase";
import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { MESSAGES } from "../../../../shared/constants/messages";

@injectable()
export class UserFundJoinController {
  constructor(
    @inject(TOKENS.GetKycRequirementsForFundUseCase)
    private readonly _getKycRequirementsUseCase: IGetKycRequirementsForFundUseCase,

    @inject(TOKENS.GetUserFundJoinStatusUseCase)
    private readonly _getUserFundJoinStatusUseCase: IGetUserFundJoinStatusUseCase,

    @inject(TOKENS.SubmitFundJoinRequestUseCase)
    private readonly _submitFundJoinRequestUseCase: ISubmitFundJoinRequestUseCase,

    @inject(TOKENS.ReuploadFundKycUseCase)
    private readonly _reuploadFundKycUseCase: IReuploadFundKycUseCase,

    @inject(TOKENS.CreateFundJoinCheckoutUseCase)
    private readonly _createFundJoinCheckoutUseCase: ICreateFundJoinCheckoutUseCase,

    @inject(TOKENS.VerifyFundJoinCheckoutUseCase)
    private readonly _verifyFundJoinCheckoutUseCase: IVerifyFundJoinCheckoutUseCase,
  ) {}

  getKycRequirements = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const fundId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      if (!fundId) throw new BadRequestError("Fund ID is required");

      const template = await this._getKycRequirementsUseCase.execute(fundId);

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        "KYC requirements fetched successfully",
        {
          fundId,
          requiresKyc: Boolean(template && template.requirements.length > 0),
          template,
        },
      );
    } catch (error) {
      next(error);
    }
  };

  getJoinStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError(MESSAGES.USER.NOT_AUTHENTICATED);
      }

      const fundId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      if (!fundId) throw new BadRequestError("Fund ID is required");

      const status = await this._getUserFundJoinStatusUseCase.execute(
        fundId,
        userId,
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        "Fund join status retrieved",
        status,
      );
    } catch (error) {
      next(error);
    }
  };

  submitJoinRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError(MESSAGES.USER.NOT_AUTHENTICATED);
      }

      const fundId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      if (!fundId) throw new BadRequestError("Fund ID is required");

      const { documents } = req.body;
      if (!Array.isArray(documents)) {
        throw new BadRequestError("Documents must be an array");
      }

      const result = await this._submitFundJoinRequestUseCase.execute(
        fundId,
        userId,
        { documents },
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.CREATED,
        "KYC documents submitted. Your request is now pending verification.",
        result,
      );
    } catch (error) {
      next(error);
    }
  };

  reuploadKyc = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError(MESSAGES.USER.NOT_AUTHENTICATED);
      }

      const fundId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      if (!fundId) throw new BadRequestError("Fund ID is required");

      const { documents } = req.body;
      if (!Array.isArray(documents)) {
        throw new BadRequestError("Documents must be an array");
      }

      const result = await this._reuploadFundKycUseCase.execute(
        fundId,
        userId,
        { documents },
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        "KYC documents re-uploaded successfully. Awaiting organizer review.",
        result,
      );
    } catch (error) {
      next(error);
    }
  };

  createCheckout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError(MESSAGES.USER.NOT_AUTHENTICATED);
      }

      const fundId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      if (!fundId) throw new BadRequestError("Fund ID is required");

      const checkout = await this._createFundJoinCheckoutUseCase.execute(
        fundId,
        userId,
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        "Checkout session initiated",
        checkout,
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
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError(MESSAGES.USER.NOT_AUTHENTICATED);
      }

      const paramId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const fundId = paramId || req.body.fundId;
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
        req.body;

      if (!fundId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        throw new BadRequestError(
          "fundId, razorpayOrderId, razorpayPaymentId, and razorpaySignature are required",
        );
      }

      const result = await this._verifyFundJoinCheckoutUseCase.execute(
        userId,
        {
          fundId,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        },
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        result.message,
        result,
      );
    } catch (error) {
      next(error);
    }
  };
}
