import { API_ROUTES } from "../shared/apiRoutes";
import type { SubscriptionPlan } from "../types/subsctiption.types";
import type { TenantBillingOverview, InvoiceRecord } from "../types/billing.types";
import { tenantFundService } from "./tenantFundService";
import api from "./api";

export interface CurrentTenantSubscription {
  id: string;
  tenantId: string;
  planId: string;
  planName: string;
  planType: string;
  amount: number;
  currency: "INR";
  billingCycle: string;
  durationDays: number;
  maxFunds: number | null;
  maxUsers: number | null;
  hasAutopay: boolean;
  startsAt: string;
  endsAt: string;
  status: "ACTIVE" | "EXPIRED";
  razorpayOrderId: string;
  razorpayPaymentId: string;
  createdAt: string;
  updatedAt: string;
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

  async getInvoices(): Promise<InvoiceRecord[]> {
    const response = await api.get(API_ROUTES.TENANTS.SUBSCRIPTION_INVOICES);
    const invoices = response.data.data.invoices || [];

    return invoices.map((inv: any) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      date: new Date(inv.date || inv.periodStart || inv.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      planName: inv.planName,
      amount: inv.amount > 1000 ? Math.round(inv.amount / 100) : inv.amount,
      currency: inv.currency === "INR" || !inv.currency ? "₹" : inv.currency,
      status: inv.status,
      razorpayPaymentId: inv.razorpayPaymentId || "—",
      razorpayOrderId: inv.razorpayOrderId,
      periodStart: inv.periodStart,
      periodEnd: inv.periodEnd,
    }));
  },

  async getBillingOverview(): Promise<TenantBillingOverview> {
    const [sub, funds, invoiceHistory] = await Promise.all([
      this.getCurrentSubscription().catch(() => null),
      tenantFundService.getTenantFunds().catch(() => []),
      this.getInvoices().catch(() => []),
    ]);

    const activeFunds = funds.filter((f) => f.isActive);
    const totalMembersUsed = activeFunds.reduce(
      (sum, f) => sum + (f.totalMembers || 0),
      0,
    );

    const invoices: InvoiceRecord[] =
      invoiceHistory && invoiceHistory.length > 0
        ? invoiceHistory
        : sub
          ? [
              {
                id: sub.id || sub.razorpayPaymentId,
                invoiceNumber: `INV-${(sub.razorpayPaymentId || sub.id).slice(-8).toUpperCase()}`,
                date: new Date(sub.startsAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
                planName: sub.planName,
                amount: Math.round(sub.amount / 100),
                currency: "₹",
                status: "PAID",
                razorpayPaymentId: sub.razorpayPaymentId,
                razorpayOrderId: sub.razorpayOrderId,
                periodStart: sub.startsAt,
                periodEnd: sub.endsAt,
              },
            ]
          : [];

    return {
      currentPlan: sub
        ? {
            planId: sub.planId,
            planName: sub.planName,
            planType: sub.planType,
            price: Math.round(sub.amount / 100),
            billingCycle: sub.billingCycle,
            startsAt: sub.startsAt,
            endsAt: sub.endsAt,
            status: sub.status,
            razorpayPaymentId: sub.razorpayPaymentId,
          }
        : null,
      usage: {
        funds: {
          used: activeFunds.length,
          limit: sub ? sub.maxFunds : null,
        },
        users: {
          used: totalMembersUsed,
          limit: sub ? sub.maxUsers : null,
        },
        hasAutopay: sub ? sub.hasAutopay : false,
      },
      invoices,
    };
  },
};