import crypto from "crypto";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IFundJoinRequestRepository } from "../../../domain/repositories/IFundJoinRequestRepository";
import { IChitFundMemberRepository } from "../../../domain/repositories/IChitFundMemberRepository";
import { IChitFundRepository } from "../../../domain/repositories/IChitFundRepository";
import {
  IPaymentService,
  PaymentDetailsResult,
} from "../../../domain/interface/payment/IPaymentService";
import { IVerifyFundJoinCheckoutUseCase } from "../../interface/user/IVerifyFundJoinCheckoutUseCase";
import {
  VerifyFundJoinCheckoutInputDto,
  VerifyFundJoinCheckoutResponseDto,
} from "../dto/FundJoinRequestDto";
import { ChitFundModel } from "../../../infrastructure/database/models/ChitFundModel";
import { ChitFundMember, MembershipStatus } from "../../../domain/entities/ChitFundMember";
import { FundJoinStatus } from "../../../domain/entities/FundJoinRequest";
import { BadRequestError } from "../../../shared/errors/BadRequestError";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { ConflictError } from "../../../shared/errors/ConflictError";
import { env } from "../../../infrastructure/config/env";
import { MESSAGES } from "../../../shared/constants/messages";

@injectable()
export class VerifyFundJoinCheckoutUseCase
  implements IVerifyFundJoinCheckoutUseCase
{
  constructor(
    @inject(TOKENS.FundJoinRequestRepository)
    private readonly _fundJoinRequestRepository: IFundJoinRequestRepository,

    @inject(TOKENS.ChitFundMemberRepository)
    private readonly _chitFundMemberRepository: IChitFundMemberRepository,

    @inject(TOKENS.ChitFundRepository)
    private readonly _chitFundRepository: IChitFundRepository,

    @inject(TOKENS.RazorpayPaymentService)
    private readonly _razorpayPaymentService: IPaymentService,
  ) {}

  public async execute(
    userId: string,
    input: VerifyFundJoinCheckoutInputDto,
  ): Promise<VerifyFundJoinCheckoutResponseDto> {
    const { fundId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      input;

    const request = await this._fundJoinRequestRepository.findByOrderId(
      razorpayOrderId,
    );

    if (!request || request.userId !== userId || request.fundId !== fundId) {
      throw new NotFoundError(MESSAGES.PAYMENT.CHECKOUT_SESSION_NOT_FOUND);
    }

    // Idempotency: if already completed, return existing membership
    if (request.status === FundJoinStatus.COMPLETED && request.slotNumber) {
      const existingMember =
        await this._chitFundMemberRepository.findByFundAndUser(fundId, userId);
      return {
        success: true,
        message: "You are already enrolled in this fund",
        slotNumber: request.slotNumber,
        membershipId: existingMember?.id || "",
        fundId,
      };
    }

    // Assert cryptographic HMAC signature
    this.assertSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );

    // Fetch and assert payment details from Razorpay
    const payment = await this._razorpayPaymentService.getPayment(
      razorpayPaymentId,
    );

    const fund = await this._chitFundRepository.findById(fundId);
    if (!fund) {
      throw new NotFoundError(MESSAGES.FUND.NOT_FOUND);
    }

    const expectedAmountPaise = Math.round(fund.contributionAmount * 100);
    if (
      payment.orderId !== razorpayOrderId ||
      payment.amount !== expectedAmountPaise ||
      payment.currency !== "INR"
    ) {
      throw new BadRequestError(MESSAGES.PAYMENT.DETAILS_NOT_MATCHING);
    }

    if (payment.status !== "captured") {
      throw new ConflictError(MESSAGES.PAYMENT.NOT_CAPTURED);
    }

    // Atomic increment of currentMembersCount with race-condition guard
    const updatedFund = await ChitFundModel.findOneAndUpdate(
      {
        _id: fundId,
        currentMembersCount: { $lt: fund.totalMembers },
        isActive: true,
      },
      {
        $inc: { currentMembersCount: 1 },
        $set: { updatedAt: new Date() },
      },
      { new: true },
    );

    if (!updatedFund) {
      throw new ConflictError(
        MESSAGES.FUND.REACHED_MAXIMUM_CAPACITY_BEFORE_CHECKOUT,
      );
    }

    const assignedSlotNumber = updatedFund.currentMembersCount;

    // Create ChitFundMember record
    const member = ChitFundMember.create({
      id: "",
      fundId,
      tenantId: fund.tenantId,
      userId,
      joinRequestId: request.id,
      slotNumber: assignedSlotNumber,
      initialContributionPaise: expectedAmountPaise,
      joinedAt: new Date(),
      status: MembershipStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedMember = await this._chitFundMemberRepository.create(member);

    // Mark request as COMPLETED
    request.completeEnrollment(razorpayPaymentId, assignedSlotNumber);
    await this._fundJoinRequestRepository.updateRequest(request);

    return {
      success: true,
      message: "Successfully joined chit fund!",
      slotNumber: assignedSlotNumber,
      membershipId: savedMember.id,
      fundId,
    };
  }

  private assertSignature(
    orderId: string,
    paymentId: string,
    receivedSignature: string,
  ): void {
    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_SECRET_KEY)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const receivedBuffer = Buffer.from(receivedSignature, "utf8");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      throw new ForbiddenError(MESSAGES.PAYMENT.INVALID_PAYMENT_SIGNATURE);
    }
  }
}
