import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IChitFundRepository } from "../../../domain/repositories/IChitFundRepository";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { ITenantKycTemplateRepository } from "../../../domain/repositories/ITenantKycTemplateRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IGetFundDetailsUseCase } from "../../interface/user/IGetFundDetailsUseCase";
import { FundDetailsDto } from "../dto/FundDetailsDto";
import { ChitFundDtoMapper } from "../../mapper/ChitFundDtoMapper";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { MESSAGES } from "../../../shared/constants/messages";
import { TenantStatus } from "../../../shared/constants/enums/TenantStatus";
import { KycStatus } from "../../../domain/entities/User";

@injectable()
export class GetFundDetailsUseCase implements IGetFundDetailsUseCase {
  constructor(
    @inject(TOKENS.ChitFundRepository)
    private readonly _chitFundRepository: IChitFundRepository,

    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository,

    @inject(TOKENS.TenantKycTemplateRepository)
    private readonly _kycTemplateRepository: ITenantKycTemplateRepository,

    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  public async execute(fundId: string, userId?: string): Promise<FundDetailsDto> {
    const fund = await this._chitFundRepository.findById(fundId);
    if (!fund) {
      throw new NotFoundError(MESSAGES.FUND.NOT_FOUND);
    }

    const tenant = await this._tenantRepository.findById(fund.tenantId);
    if (!tenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    // Determine whether this fund requires KYC (mandatory for chit funds)
    const kycRequired = true;

    // Determine user's KYC status if userId is provided
    let userKycStatus: string | undefined;
    let isUserKycVerified = false;

    if (userId) {
      const user = await this._userRepository.findById(userId);
      if (user) {
        userKycStatus = user.profile?.kycStatus ?? KycStatus.PENDING;
        isUserKycVerified = userKycStatus === KycStatus.VERIFIED;
      }
    }

    const tenantDto = {
      id: tenant.id,
      companyName: tenant.companyName || tenant.ownerName,
      ownerName: tenant.ownerName,
      email: tenant.email,
      phone: tenant.phone,
      status: tenant.status,
      businessType: tenant.businessInfo?.businessType,
      registrationId: tenant.businessInfo?.registrationId,
      registeredBusinessAddress: tenant.businessInfo?.registeredBusinessAddress,
      isVerified: tenant.status === TenantStatus.APPROVED,
      memberSince: tenant.createdAt ? new Date(tenant.createdAt).toISOString() : new Date().toISOString(),
    };

    return {
      fund: ChitFundDtoMapper.toDto(fund),
      tenant: tenantDto,
      kycRequired,
      userKycStatus,
      isUserKycVerified,
    };
  }
}
