import { z } from "zod";

const baseFundSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Fund name must contain at least 2 characters")
    .max(100, "Fund name must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional(),

  chitValue: z
    .number()
    .finite("Chit value must be a valid number")
    .positive("Chit value must be greater than zero"),

  contributionAmount: z
    .number()
    .finite("Contribution amount must be a valid number")
    .positive("Contribution amount must be greater than zero"),

  durationMonths: z
    .number()
    .int("Duration in months must be a whole number")
    .positive("Duration in months must be greater than zero"),

  totalMembers: z
    .number()
    .int("Total members must be a whole number")
    .positive("Total members must be greater than zero"),

  startDate: z.coerce.date(),
});

export const createNormalChitFundSchema = baseFundSchema.strict();

export const createMultiDivisionChitFundSchema = baseFundSchema
  .extend({
    division: z
      .number()
      .int("Division must be a whole number")
      .min(2, "Multi-division chit funds must have at least 2 divisions (typically 3 or 4)")
      .max(10, "Division count cannot exceed 10"),
  })
  .strict();

export const updateChitFundStatusSchema = z
  .object({
    isActive: z.boolean(),
  })
  .strict();
