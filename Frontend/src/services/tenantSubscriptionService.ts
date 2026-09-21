import { API_ROUTES } from "../shared/apiRoutes";
import type { SubscriptionPlan } from "../types/subsctiption.types";
import api from "./api";

export const tenantSubscriptionPlanService = {
  async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    const response = await api.get(
      API_ROUTES.TENANTS.GET_AVAILABLE_SUBSCRIPTION_PLANS,
    );

    return response.data.data.plans;
  },
};