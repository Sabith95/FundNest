export type PlanType = string;

export const PlanType = {
  BASIC: "BASIC",
  PRO: "PRO",
  PREMIUM: "PREMIUM",
} as const;

export const DEFAULT_PLAN_TYPES = ["BASIC", "PRO", "PREMIUM"] as const;
