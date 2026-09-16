import { API_ROUTES } from "../shared/apiRoutes";
import type {
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
};
