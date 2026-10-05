import { Role } from "../../../shared/constants/roles";

export interface PendingRegistration {
  name: string;
  email: string;
  phone?: string;
  password: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  role: Role;
  authProvider: "LOCAL" | "GOOGLE";
}

export interface PendingTenantRegistration {
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
}

export interface IPendingRegistrationRepository {
  storePendingUserRegistration(data: PendingRegistration): Promise<void>;
  getPendingUserRegistration(
    email: string,
  ): Promise<PendingRegistration | null>;
  deletePendingUserRegistration(email: string): Promise<void>;

  storePendingTenantRegistration(
    data: PendingTenantRegistration,
  ): Promise<void>;
  getPendingTenantRegistration(
    email: string,
  ): Promise<PendingTenantRegistration | null>;
  deletePendingTenantRegistration(email: string): Promise<void>;
}
