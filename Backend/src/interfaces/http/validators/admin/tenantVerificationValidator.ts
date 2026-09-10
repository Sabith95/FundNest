import { z } from "zod";
import { VerificationStatus } from "../../../../shared/constants/enums/VerificationStatus";

export const verifyBusinessDetailsSchema = z.object({
  status: z.nativeEnum(VerificationStatus, {
    error: "Status must be PENDING, APPROVED, or REJECTED",
  }),
  rejectionReason: z.string().trim().optional(),
});

export const verifyKycDocumentsSchema = z.object({
  businessRegistrationStatus: z.nativeEnum(VerificationStatus, {
    error: "businessRegistrationStatus must be PENDING, APPROVED, or REJECTED",
  }),
  businessRegistrationRejectionReason: z.string().trim().optional(),
  ownerIdProofStatus: z.nativeEnum(VerificationStatus, {
    error: "ownerIdProofStatus must be PENDING, APPROVED, or REJECTED",
  }),
  ownerIdProofRejectionReason: z.string().trim().optional(),
});

export const verifyBankDetailsSchema = z.object({
  status: z.nativeEnum(VerificationStatus, {
    error: "Status must be PENDING, APPROVED, or REJECTED",
  }),
  rejectionReason: z.string().trim().optional(),
});
