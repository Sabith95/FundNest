import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IGetAllUsersUseCase } from "../../../../application/interface/admin/IGetAllUserUseCase";
import { IUpdateUserStatusUseCase } from "../../../../application/interface/admin/IUpdateUserStatus";

import { AdminUserResponseDtoMapper } from "../../../../application/mapper/AdminUserResponseDtoMapper";

import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { MESSAGES } from "../../../../shared/constants/messages";
import { TOKENS } from "../../../../shared/tokens";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { IGetUserByIdUseCase } from "../../../../application/interface/admin/IGetUserByIdUseCase";

@injectable()
export class AdminUserController {
  constructor(
    @inject(TOKENS.GetAllUsersUseCase)
    private readonly _getAllUsersUseCase: IGetAllUsersUseCase,

    @inject(TOKENS.UpdateUserStatusUseCase)
    private readonly _updateUserStatusUseCase: IUpdateUserStatusUseCase,

    @inject(TOKENS.GetUserByIdUseCase)
    private readonly _getUserByIdUseCase: IGetUserByIdUseCase
  ) {}

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      const search = req.query.search ? String(req.query.search).trim() : undefined;

      if (
        !Number.isInteger(page) ||
        page < 1 ||
        !Number.isInteger(limit) ||
        limit < 1 ||
        limit > 100
      ) {
        throw new BadRequestError(MESSAGES.COMMON.INVALID_PAGINATION);
      }

      const result = await this._getAllUsersUseCase.execute({
        page,
        limit,
        search,
      });

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.USER.USERS_FETCHED,
        result
      );
    } catch (error) {
      next(error);
    }
  };

  getOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenant = await this._getUserByIdUseCase.execute(
        String(req.params.id)
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.USER.USERS_FETCHED,
        {
          tenant: AdminUserResponseDtoMapper.toDto(tenant),
        }
      );
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (typeof req.body.isActive !== "boolean") {
        throw new BadRequestError("isActive must be a boolean");
      }

      const user = await this._updateUserStatusUseCase.execute({
        userId: String(req.params.id),
        isActive: req.body.isActive,
      });

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        user.isActive
          ? MESSAGES.USER.UNBLOCKED
          : MESSAGES.USER.BLOCKED,
        {
          user: AdminUserResponseDtoMapper.toDto(user),
        }
      );
    } catch (error) {
      next(error);
    }
  };
}