export interface CreateMultiDivisionChitFundDto {
  name: string;
  description?: string;
  highlights?: string[];
  chitValue: number;
  contributionAmount: number;
  durationMonths: number;
  totalMembers: number;
  startDate: Date | string;
  division: number;
}
