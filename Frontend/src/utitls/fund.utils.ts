import type { IFund, IFundFilters } from "../types/fund.types";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatCurrency = (n: number): string => inr.format(n);

export const matchesFilters = (f: IFund, { amount, duration }: IFundFilters): boolean => {
  const amountOk =
    amount === "all" ||
    (amount === "lt25" && f.totalPool < 25000) ||
    (amount === "25to100" && f.totalPool >= 25000 && f.totalPool <= 100000) ||
    (amount === "gt100" && f.totalPool > 100000);

  const durationOk =
    duration === "any" ||
    (duration === "lte12" && f.durationMonths <= 12) ||
    (duration === "13to24" && f.durationMonths > 12 && f.durationMonths <= 24) ||
    (duration === "gt24" && f.durationMonths > 24);

  return amountOk && durationOk;
};