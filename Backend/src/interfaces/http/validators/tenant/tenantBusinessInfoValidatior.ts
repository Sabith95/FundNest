import { z } from "zod";
import { BusinessType } from "../../../../shared/constants/enums/BusinessType";

export const updateBusinessInfoSchema = z.object({
  businessType: z.nativeEnum(BusinessType, {
    error: "Please select a valid business type.",
  }),

  registrationId: z
    .string()
    .trim()
    .min(1, "Registration ID is required.")
    .max(100, "Registration ID cannot exceed 100 characters."),

  registeredBusinessAddress: z
    .string()
    .trim()
    .min(1, "Registered business address is required.")
    .max(500, "Registered business address cannot exceed 500 characters."),
});

export type UpdateBusinessInfoInput = z.infer<
  typeof updateBusinessInfoSchema
>;