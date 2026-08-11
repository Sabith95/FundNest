
export interface LoginTenantDto {
  email: string;
  password: string;
}

export interface LoginTenantResponseDto {
  tenant: {
    id: string;
    companyName: string;
    ownerName: string;
    email: string;
    status: string;
    onboardingStep: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}