import { injectable } from "tsyringe";
import { FundJoinRequest } from "../../domain/entities/FundJoinRequest";
import {
  FindTenantJoinRequestsFilter,
  IFundJoinRequestRepository,
} from "../../domain/repositories/IFundJoinRequestRepository";
import { PaginatedResult } from "../../domain/repositories/types/Pagination";
import {
  FundJoinRequestModel,
  FundJoinRequestDocument,
} from "../database/models/FundJoinRequestModel";
import {
  FundJoinRequestPersistenceMapper,
  FundJoinRequestRecord,
} from "../database/mapper/FundJoinRequestPersistenceMapper";
import { MongoBaseRepository } from "./MongoBaseRepository";

@injectable()
export class FundJoinRequestRepository
  extends MongoBaseRepository<FundJoinRequest>
  implements IFundJoinRequestRepository
{
  constructor() {
    super(FundJoinRequestModel);
  }

  async create(request: FundJoinRequest): Promise<FundJoinRequest> {
    const data = FundJoinRequestPersistenceMapper.toPersistence(request);
    const created = await this.model.create(data);
    return this.toEntity(created.toObject() as FundJoinRequestRecord);
  }

  async findByFundAndUser(
    fundId: string,
    userId: string,
  ): Promise<FundJoinRequest | null> {
    const doc = await this.model
      .findOne({ fundId, userId })
      .lean<FundJoinRequestRecord>();
    return doc ? this.toEntity(doc) : null;
  }

  async findByOrderId(orderId: string): Promise<FundJoinRequest | null> {
    const doc = await this.model
      .findOne({ razorpayOrderId: orderId })
      .lean<FundJoinRequestRecord>();
    return doc ? this.toEntity(doc) : null;
  }

  async updateRequest(request: FundJoinRequest): Promise<FundJoinRequest> {
    const data = FundJoinRequestPersistenceMapper.toPersistence(request);
    const updated = await this.model
      .findByIdAndUpdate(request.id, data, { new: true, runValidators: true })
      .lean<FundJoinRequestRecord>();
    if (!updated) {
      throw new Error(`FundJoinRequest not found with ID ${request.id}`);
    }
    return this.toEntity(updated);
  }

  async findPaginatedForTenant(
    tenantId: string,
    page: number,
    limit: number,
    filter?: FindTenantJoinRequestsFilter,
  ): Promise<PaginatedResult<FundJoinRequest>> {
    const query: any = { tenantId };
    if (filter?.fundId) {
      query.fundId = filter.fundId;
    }
    if (filter?.status) {
      query.status = filter.status;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.model
        .find(query)
        .populate("userId", "name email phone profile")
        .populate("fundId", "name chitValue contributionAmount durationMonths")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.model.countDocuments(query),
    ]);

    const entities = items.map((doc: any) => {
      const entity = this.toEntity(doc);
      // Attach populated info if needed
      (entity as any).applicant = doc.userId;
      (entity as any).fundDetails = doc.fundId;
      return entity;
    });

    return {
      data: entities,
      total,
      page,
      limit,
    };
  }

  async findPaginatedForFund(
    fundId: string,
    page: number,
    limit: number,
    filter?: FindTenantJoinRequestsFilter,
  ): Promise<PaginatedResult<FundJoinRequest>> {
    const query: any = { fundId };
    if (filter?.status) {
      query.status = filter.status;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.model
        .find(query)
        .populate("userId", "name email phone profile")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.model.countDocuments(query),
    ]);

    const entities = items.map((doc: any) => {
      const entity = this.toEntity(doc);
      (entity as any).applicant = doc.userId;
      return entity;
    });

    return {
      data: entities,
      total,
      page,
      limit,
    };
  }

  async countActiveByFundId(fundId: string): Promise<number> {
    return this.model.countDocuments({
      fundId,
      status: { $in: ["APPROVED", "PAYMENT_PENDING", "COMPLETED"] },
    });
  }

  protected toEntity(doc: FundJoinRequestRecord): FundJoinRequest {
    return FundJoinRequestPersistenceMapper.toEntity(doc);
  }
}
