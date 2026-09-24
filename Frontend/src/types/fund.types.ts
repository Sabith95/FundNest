export type FundType = "normal" | "multi";
export type FundIcon = "leaf" | "diamond" | "bolt" | "star";

export interface IFund {
  id: string;
  name: string;
  tenant: string;
  type: FundType;
  icon: FundIcon;
  totalPool: number;
  monthly: number;
  durationMonths: number;
  totalSlots: number;
  slotsLeft: number;
  auctionsPerMonth: number;
  /** Only meaningful for multi-division funds */
  winnersPerCycle?: number;
  featured?: boolean;
}

export type AmountRange = "all" | "lt25" | "25to100" | "gt100";
export type DurationRange = "any" | "lte12" | "13to24" | "gt24";

export interface IFundFilters {
  amount: AmountRange;
  duration: DurationRange;
}

export const AMOUNT_OPTIONS: { value: AmountRange; label: string }[] = [
  { value: "all", label: "All Amounts" },
  { value: "lt25", label: "Under ₹25,000" },
  { value: "25to100", label: "₹25,000 – ₹1,00,000" },
  { value: "gt100", label: "Above ₹1,00,000" },
];

export const DURATION_OPTIONS: { value: DurationRange; label: string }[] = [
  { value: "any", label: "Any Duration" },
  { value: "lte12", label: "Up to 12 months" },
  { value: "13to24", label: "13 – 24 months" },
  { value: "gt24", label: "Over 24 months" },
];