import { injectable } from "tsyringe";
import {
  ITenantRepository,
  CreateTenantData,
  UpdateBankDetailsData,
  UpdateBusinessInfoData,
  UpdateKycDocumentsData,
  VerifyKycDocumentsInput,
} from "../../domain/repositories/ITenantRepository";
import { Tenant } from "../../domain/entities/Tenant";
import { TenantModel } from "../database/models/TenantModel";
import { MongoBaseRepository } from "./MongoBaseRepository";
import { VerificationStatus } from "../../shared/constants/enums/VerificationStatus";
import { OnboardingStep } from "../../shared/constants/enums/OnboardingStep";
import {
  TenantPersistenceMapper,
  TenantRecord,
} from "../database/mapper/TenantPersistenceMapper";
import { PaginatedResult } from "../../domain/repositories/types/Pagination";
import { VerificationInfo } from "../../domain/entities/Tenant";
import { TenantStatus } from "../../shared/constants/enums/TenantStatus";

@injectable()
export class TenantRepository
  extends MongoBaseRepository<Tenant>
  implements ITenantRepository
{
  constructor() {
    super(TenantModel);
  }

  async create(data: CreateTenantData): Promise<Tenant> {
    return this.save({
      ...data,
      email: data.email.toLowerCase().trim(),
    } as Partial<Tenant>);
  }

  async findByEmail(email: string): Promise<Tenant | null> {
    const doc = await TenantModel.findOne({
      email: email.toLowerCase().trim(),
    }).lean();

    return doc ? this.toEntity(doc) : null;
  }

  async markEmailAsVerified(tenantId: string): Promise<void> {
    await TenantModel.updateOne(
      { _id: tenantId },
      { $set: { isEmailVerified: true } },
    );
  }

  async updatePassword(
    tenantId: string,
    hashedPassword: string,
  ): Promise<void> {
    await TenantModel.updateOne(
      { _id: tenantId },
      {
        $set: {
          password: hashedPassword,
        },
      },
    );
  }

  async updateActiveStatus(
    tenantId: string,
    isActive: boolean,
  ): Promise<Tenant | null> {
    const doc = await TenantModel.findByIdAndUpdate(
      tenantId,
      { $set: { isActive } },
      { new: true, runValidators: true },
    ).lean();

    return doc ? this.toEntity(doc) : null;
  }

  async updateBusinessInfo(
    tenantId: string,
    data: UpdateBusinessInfoData,
    onboardingStep: OnboardingStep,
  ): Promise<Tenant | null> {
    const doc = await TenantModel.findByIdAndUpdate(
      tenantId,
      {
        $set: {
          businessInfo: {
            ...data,
            verification: {
              status: VerificationStatus.PENDING,
            },
          },
        },
        onboardingStep,
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    return doc ? this.toEntity(doc) : null;
  }

  async updateKycDocuments(
    tenantId: string,
    data: UpdateKycDocumentsData,
    onboardingStep: OnboardingStep,
  ): Promise<Tenant | null> {
    const doc = await TenantModel.findByIdAndUpdate(
      tenantId,
      {
        $set: {
          kycDocuments: {
            businessRegistrationCertificate: {
              ...data.businessRegistrationCertificate,
              verification: {
                status: VerificationStatus.PENDING,
              },
            },
            ownerIdProof: {
              ...data.ownerIdProof,
              verification: {
                status: VerificationStatus.PENDING,
              },
            },
          },
        },
        onboardingStep,
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    return doc ? this.toEntity(doc) : null;
  }

  async updateBankDetails(
    tenantId: string,
    data: UpdateBankDetailsData,
    onboardingStep: OnboardingStep,
  ): Promise<Tenant | null> {
    const doc = await TenantModel.findByIdAndUpdate(
      tenantId,
      {
        $set: {
          bankDetails: {
            ...data,
            verification: {
              status: VerificationStatus.PENDING,
            },
          },
        },
        onboardingStep,
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    return doc ? this.toEntity(doc) : null;
  }

  async verifyBusinessDetails(
    tenantId: string,
    verification: VerificationInfo,
  ): Promise<Tenant | null> {
    const doc = await TenantModel.findByIdAndUpdate(
      tenantId,
      {
        $set: {
          "businessInfo.verification": verification,
        },
      },
      { new: true, runValidators: true },
    ).lean();
    return doc ? this.toEntity(doc) : null;
  }
  async verifyKycDocuments(
    tenantId: string,
    verificationData: VerifyKycDocumentsInput,
  ): Promise<Tenant | null> {
    const doc = await TenantModel.findByIdAndUpdate(
      tenantId,
      {
        $set: {
          "kycDocuments.businessRegistrationCertificate.verification":
            verificationData.businessRegistrationCertificateVerification,
          "kycDocuments.ownerIdProof.verification":
            verificationData.ownerIdProofVerification,
        },
      },
      { new: true, runValidators: true },
    ).lean();
    return doc ? this.toEntity(doc) : null;
  }
  async verifyBankDetails(
    tenantId: string,
    verification: VerificationInfo,
  ): Promise<Tenant | null> {
    const doc = await TenantModel.findByIdAndUpdate(
      tenantId,
      {
        $set: {
          "bankDetails.verification": verification,
        },
      },
      { new: true, runValidators: true },
    ).lean();
    return doc ? this.toEntity(doc) : null;
  }
  async updateOverallStatus(
    tenantId: string,
    status: TenantStatus,
    rejectionReason?: string,
    approvedAt?: Date,
    onboardingStep?: OnboardingStep,
  ): Promise<Tenant | null> {
    const updatePayload: any = { status };
    if (rejectionReason !== undefined)
      updatePayload.rejectionReason = rejectionReason;
    if (approvedAt !== undefined) updatePayload.approvedAt = approvedAt;
    if (onboardingStep !== undefined)
      updatePayload.onboardingStep = onboardingStep;
    const doc = await TenantModel.findByIdAndUpdate(
      tenantId,
      { $set: updatePayload },
      { new: true, runValidators: true },
    ).lean();
    return doc ? this.toEntity(doc) : null;
  }

  override async findPaginated(
    page: number,
    limit: number,
    filterOrSearch?: Partial<Tenant> | string,
  ): Promise<PaginatedResult<Tenant>> {
    const skip = (page - 1) * limit;

    let query: any = {};
    if (typeof filterOrSearch === "string" && filterOrSearch.trim() !== "") {
      const regex = new RegExp(filterOrSearch.trim(), "i");
      query.$or = [
        { companyName: regex },
        { ownerName: regex },
        { email: regex },
      ];
    } else if (typeof filterOrSearch === "object" && filterOrSearch !== null) {
      query = filterOrSearch;
    }

    const [docs, total] = await Promise.all([
      TenantModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      TenantModel.countDocuments(query),
    ]);

    return {
      data: docs.map((doc: any) => this.toEntity(doc)),
      total,
      page,
      limit,
    };
  }

  protected toEntity(tenant: TenantRecord): Tenant {
    return TenantPersistenceMapper.toEntity(tenant);
  }
}
