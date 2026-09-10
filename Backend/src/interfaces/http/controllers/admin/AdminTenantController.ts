import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IGetAllTenantsUseCase } from "../../../../application/interface/admin/IGetAllTenantsUseCase";
import { IGetTenantByIdUseCase } from "../../../../application/interface/admin/IGetTenantByIdUseCase";
import { IUpdateTenantStatusUseCase } from "../../../../application/interface/admin/IUpdateTenantStatusUseCase";
import { IVerifyBusinessDetailsUseCase } from "../../../../application/interface/admin/IVerifyBusinessDetailsUseCase";
import { IVerifyKycDocumentsUseCase } from "../../../../application/interface/admin/IVerifyKycDocumentsUseCase";
import { IVerifyBankDetailsUseCase } from "../../../../application/interface/admin/IVerifyBankDetailsUseCase";

import { AdminTenantResponseDtoMapper } from "../../../../application/mapper/AdminTenantResponseDtoMapper";

import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { MESSAGES } from "../../../../shared/constants/messages";
import { TOKENS } from "../../../../shared/tokens";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { ICompleteTenantVerificationUseCase } from "../../../../application/interface/admin/ICompleteTenantVerificationUseCase";

@injectable()
export class AdminTenantController {
  constructor(
    @inject(TOKENS.GetAllTenantsUseCase)
    private readonly _getAllTenantsUseCase: IGetAllTenantsUseCase,

    @inject(TOKENS.GetTenantByIdUseCase)
    private readonly _getTenantByIdUseCase: IGetTenantByIdUseCase,

    @inject(TOKENS.UpdateTenantStatusUseCase)
    private readonly _updateTenantStatusUseCase: IUpdateTenantStatusUseCase,

    @inject(TOKENS.VerifyBusinessDetailsUseCase)
    private readonly _verifyBusinessDetailsUseCase: IVerifyBusinessDetailsUseCase,

    @inject(TOKENS.VerifyKycDocumentsUseCase)
    private readonly _verifyKycDocumentsUseCase: IVerifyKycDocumentsUseCase,

    @inject(TOKENS.VerifyBankDetailsUseCase)
    private readonly _verifyBankDetailsUseCase: IVerifyBankDetailsUseCase,

    @inject(TOKENS.CompleteTenantVerificationUseCase)
    private readonly _completeTenantVerificationUseCase: ICompleteTenantVerificationUseCase,
  ) {}

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      const search = req.query.search
        ? String(req.query.search).trim()
        : undefined;

      if (
        !Number.isInteger(page) ||
        page < 1 ||
        !Number.isInteger(limit) ||
        limit < 1 ||
        limit > 100
      ) {
        throw new BadRequestError(MESSAGES.COMMON.INVALID_PAGINATION);
      }

      const result = await this._getAllTenantsUseCase.execute({
        page,
        limit,
        search,
      });

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.TENANT.TENANTS_FETCHED,
        result,
      );
    } catch (error) {
      next(error);
    }
  };

  getOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenant = await this._getTenantByIdUseCase.execute(
        String(req.params.id),
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.TENANT.TENANTS_FETCHED,
        {
          tenant: AdminTenantResponseDtoMapper.toDetailsDto(tenant),
        },
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
      if (typeof req.body.isActive !== "boolean") {
        throw new BadRequestError("isActive must be a boolean");
      }

      const tenant = await this._updateTenantStatusUseCase.execute({
        tenantId: String(req.params.id),
        isActive: req.body.isActive,
      });

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        tenant.isActive ? MESSAGES.TENANT.UNBLOCKED : MESSAGES.TENANT.BLOCKED,
        {
          tenant: AdminTenantResponseDtoMapper.toDto(tenant),
        },
      );
    } catch (error) {
      next(error);
    }
  };

  verifyBusinessDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenant = await this._verifyBusinessDetailsUseCase.execute(
        String(req.params.id),
        req.body,
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.SUPER_ADMIN.BUSINESS_DETAILS_VERIFIED,
        {
          tenant: AdminTenantResponseDtoMapper.toDetailsDto(tenant),
        },
      );
    } catch (error) {
      next(error);
    }
  };

  verifyKycDocuments = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenant = await this._verifyKycDocumentsUseCase.execute(
        String(req.params.id),
        req.body,
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.SUPER_ADMIN.KYC_VERIFIED,
        {
          tenant: AdminTenantResponseDtoMapper.toDetailsDto(tenant),
        },
      );
    } catch (error) {
      next(error);
    }
  };

  verifyBankDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenant = await this._verifyBankDetailsUseCase.execute(
        String(req.params.id),
        req.body,
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.SUPER_ADMIN.BANK_DETAILS_VERIFIED,
        {
          tenant: AdminTenantResponseDtoMapper.toDetailsDto(tenant),
        },
      );
    } catch (error) {
      next(error);
    }
  };

  completeVerification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenant = await this._completeTenantVerificationUseCase.execute(
        String(req.params.id),
      );
      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.SUPER_ADMIN.TENANT_VERIFICATION_COMPLETED,
        {
          tenant: AdminTenantResponseDtoMapper.toDetailsDto(tenant),
        },
      );
    } catch (error) {
      next(error);
    }
  };
}
