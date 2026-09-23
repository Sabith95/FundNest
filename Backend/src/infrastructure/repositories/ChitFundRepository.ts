import { injectable } from "tsyringe";

import { ChitFund } from "../../domain/entities/ChitFund";
import {
  CreateChitFundData,
  IChitFundRepository,
} from "../../domain/repositories/IChitFundRepository";
import { MongoBaseRepository } from "./MongoBaseRepository";
import { ChitFundModel } from "../database/models/ChitFundModel";
import {
  ChitFundPersistenceMapper,
  ChitFundRecord,
} from "../database/mapper/ChitFundPersistenceMapper";

@injectable()
export class ChitFundRepository
  extends MongoBaseRepository<ChitFund>
  implements IChitFundRepository
{
  constructor() {
    super(ChitFundModel);
  }

  async createFund(data: CreateChitFundData): Promise<ChitFund> {
    const fund = await this.model.create({
      ...data,
      currentMembersCount: data.currentMembersCount ?? 0,
      isActive: data.isActive ?? true,
    });

    return this.toEntity(fund.toObject());
  }

  async findByTenantId(tenantId: string): Promise<ChitFund[]> {
    const funds = await this.model
      .find({ tenantId })
      .sort({ createdAt: -1 })
      .lean<ChitFundRecord[]>();

    return funds.map((fund) => this.toEntity(fund));
  }

  async findByIdAndTenantId(
    id: string,
    tenantId: string,
  ): Promise<ChitFund | null> {
    const fund = await this.model
      .findOne({ _id: id, tenantId })
      .lean<ChitFundRecord>();

    return fund ? this.toEntity(fund) : null;
  }

  async findByNameAndTenantId(
    name: string,
    tenantId: string,
  ): Promise<ChitFund | null> {
    const fund = await this.model
      .findOne({ name, tenantId })
      .lean<ChitFundRecord>();

    return fund ? this.toEntity(fund) : null;
  }

  async updateStatus(
    id: string,
    tenantId: string,
    isActive: boolean,
  ): Promise<ChitFund | null> {
    const fund = await this.model
      .findOneAndUpdate(
        { _id: id, tenantId },
        { isActive, updatedAt: new Date() },
        { new: true, runValidators: true },
      )
      .lean<ChitFundRecord>();

    return fund ? this.toEntity(fund) : null;
  }

  protected toEntity(doc: ChitFundRecord): ChitFund {
    return ChitFundPersistenceMapper.toEntity(doc);
  }
}
