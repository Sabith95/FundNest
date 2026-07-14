import { injectable } from "tsyringe";
import { 
    ITenantRepository,
    CreateTenantData, 
    UpdateBankDetailsData, 
    UpdateBusinessInfoData, 
    UpdateKycDocumentsData } from "../../domain/repositories/ITenantRepository";
import { Tenant } from "../../domain/entities/Tenant";
import { TenantModel } from "../database/models/TenantModel";
import { MongoBaseRepository } from "./MongoBaseRepository";
import { VerificationStatus } from "../../shared/constants/enums/VerificationStatus";
import { OnboardingStep } from "../../shared/constants/enums/OnboardingStep";

@injectable()
export class TenantRepository extends MongoBaseRepository<Tenant> implements ITenantRepository {
    constructor(){
        super(TenantModel)
    }

    async create(data: CreateTenantData): Promise<Tenant> {
        return this.save({
            ...data,
            email: data.email.toLowerCase().trim(),
        } as Partial<Tenant>) 
    }

    async findByEmail(email: string): Promise<Tenant | null> {
        const doc = await TenantModel.findOne({
            email: email.toLowerCase().trim(),
        }).lean()

        return doc ? this.toEntity(doc) : null
    }

    async markEmailAsVerified(tenantId: string): Promise<void> {
        await TenantModel.updateOne(
            {_id: tenantId},
            {$set: {isEmailVerified: true}}
        )
    }

    async updatePassword(tenantId: string, hashedPassword: string): Promise<void> {
        await TenantModel.updateOne(
            {_id: tenantId},
            {
                $set:{
                password: hashedPassword,
            },
        }
        )
    }

    async updateBusinessInfo(tenantId: string, data: UpdateBusinessInfoData, onboardingStep: OnboardingStep): Promise<Tenant | null> {
        const doc = await TenantModel.findByIdAndUpdate(
            tenantId,{
                $set:{
                    businessInfo: {
                        ...data,
                        verification: VerificationStatus.PENDING,
                    },
                },
                onboardingStep,
            },
            {
                new: true,
                runValidators: true,
            }
        ).lean()

        return doc ? this.toEntity(doc) : null
    }

    async updateKycDocuments(tenantId: string, data: UpdateKycDocumentsData): Promise<Tenant | null> {
        const doc = await TenantModel.findByIdAndUpdate(
            tenantId,
            {
                $set:{
                    kycDocuments: {
                        businessRegistrationCertificate: {
                            ...data.businessRegistrationCertificate,
                            verification: VerificationStatus.PENDING,
                        },
                        ownerIdProof: {
                            ...data.ownerIdProof,
                            verification: VerificationStatus.PENDING,
                        },
                    },
                },
            },
            {
                new : true,
                runValidators: true,
            },
        ).lean()
        
        return doc ? this.toEntity(doc) : null
    }

    async updateBankDetails(
    tenantId: string,
    data: UpdateBankDetailsData
  ): Promise<Tenant | null> {
    const doc = await TenantModel.findByIdAndUpdate(
      tenantId,
      {
        $set: {
          bankDetails: {
            ...data,
            verification: VerificationStatus.PENDING,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    return doc ? this.toEntity(doc) : null;
  }

  protected toEntity(tenant: any): Tenant {
    return {
      id: tenant._id.toString(),

      companyName: tenant.companyName,
      ownerName: tenant.ownerName,

      email: tenant.email,
      phone: tenant.phone,
      password: tenant.password,

      isEmailVerified: tenant.isEmailVerified,
      isActive: tenant.isActive,

      status: tenant.status,
      onboardingStep: tenant.onboardingStep,

      businessInfo: tenant.businessInfo,

      kycDocuments: tenant.kycDocuments,

      bankDetails: tenant.bankDetails,

      rejectionReason: tenant.rejectionReason,

      approvedAt: tenant.approvedAt,

      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    };
  }

}