import {
  Schema,
  model,
  models,
  HydratedDocument,
} from "mongoose";
import { TenantStatus } from "../../../shared/constants/enums/TenantStatus";
import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";
import { Role, ROLES } from "../../../shared/constants/roles";
import { BusinessType } from "../../../shared/constants/enums/BusinessType";


export interface VerificationInfoDocument {
  status: VerificationStatus;
  rejectionReason?: string;
  verifiedAt?: Date;
}

export interface BusinessInfoDocument {
  businessType: BusinessType;
  registrationId: string;
  registeredBusinessAddress: string;
  verification: VerificationInfoDocument
}

export interface DocumentInfoDocument {
  url: string;
  publicId: string;
  verification: VerificationInfoDocument
}

export interface KycDocumentsDocument {
  businessRegistrationCertificate: DocumentInfoDocument;
  ownerIdProof: DocumentInfoDocument;
}

export interface BankDetailsDocument {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  verification: VerificationInfoDocument
}

export interface TenantDocument {
  companyName: string;
  ownerName: string;

  email: string;
  phone: string;
  password: string;

  role: Role;

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



const verificationInfoSchema = new Schema<VerificationInfoDocument>(
  {
    status: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
      required: true,
    },
    rejectionReason: { type: String, trim: true },
    verifiedAt: { type: Date },
  },
  { _id: false }
);

//sub scehmas

const businessInfoSchema = new Schema<BusinessInfoDocument>(
  {
    businessType: {
      type: String,
      enum: Object.values(BusinessType),
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
    verification: {
    type: verificationInfoSchema,
    default: () => ({ status: VerificationStatus.PENDING }),
    required: true,
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
    verification: {
    type: verificationInfoSchema,
    default: () => ({ status: VerificationStatus.PENDING }),
    required: true,
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
    verification: {
    type: verificationInfoSchema,
    default: () => ({ status: VerificationStatus.PENDING }),
    required: true,
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

    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
      index: true,
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