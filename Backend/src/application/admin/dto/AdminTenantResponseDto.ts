export interface AdminTenantResponseDto {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  isActive: boolean
  verificationStatus: string;
  createdAt: Date;
}