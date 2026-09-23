export interface CreateNormalChitFundDto {
  name: string;
  description?: string;
  chitValue: number;
  contributionAmount: number;
  durationMonths: number;
  totalMembers: number;
  startDate: Date | string;
}
