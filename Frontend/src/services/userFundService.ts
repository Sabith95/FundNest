import api from "./api";
import { API_ROUTES } from "../shared/apiRoutes";
import type { IFund, FundIcon } from "../types/fund.types";

export interface ApiChitFund {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  fundType: "NORMAL" | "MULTI_DIVISION";
  chitValue: number;
  contributionAmount: number;
  durationMonths: number;
  totalMembers: number;
  currentMembersCount: number;
  startDate: string;
  division: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Assigns an icon based on fund type and pool value
 */
function resolveFundIcon(type: "NORMAL" | "MULTI_DIVISION", totalPool: number): FundIcon {
  if (type === "MULTI_DIVISION") return "bolt";
  if (totalPool >= 100000) return "diamond";
  if (totalPool >= 50000) return "star";
  return "leaf";
}

/**
 * Maps raw backend API data to the frontend IFund interface
 */
export function mapApiFundToIFund(fund: ApiChitFund): IFund {
  const isMulti = fund.fundType === "MULTI_DIVISION";
  const slotsLeft = Math.max(0, fund.totalMembers - (fund.currentMembersCount ?? 0));
  const divisionCount = fund.division ?? (isMulti ? 3 : 1);

  return {
    id: fund.id,
    name: fund.name,
    tenant: `Organizer #${fund.tenantId.slice(-4).toUpperCase()}`,
    type: isMulti ? "multi" : "normal",
    icon: resolveFundIcon(fund.fundType, fund.chitValue),
    totalPool: fund.chitValue,
    monthly: fund.contributionAmount,
    durationMonths: fund.durationMonths,
    totalSlots: fund.totalMembers,
    slotsLeft,
    auctionsPerMonth: isMulti ? divisionCount : 1,
    winnersPerCycle: isMulti ? divisionCount : 1,
    featured: slotsLeft <= 5 || fund.chitValue >= 100000,
  };
}

export const userFundService = {
  /**
   * Fetch all open & active chit funds available for users to join.
   */
  async getAvailableFunds(): Promise<IFund[]> {
    const response = await api.get(API_ROUTES.USERS.GET_AVAILABLE_CHIT_FUNDS);
    const rawFunds: ApiChitFund[] = response.data?.data?.funds ?? [];
    return rawFunds.map(mapApiFundToIFund);
  },
};