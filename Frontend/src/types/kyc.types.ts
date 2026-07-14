export interface IKycUploadRequest {
  businessRegistrationCertificate: File;
  ownerIdProof: File;
}

export interface IVerificationInfo {
  status: string;
  rejectionReason?: string;
  verifiedAt?: string;
}

export interface IDocumentInfo {
  url: string;
  publicId: string;
  verification: IVerificationInfo;
}

export interface IKycDocuments {
  businessRegistrationCertificate: IDocumentInfo;
  ownerIdProof: IDocumentInfo;
}

export interface IKycUploadResponse {
  id: string;
  kycDocuments: IKycDocuments;
  onboardingStep: string;
}