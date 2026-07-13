import { Tenant } from "../entities/Tenant";
import { IBaseRepository } from "./IBaseRepository";

export interface CreateTenantData {
    companyName: string
    ownerName: string
    email: string
    phone: string
    password: string
    isEmailVerified: boolean
}

export interface UpdateBusinessInfoData {
  businessType: string;
  registrationId: string;
  registeredBusinessAddress: string;
}

export interface UpdateKycDocumentsData {
  businessRegistrationCertificate: {
    url: string;
    publicId: string;
  };
  ownerIdProof: {
    url: string;
    publicId: string;
  };
}

export interface UpdateBankDetailsData {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface ITenantRepository extends IBaseRepository<Tenant> {
    create(data: CreateTenantData): Promise<Tenant>;

    findByEmail(email: string): Promise<Tenant | null>

    markEmailAsVerified(tenantId: string): Promise<void>

    updateBusinessInfo(tenantId: string, data: UpdateBusinessInfoData) : Promise<Tenant | null>

    updateKycDocuments(
        tenantId: string,
        data: UpdateKycDocumentsData
    ): Promise<Tenant | null>;

    updateBankDetails(
        tenantId: string,
        data: UpdateBankDetailsData
    ): Promise<Tenant | null>;

    updatePassword(
        tenantId: string,
        hashedPassword: string
    ): Promise<void>;
}