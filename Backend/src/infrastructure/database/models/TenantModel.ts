import {
  Schema,
  model,
  models,
  HydratedDocument,
} from "mongoose";
import { TenantStatus } from "../../../shared/constants/enums/TenantStatus";
import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";

export interface BusinessInfoDocument {
  businessType: string;
  registrationId: string;
  registeredBusinessAddress: string;
  verification: VerificationStatus
}

export interface DocumentInfoDocument {
  url: string;
  publicId: string;
  verification: VerificationStatus
}

export interface KycDocumentsDocument {
  businessRegistrationCertificate: DocumentInfoDocument;
  ownerIdProof: DocumentInfoDocument;
}

export interface BankDetailsDocument {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  verification: VerificationStatus
}

export interface TenantDocument {
  companyName: string;
  ownerName: string;

  email: string;
  phone: string;
  password: string;

  isEmailVerified: boolean;
  isActive: boolean;

  status: TenantStatus;
  onboardingStep: OnboardingStep;

  businessInfo?: BusinessInfoDocument;
  kycDocuments?: KycDocumentsDocument;
  bankDetails?: BankDetailsDocument;

  rejectionReason?: string;
  approvedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}


//sub scehmas

const businessInfoSchema = new Schema<BusinessInfoDocument>(
  {
    businessType: {
      type: String,
      required: true,
      trim: true,
    },
    registrationId: {
      type: String,
      required: true,
      trim: true,
    },
    registeredBusinessAddress: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const documentInfoSchema = new Schema<DocumentInfoDocument>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const kycDocumentsSchema = new Schema<KycDocumentsDocument>(
  {
    businessRegistrationCertificate: {
      type: documentInfoSchema,
      required: true,
    },
    ownerIdProof: {
      type: documentInfoSchema,
      required: true,
    },
  },
  { _id: false }
);

const bankDetailsSchema = new Schema<BankDetailsDocument>(
  {
    accountHolderName: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    ifscCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
  },
  { _id: false }
);


//main schema


const tenantSchema = new Schema<TenantDocument>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: Object.values(TenantStatus),
      default: TenantStatus.PENDING,
      index: true,
    },

    onboardingStep: {
      type: String,
      enum: Object.values(OnboardingStep),
      default: OnboardingStep.REGISTERED,
    },

    businessInfo: {
      type: businessInfoSchema,
      required: false,
    },

    kycDocuments: {
      type: kycDocumentsSchema,
      required: false,
    },

    bankDetails: {
      type: bankDetailsSchema,
      required: false,
    },

    rejectionReason: {
      type: String,
      trim: true,
    },

    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: "tenants",
  }
);

export type HydratedTenantDocument = HydratedDocument<TenantDocument>;

export const TenantModel =
  models.Tenant || model<TenantDocument>("Tenant", tenantSchema);