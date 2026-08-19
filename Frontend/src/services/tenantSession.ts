// import { ROUTES } from "../shared/constants";

// export type TenantOnboardingStep =
//   | "REGISTERED"
//   | "OTP_VERIFIED"
//   | "BUSINESS_INFO_COMPLETED"
//   | "KYC_COMPLETED"
//   | "BANK_DETAILS_COMPLETED"
//   | "COMPLETED";

// export interface TenantSession {
//   id: string;
//   companyName: string;
//   ownerName: string;
//   email: string;
//   status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
//   onboardingStep: TenantOnboardingStep;
// }

// const STORAGE_KEY = "tenantSession";

// export const getTenantSession = (): TenantSession | null => {
//   const saved = sessionStorage.getItem(STORAGE_KEY);
//   if (!saved) return null;

//   try {
//     return JSON.parse(saved) as TenantSession;
//   } catch {
//     sessionStorage.removeItem(STORAGE_KEY);
//     return null;
//   }
// };

// export const setTenantSession = (tenant: TenantSession): void => {
//   sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tenant));
// };

// export const updateTenantSessionStep = (onboardingStep: TenantOnboardingStep): void => {
//   const tenant = getTenantSession();
//   if (tenant) setTenantSession({ ...tenant, onboardingStep });
// };

// export const getTenantDestination = (step: TenantOnboardingStep): string => {
//   switch (step) {
//     case "REGISTERED":
//     case "OTP_VERIFIED":
//       return ROUTES.TENANT.BUSINESS_INFO;
//     case "BUSINESS_INFO_COMPLETED":
//       return ROUTES.TENANT.KYC_UPLOAD;
//     case "KYC_COMPLETED":
//       return ROUTES.TENANT.BANKING;
//     case "BANK_DETAILS_COMPLETED":
//     case "COMPLETED":
//       return ROUTES.TENANT.DASHBOARD;
//   }
// };