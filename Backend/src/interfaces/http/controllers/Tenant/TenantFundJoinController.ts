import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/tokens";
import { IGetTenantFundJoinRequestsUseCase } from "../../../../application/interface/tenant/IGetTenantFundJoinRequestsUseCase";
import { IReviewFundJoinRequestUseCase } from "../../../../application/interface/tenant/IReviewFundJoinRequestUseCase";
import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { MESSAGES } from "../../../../shared/constants/messages";

@injectable()
export class TenantFundJoinController {
  constructor(
    @inject(TOKENS.GetTenantFundJoinRequestsUseCase)
    private readonly _getTenantFundJoinRequestsUseCase: IGetTenantFundJoinRequestsUseCase,

    @inject(TOKENS.ReviewFundJoinRequestUseCase)
    private readonly _reviewFundJoinRequestUseCase: IReviewFundJoinRequestUseCase,
  ) {}

  getJoinRequests = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenantId = req.tenantId || (req.user as any)?.id;
      if (!tenantId) {
        throw new UnauthorizedError(MESSAGES.TENANT.NOT_AUTHENTICATED);
      }

      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      const fundId = req.query.fundId ? String(req.query.fundId) : undefined;
      const status = req.query.status ? String(req.query.status) : undefined;
      const search = req.query.search ? String(req.query.search) : undefined;

      const result = await this._getTenantFundJoinRequestsUseCase.execute(
        tenantId,
        {
          page,
          limit,
          fundId,
          status,
          search,
        },
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        "Fund join requests fetched successfully",
        result,
      );
    } catch (error) {
      next(error);
    }
  };

  reviewJoinRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenantId = req.tenantId || (req.user as any)?.id;
      const reviewerId = (req.user as any)?.id || tenantId;

      if (!tenantId) {
        throw new UnauthorizedError(MESSAGES.TENANT.NOT_AUTHENTICATED);
      }

      const requestId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      if (!requestId) {
        throw new BadRequestError("Request ID is required");
      }

      const { decision, rejectionReason, documentReviews } = req.body;
      if (!decision || (decision !== "APPROVED" && decision !== "REJECTED")) {
        throw new BadRequestError(
          "Decision is required and must be APPROVED or REJECTED",
        );
      }

      const result = await this._reviewFundJoinRequestUseCase.execute(
        tenantId,
        requestId,
        reviewerId,
        {
          decision,
          rejectionReason,
          documentReviews,
        },
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        `Join request ${decision.toLowerCase()} successfully`,
        result,
      );
    } catch (error) {
      next(error);
    }
  };
}
