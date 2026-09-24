import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/tokens";
import { IGetTenantKycTemplateUseCase } from "../../../../application/interface/tenant/kyc-config/IGetTenantKycTemplateUseCase";
import { IConfigureTenantKycTemplateUseCase } from "../../../../application/interface/tenant/kyc-config/IConfigureTenantKycTemplateUseCase";
import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { MESSAGES } from "../../../../shared/constants/messages";
import { configureTenantKycTemplateSchema } from "../../validators/tenant/tenantKycConfigValidator";

@injectable()
export class TenantKycConfigController {
  constructor(
    @inject(TOKENS.GetTenantKycTemplateUseCase)
    private readonly _getTenantKycTemplateUseCase: IGetTenantKycTemplateUseCase,

    @inject(TOKENS.ConfigureTenantKycTemplateUseCase)
    private readonly _configureTenantKycTemplateUseCase: IConfigureTenantKycTemplateUseCase,
  ) {}

  getTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenantId = req.user?.id;
      if (!tenantId) {
        throw new UnauthorizedError(MESSAGES.TENANT.NOT_AUTHENTICATED);
      }

      const template =
        await this._getTenantKycTemplateUseCase.execute(tenantId);

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        "Tenant KYC template fetched successfully",
        { template },
      );
    } catch (error) {
      next(error);
    }
  };

  configureTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tenantId = req.user?.id;
      if (!tenantId) {
        throw new UnauthorizedError(MESSAGES.TENANT.NOT_AUTHENTICATED);
      }

      const payload = configureTenantKycTemplateSchema.parse(req.body);
      const template = await this._configureTenantKycTemplateUseCase.execute(
        tenantId,
        payload,
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        "Tenant KYC template updated successfully",
        { template },
      );
    } catch (error) {
      next(error);
    }
  };
}
