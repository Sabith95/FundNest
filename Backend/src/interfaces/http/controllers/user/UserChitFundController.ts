import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/tokens";
import { IGetAvailableChitFundsUseCase } from "../../../../application/interface/user/IGetAvailableChitFundsUseCase";
import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { MESSAGES } from "../../../../shared/constants/messages";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";

@injectable()
export class UserChitFundController {
  constructor(
    @inject(TOKENS.GetAvailableChitFundsUseCase)
    private readonly _getAvailableChitFundsUseCase: IGetAvailableChitFundsUseCase,
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
}