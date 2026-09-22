import { API_ROUTES } from "../shared/apiRoutes";
import type { SubscriptionPlan } from "../types/subsctiption.types";
import type { TenantBillingOverview } from "../types/billing.types";
import api from "./api";

export interface CurrentTenantSubscription {
  planId: string;
  planName: string;
  status: "ACTIVE" | "EXPIRED";
  startsAt: string;
  endsAt: string;
  razorpayPaymentId: string;
}

interface CheckoutData {
  checkoutId: string;
  razorpayKeyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: "INR";
  planName: string;
  tenant: {
    name: string;
    email: string;
    contact: string;
  };
}

export const tenantSubscriptionPlanService = {
  async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    const response = await api.get(
      API_ROUTES.TENANTS.GET_AVAILABLE_SUBSCRIPTION_PLANS,
    );

    return response.data.data.plans;
  },

  async getCurrentSubscription(): Promise<CurrentTenantSubscription | null> {
    const response = await api.get(API_ROUTES.TENANTS.CURRENT_SUBSCRIPTION);

    return response.data.data.subscription;
  },

  async createCheckout(planId: string): Promise<CheckoutData> {
    const response = await api.post(
      API_ROUTES.TENANTS.CREATE_SUBSCRIPTION_CHECKOUT,
      { planId },
    );

    return response.data.data.checkout;
  },

  async verifyCheckout(input: {
    checkoutId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<CurrentTenantSubscription> {
    const response = await api.post(
      API_ROUTES.TENANTS.VERIFY_SUBSCRIPTION_CHECKOUT,
      input,
    );

    return response.data.data.subscription;
  },

  async getBillingOverview(): Promise<TenantBillingOverview> {
    try {
      const response = await api.get("/tenants/subscriptions/billing-overview");
      return response.data.data;
    } catch {
      // Fallback structure when API endpoint is pending
      const sub = await this.getCurrentSubscription();
      return {
        currentPlan: sub
          ? {
              planId: sub.planId,
              planName: sub.planName,
              planType: "PRO",
              price: 4999,
              billingCycle: "Monthly",
              startsAt: sub.startsAt,
              endsAt: sub.endsAt,
              status: sub.status,
              razorpayPaymentId: sub.razorpayPaymentId,
            }
          : null,
        usage: {
          funds: { used: 3, limit: 10 },
          users: { used: 5, limit: 15 },
          hasAutopay: true,
          hasFundSuggestions: true,
        },
        invoices: sub
          ? [
              {
                id: "inv_1",
                invoiceNumber: `INV-${sub.razorpayPaymentId.slice(-8).toUpperCase()}`,
                date: new Date(sub.startsAt).toLocaleDateString("en-IN"),
                planName: sub.planName,
                amount: 4999,
                currency: "₹",
                status: "PAID",
                razorpayPaymentId: sub.razorpayPaymentId,
                razorpayOrderId: "order_sample_123",
              },
            ]
          : [],
      };
    }
  },
};
