export const TenantStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type TenantStatus = (typeof TenantStatus)[keyof typeof TenantStatus];
