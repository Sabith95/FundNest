import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IChitFundRepository } from "../../../domain/repositories/IChitFundRepository";
import { ITenantKycTemplateRepository } from "../../../domain/repositories/ITenantKycTemplateRepository";
import { IFundJoinRequestRepository } from "../../../domain/repositories/IFundJoinRequestRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ISubmitFundJoinRequestUseCase } from "../../interface/user/ISubmitFundJoinRequestUseCase";
import {
  FundJoinRequestResponseDto,
  SubmitFundJoinRequestInputDto,
} from "../dto/FundJoinRequestDto";
import {
  DocumentVerificationStatus,
  FundJoinRequest,
  FundJoinStatus,
} from "../../../domain/entities/FundJoinRequest";
import { FundJoinRequestDtoMapper } from "../../mapper/FundJoinRequestDtoMapper";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { BadRequestError } from "../../../shared/errors/BadRequestError";
import { ConflictError } from "../../../shared/errors/ConflictError";
import { MESSAGES } from "../../../shared/constants/messages";

@injectable()
export class SubmitFundJoinRequestUseCase
  implements ISubmitFundJoinRequestUseCase
{
  constructor(
    @inject(TOKENS.ChitFundRepository)
    private readonly _chitFundRepository: IChitFundRepository,

    @inject(TOKENS.TenantKycTemplateRepository)
    private readonly _kycTemplateRepository: ITenantKycTemplateRepository,

    @inject(TOKENS.FundJoinRequestRepository)
    private readonly _fundJoinRequestRepository: IFundJoinRequestRepository,

    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  public async execute(
    fundId: string,
    userId: string,
    input: SubmitFundJoinRequestInputDto,
  ): Promise<FundJoinRequestResponseDto> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }
    if (!user.isActive) {
      throw new BadRequestError(MESSAGES.AUTH.ACCOUNT_INACTIVE);
    }

    const fund = await this._chitFundRepository.findById(fundId);
    if (!fund) {
      throw new NotFoundError(MESSAGES.FUND.NOT_FOUND);
    }
    if (!fund.isActive) {
      throw new BadRequestError("This chit fund is inactive");
    }
    if (fund.currentMembersCount >= fund.totalMembers) {
      throw new ConflictError("This chit fund is already full");
    }
    if (new Date(fund.startDate).getTime() <= Date.now()) {
      throw new BadRequestError("Enrollment has closed as the chit fund has already started");
    }

    // Check existing request
    const existing = await this._fundJoinRequestRepository.findByFundAndUser(
      fundId,
      userId,
    );
    if (existing) {
      if (existing.status === FundJoinStatus.COMPLETED) {
        throw new ConflictError("You are already an active member of this fund");
      }
      if (existing.status === FundJoinStatus.PENDING_VERIFICATION) {
        throw new ConflictError("Your application is currently pending verification");
      }
      if (existing.status === FundJoinStatus.APPROVED) {
        throw new ConflictError("Your application is already approved. Please proceed to payment");
      }
      if (existing.status === FundJoinStatus.REJECTED) {
        throw new ConflictError("Your application was rejected. Please use the re-upload endpoint");
      }
    }

    // Validate against Tenant KYC template
    const template = await this._kycTemplateRepository.findByTenantId(
      fund.tenantId,
    );
    if (template && template.isActive && template.requirements.length > 0) {
      const submittedMap = new Map(
        input.documents.map((d) => [d.requirementId, d]),
      );

      for (const req of template.requirements) {
        if (req.isRequired) {
          const submitted = submittedMap.get(req.id);
          if (!submitted || !submitted.frontSideKey) {
            throw new BadRequestError(
              `Mandatory document missing: ${req.title}`,
            );
          }
          if (req.requiresBothSides && !submitted.backSideKey) {
            throw new BadRequestError(
              `Back side is required for document: ${req.title}`,
            );
          }
        }
      }
    }

    const documents = input.documents.map((d) => ({
      requirementId: d.requirementId,
      documentType: d.documentType,
      title: d.title,
      frontSideKey: d.frontSideKey,
      backSideKey: d.backSideKey,
      status: DocumentVerificationStatus.PENDING,
    }));

    const request = FundJoinRequest.create({
      id: "", // Will be assigned by Mongo
      fundId,
      tenantId: fund.tenantId,
      userId,
      kycTemplateId: template?.id,
      documents,
      status: FundJoinStatus.PENDING_VERIFICATION,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this._fundJoinRequestRepository.create(request);
    return FundJoinRequestDtoMapper.toDto(saved);
  }
}
