import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IChitFundRepository } from "../../../domain/repositories/IChitFundRepository";
import { IFundJoinRequestRepository } from "../../../domain/repositories/IFundJoinRequestRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPaymentService } from "../../../domain/interface/payment/IPaymentService";
import { ICreateFundJoinCheckoutUseCase } from "../../interface/user/ICreateFundJoinCheckoutUseCase";
import { CreateFundJoinCheckoutResponseDto } from "../dto/FundJoinRequestDto";
import { FundJoinStatus } from "../../../domain/entities/FundJoinRequest";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { BadRequestError } from "../../../shared/errors/BadRequestError";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";
import { ConflictError } from "../../../shared/errors/ConflictError";
import { env } from "../../../infrastructure/config/env";
import { MESSAGES } from "../../../shared/constants/messages";

@injectable()
export class CreateFundJoinCheckoutUseCase
  implements ICreateFundJoinCheckoutUseCase
{
  constructor(
    @inject(TOKENS.ChitFundRepository)
    private readonly _chitFundRepository: IChitFundRepository,

    @inject(TOKENS.FundJoinRequestRepository)
    private readonly _fundJoinRequestRepository: IFundJoinRequestRepository,

    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.RazorpayPaymentService)
    private readonly _razorpayPaymentService: IPaymentService,
  ) {}

  public async execute(
    fundId: string,
    userId: string,
  ): Promise<CreateFundJoinCheckoutResponseDto> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }
    if (!user.isActive) {
      throw new ForbiddenError(MESSAGES.AUTH.ACCOUNT_INACTIVE);
    }

    const fund = await this._chitFundRepository.findById(fundId);
    if (!fund) {
      throw new NotFoundError(MESSAGES.FUND.NOT_FOUND);
    }
    if (!fund.isActive) {
      throw new BadRequestError("Chit fund is inactive");
    }
    if (fund.currentMembersCount >= fund.totalMembers) {
      throw new ConflictError(MESSAGES.FUND.REACHED_MAXIMUM_CAPACITY);
    }
    if (new Date(fund.startDate).getTime() <= Date.now()) {
      throw new BadRequestError(MESSAGES.FUND.ENROLLMENT_CLOSED);
    }

    const request = await this._fundJoinRequestRepository.findByFundAndUser(
      fundId,
      userId,
    );
    if (!request) {
      throw new BadRequestError(MESSAGES.FUND.COMPLETE_KYC);
    }

    if (request.status === FundJoinStatus.COMPLETED) {
      throw new ConflictError(MESSAGES.FUND.ALREADY_COMPLETED_THE_JOINING);
    }

    if (
      request.status !== FundJoinStatus.APPROVED &&
      request.status !== FundJoinStatus.PAYMENT_PENDING
    ) {
      throw new ForbiddenError(
        `Cannot initiate payment. Your join request status is ${request.status}. Verification by organizer is required first.`,
      );
    }

    const initialAmountPaise = Math.round(fund.contributionAmount * 100);
    if (!Number.isSafeInteger(initialAmountPaise) || initialAmountPaise < 100) {
      throw new BadRequestError("Invalid fund contribution amount");
    }

    const receipt = `fund_${fundId.slice(-6)}_${userId.slice(-6)}_${Date.now()}`;
    const razorpayOrder = await this._razorpayPaymentService.createOrder({
      amount: initialAmountPaise,
      currency: "INR",
      receipt,
      notes: {
        fundId,
        userId,
        tenantId: fund.tenantId,
        requestId: request.id,
      },
    });

    request.setPaymentPending(razorpayOrder.orderId);
    await this._fundJoinRequestRepository.updateRequest(request);

    return {
      checkoutId: request.id,
      fundId: fund.id,
      fundName: fund.name,
      amount: initialAmountPaise,
      currency: "INR",
      razorpayOrderId: razorpayOrder.orderId,
      razorpayKeyId: env.RAZORPAY_KEY_ID,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    };
  }
}
