import { Tenant, VerificationInfo } from "../entities/Tenant";
import { IBaseRepository } from "./IBaseRepository";
import { BusinessType } from "../../shared/constants/enums/BusinessType";
import { OnboardingStep } from "../../shared/constants/enums/OnboardingStep";
import { Role } from "../../shared/constants/roles";

export interface CreateTenantData {
    companyName: string
    ownerName: string
    email: string
    phone: string
    password: string
    role: Role
    isEmailVerified: boolean
}

export interface UpdateBusinessInfoData {
  businessType: BusinessType;
  registrationId: string;
  registeredBusinessAddress: string;
}

export interface UpdateKycDocumentsData {
  businessRegistrationCertificate: {
    url: string;
    publicId: string;
    verification: VerificationInfo
  };
  ownerIdProof: {
    url: string;
    publicId: string;
    verification: VerificationInfo
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

    updateBusinessInfo(tenantId: string, data: UpdateBusinessInfoData, onboardingStep: OnboardingStep) : Promise<Tenant | null>

    updateKycDocuments(
        tenantId: string,
        data: UpdateKycDocumentsData,
        onboardingStep: OnboardingStep
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