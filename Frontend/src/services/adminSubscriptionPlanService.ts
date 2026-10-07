import { API_ROUTES } from "../shared/apiRoutes";
import type {
  AdminBillingRecord,
  CreateSubscriptionPlanPayload,
  SubscriptionPlan,
  UpdateSubscriptionPlanPayload,
} from "../types/subsctiption.types";
import api from "./api";

export const adminSubscriptionPlanService = {
  async getAll(): Promise<SubscriptionPlan[]> {
    const response = await api.get(
      API_ROUTES.SUPER_ADMIN.GET_SUBSCRIPTION_PLANS,
    );

    return response.data.data.plans;
  },

  async create(
    payload: CreateSubscriptionPlanPayload,
  ): Promise<SubscriptionPlan> {
    const response = await api.post(
      API_ROUTES.SUPER_ADMIN.CREATE_SUBSCRIPTION_PLAN,
      payload,
    );

    return response.data.data.plan;
  },

  async update(
    id: string,
    payload: UpdateSubscriptionPlanPayload,
  ): Promise<SubscriptionPlan> {
    const response = await api.patch(
      API_ROUTES.SUPER_ADMIN.UPDATE_SUBSCRIPTION_PLAN(id),
      payload,
    );

    return response.data.data.plan;
  },

  async updateStatus(id: string, isActive: boolean): Promise<SubscriptionPlan> {
    const response = await api.patch(
      API_ROUTES.SUPER_ADMIN.UPDATE_SUBSCRIPTION_PLAN_STATUS(id),
      { isActive },
    );

    return response.data.data.plan;
  },

  async delete(id: string): Promise<SubscriptionPlan> {
    const response = await api.delete(
      API_ROUTES.SUPER_ADMIN.DELETE_SUBSCRIPTION_PLAN(id),
    );
    return response.data.data.plan;
  },

  async getBillingHistory(): Promise<AdminBillingRecord[]> {
    const response = await api.get(
      API_ROUTES.SUPER_ADMIN.GET_BILLING_HISTORY,
    );
    const history = response.data.data.history || [];

    return history.map((item: any) => ({
      ...item,
      amount: item.amount > 1000 ? Math.round(item.amount / 100) : item.amount,
      currency: item.currency === "INR" || !item.currency ? "₹" : item.currency,
    }));
  },
};
