import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/tokens";

import { ICreateNormalChitFundUseCase } from "../../../../application/interface/tenant/chitfund/ICreateNormalChitFundUseCase";
import { ICreateMultiDivisionChitFundUseCase } from "../../../../application/interface/tenant/chitfund/ICreateMultiDivisionChitFundUseCase";
import { IBlockChitFundUseCase } from "../../../../application/interface/tenant/chitfund/IBlockChitFundUseCase";
import { IUnblockChitFundUseCase } from "../../../../application/interface/tenant/chitfund/IUnblockChitFundUseCase";
import { IGetTenantChitFundsUseCase } from "../../../../application/interface/tenant/chitfund/IGetTenantChitFundsUseCase";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import {
  createNormalChitFundSchema,
  createMultiDivisionChitFundSchema,
} from "../../validators/tenant/chitFundValidator";
import { MESSAGES } from "../../../../shared/constants/messages";

@injectable()
export class TenantChitFundController {
  constructor(
    @inject(TOKENS.CreateNormalChitFundUseCase)
    private readonly _createNormalUseCase: ICreateNormalChitFundUseCase,

    @inject(TOKENS.CreateMultiDivisionChitFundUseCase)
    private readonly _createMultiDivisionUseCase: ICreateMultiDivisionChitFundUseCase,

    @inject(TOKENS.BlockChitFundUseCase)
    private readonly _blockUseCase: IBlockChitFundUseCase,

    @inject(TOKENS.UnblockChitFundUseCase)
    private readonly _unblockUseCase: IUnblockChitFundUseCase,

    @inject(TOKENS.GetTenantChitFundsUseCase)
    private readonly _getTenantChitFundsUseCase: IGetTenantChitFundsUseCase,
  ) {}

  createNormal = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenantId = req.user?.id;
      if (!tenantId) {
        throw new UnauthorizedError(MESSAGES.TENANT.NOT_AUTHENTICATED);
      }

      const payload = createNormalChitFundSchema.parse(req.body);
      const fund = await this._createNormalUseCase.execute(tenantId, payload);

      ResponseHandler.success(
        res,
        HTTP_STATUS.CREATED,
        MESSAGES.FUND.CREATED,
        { fund },
      );
    } catch (error) {
      next(error);
    }
  };

  createMultiDivision = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenantId = req.user?.id;
      if (!tenantId) {
        throw new UnauthorizedError(MESSAGES.TENANT.NOT_AUTHENTICATED);
      }

      const payload = createMultiDivisionChitFundSchema.parse(req.body);
      const fund = await this._createMultiDivisionUseCase.execute(
        tenantId,
        payload,
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.CREATED,
        MESSAGES.FUND.CREATED,
        { fund },
      );
    } catch (error) {
      next(error);
    }
  };

  block = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenantId = req.user?.id;
      if (!tenantId) {
        throw new UnauthorizedError(MESSAGES.TENANT.NOT_AUTHENTICATED);
      }

      const fundId = String(req.params.id);
      const fund = await this._blockUseCase.execute(tenantId, fundId);

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.FUND.BLOCKED,
        { fund },
      );
    } catch (error) {
      next(error);
    }
  };

  unblock = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenantId = req.user?.id;
      if (!tenantId) {
        throw new UnauthorizedError(MESSAGES.TENANT.NOT_AUTHENTICATED);
      }

      const fundId = String(req.params.id);
      const fund = await this._unblockUseCase.execute(tenantId, fundId);

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.FUND.UNBLOCKED,
        { fund },
      );
    } catch (error) {
      next(error);
    }
  };

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenantId = req.user?.id;
      if (!tenantId) {
        throw new UnauthorizedError(MESSAGES.TENANT.NOT_AUTHENTICATED);
      }

      const funds = await this._getTenantChitFundsUseCase.execute(tenantId);

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.FUND.FETCHED,
        { funds },
      );
    } catch (error) {
      next(error);
    }
  };
}
