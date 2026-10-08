import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/tokens";
import { IGetAvailableChitFundsUseCase } from "../../../../application/interface/user/IGetAvailableChitFundsUseCase";
import { IGetFundDetailsUseCase } from "../../../../application/interface/user/IGetFundDetailsUseCase";
import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { MESSAGES } from "../../../../shared/constants/messages";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";

@injectable()
export class UserChitFundController {
  constructor(
    @inject(TOKENS.GetAvailableChitFundsUseCase)
    private readonly _getAvailableChitFundsUseCase: IGetAvailableChitFundsUseCase,

    @inject(TOKENS.GetFundDetailsUseCase)
    private readonly _getFundDetailsUseCase: IGetFundDetailsUseCase,
  ) {}

  getAvailableFunds = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError(MESSAGES.USER.NOT_AUTHENTICATED);
      }

      const funds = await this._getAvailableChitFundsUseCase.execute(userId);

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

  getFundDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError(MESSAGES.USER.NOT_AUTHENTICATED);
      }

      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : (req.params.id as string);
      const details = await this._getFundDetailsUseCase.execute(id, userId);

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.FUND.FETCHED,
        details,
      );
    } catch (error) {
      next(error);
    }
  };
}