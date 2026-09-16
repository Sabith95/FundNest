import { z } from "zod";

import { BillingCycle } from "../../../../shared/constants/enums/BillingCycle";
import { PlanType } from "../../../../shared/constants/enums/PlanType";

const nullablePositiveInteger = z
  .number()
  .int("Value must be a whole number")
  .positive("Value must be greater than zero")
  .nullable();

const planFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Plan name must contain at least 2 characters")
    .max(100, "Plan name must not exceed 100 characters"),

  price: z
    .number()
    .finite("Price must be a valid number")
    .positive("Price must be greater than zero"),

  billingCycle: z.nativeEnum(BillingCycle),

  durationDays: z
    .number()
    .int("Duration must be a whole number")
    .positive("Duration must be greater than zero"),

  maxFunds: nullablePositiveInteger,

  maxUsers: nullablePositiveInteger,

  hasAutopay: z.boolean(),

  hasFundSuggestions: z.boolean(),
});

export const createSubscriptionPlanSchema = planFieldsSchema
  .extend({
    planType: z.nativeEnum(PlanType),
  })
  .strict();

export const updateSubscriptionPlanSchema = planFieldsSchema.strict();

export const updateSubscriptionPlanStatusSchema = z
  .object({
    isActive: z.boolean(),
  })
  .strict();