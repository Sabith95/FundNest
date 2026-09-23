import { ChitFund } from "../../domain/entities/ChitFund";
import { ChitFundResponseDto } from "../tenant/chitfund/dto/ChitFundResponseDto";

export class ChitFundDtoMapper {
  public static toDto(fund: ChitFund): ChitFundResponseDto {
    return {
      id: fund.id,
      tenantId: fund.tenantId,
      name: fund.name,
      description: fund.description,
      fundType: fund.fundType,
      chitValue: fund.chitValue,
      contributionAmount: fund.contributionAmount,
      durationMonths: fund.durationMonths,
      totalMembers: fund.totalMembers,
      currentMembersCount: fund.currentMembersCount,
      startDate: fund.startDate.toISOString(),
      division: fund.division,
      isActive: fund.isActive,
      createdAt: fund.createdAt.toISOString(),
      updatedAt: fund.updatedAt.toISOString(),
    };
  }

  public static toDtoList(funds: ChitFund[]): ChitFundResponseDto[] {
    return funds.map((fund) => this.toDto(fund));
  }
}
