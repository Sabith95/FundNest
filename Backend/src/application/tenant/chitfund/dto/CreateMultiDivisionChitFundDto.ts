export interface CreateMultiDivisionChitFundDto {
  name: string;
  description?: string;
  chitValue: number;
  contributionAmount: number;
  durationMonths: number;
  totalMembers: number;
  startDate: Date | string;
  division: number;
}
