import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Building2,
  PackageSearch,
  PiggyBank,
  TreePine,
  type LucideIcon,
} from "lucide-react";

import Header from "../../../components/tenant/Header";
import Sidebar from "../../../components/tenant/Sidebar";
import SubscriptionPlanCard from "../../../components/subscription/SubscriptionPlanCard";
import { ROUTES } from "../../../shared/constants";
import { useAppSelector } from "../../../store/hooks";
import type { SubscriptionPlan } from "../../../types/subsctiption.types";
import { mapTenantVerificationStatus } from "../../../utitls/tenantRouting";
import { tenantSubscriptionPlanService } from "../../../services/tenantSubscriptionService";
import { openRazorpayCheckout } from "../../../services/razorpayCheckout";
import type { CurrentTenantSubscription } from "../../../services/tenantSubscriptionService";
import type {
  PaymentSuccessDetails,
  PaymentFailureDetails,
} from "../../../types/payment.types";
import TenantCurrentPlanBanner from "../../../components/subscription/TenantCurrentPlanBanner";

const PLAN_ICONS: Record<string, LucideIcon> = {
  BASIC: PiggyBank,
  PRO: TreePine,
  PREMIUM: Building2,
};

export default function SubscriptionPlans() {
  const tenant = useAppSelector((state) => state.tenant.tenant);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] =
    useState<CurrentTenantSubscription | null>(null);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadPlans = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [availablePlans, subscription] = await Promise.all([
        tenantSubscriptionPlanService.getAvailablePlans(),
        tenantSubscriptionPlanService.getCurrentSubscription(),
      ]);

      setPlans(availablePlans);
      setCurrentSubscription(subscription);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load subscription plans.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPlans();
  }, []);

  if (!tenant) {
    return <Navigate to={ROUTES.TENANT.LOGIN} replace />;
  }

  // const handleBuyNow = async (plan: SubscriptionPlan) => {
  //   setProcessingPlanId(plan.id);
  //   setError(null);
  //   setNotice(null);
  //   try {
  //     const checkout = await tenantSubscriptionPlanService.createCheckout(
  //       plan.id,
  //     );
  //     const checkoutResult = await openRazorpayCheckout({
  //       key: checkout.razorpayKeyId,
  //       amount: checkout.amount,
  //       currency: checkout.currency,
  //       name: "FundNest",
  //       description: `${checkout.planName} subscription`,
  //       order_id: checkout.razorpayOrderId,
  //       prefill: {
  //         name: checkout.tenant.name,
  //         email: checkout.tenant.email,
  //         contact: checkout.tenant.contact.replace(/\D/g, ""),
  //       },
  //       theme: {
  //         color: "#4f46e5",
  //       },
  //     });
  //     // 1. User closed checkout modal
  //     if (checkoutResult.type === "DISMISSED") {
  //       setNotice("Checkout was closed. No payment has been recorded.");
  //       return;
  //     }
  //     // 2. Razorpay Payment Failed (Declined card, bank failure, etc.)
  //     if (checkoutResult.type === "FAILED") {
  //       const failureDetails: PaymentFailureDetails = {
  //         status: "failed",
  //         planName: checkout.planName,
  //         planId: plan.id,
  //         amount: checkout.amount / 100, // Converts paise to Rupees
  //         currency: "₹",
  //         reason:
  //           checkoutResult.error.description ||
  //           "Payment was declined or failed.",
  //         errorCode: checkoutResult.error.code,
  //       };
  //       navigate(ROUTES.TENANT.PAYMENT_RESULT, { state: failureDetails });
  //       return;
  //     }
  //     // 3. Razorpay Payment Succeeded
  //     if (checkoutResult.type === "SUCCESS") {
  //       try {
  //         await tenantSubscriptionPlanService.verifyCheckout({
  //           checkoutId: checkout.checkoutId,
  //           razorpayOrderId: checkoutResult.response.razorpay_order_id,
  //           razorpayPaymentId: checkoutResult.response.razorpay_payment_id,
  //           razorpaySignature: checkoutResult.response.razorpay_signature,
  //         });
  //         const successDetails: PaymentSuccessDetails = {
  //           status: "success",
  //           transactionId: checkoutResult.response.razorpay_payment_id,
  //           planName: checkout.planName,
  //           planId: plan.id,
  //           amount: checkout.amount / 100, // Converts paise to Rupees
  //           currency: "₹",
  //           paidAt: new Date().toISOString(),
  //         };
  //         navigate(ROUTES.TENANT.PAYMENT_RESULT, { state: successDetails });
  //       } catch (err) {
  //         // Verification failed on server
  //         const failureDetails: PaymentFailureDetails = {
  //           status: "failed",
  //           planName: checkout.planName,
  //           planId: plan.id,
  //           amount: checkout.amount / 100,
  //           currency: "₹",
  //           reason:
  //             err instanceof Error
  //               ? err.message
  //               : "Payment verification failed.",
  //           errorCode: "VERIFICATION_FAILED",
  //         };
  //         navigate(ROUTES.TENANT.PAYMENT_RESULT, { state: failureDetails });
  //       }
  //     }
  //   } catch (err) {
  //     setError(
  //       err instanceof Error
  //         ? err.message
  //         : "Failed to initiate checkout. Please try again.",
  //     );
  //   } finally {
  //     setProcessingPlanId(null);
  //   }
  // };

  const handleBuyNow = async (plan: SubscriptionPlan) => {
    setProcessingPlanId(plan.id);
    setError(null);
    setNotice(null);

    try {
      const checkout = await tenantSubscriptionPlanService.createCheckout(
        plan.id,
      );

      const checkoutResult = await openRazorpayCheckout({
        key: checkout.razorpayKeyId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: "FundNest",
        description: `${checkout.planName} subscription`,
        order_id: checkout.razorpayOrderId,
        prefill: {
          name: checkout.tenant.name,
          email: checkout.tenant.email,
          contact: checkout.tenant.contact.replace(/\D/g, ""),
        },
        theme: {
          color: "#4f46e5",
        },
      });

      // Handle user closing modal without paying (if you want it to show Failure Page as well)
      if (checkoutResult.type === "DISMISSED") {
        const failureDetails: PaymentFailureDetails = {
          status: "failed",
          planName: checkout.planName,
          planId: plan.id,
          amount: checkout.amount / 100,
          currency: "₹",
          reason: "Payment window was closed before completion.",
          errorCode: "CHECKOUT_CANCELLED",
        };
        navigate(ROUTES.TENANT.PAYMENT_RESULT, { state: failureDetails });
        return;
      }

      // Handle payment failure (e.g. card declined, bad OTP)
      if (checkoutResult.type === "FAILED") {
        const failureDetails: PaymentFailureDetails = {
          status: "failed",
          planName: checkout.planName,
          planId: plan.id,
          amount: checkout.amount / 100,
          currency: "₹",
          reason:
            checkoutResult.error.description ||
            "Payment was declined or failed.",
          errorCode: checkoutResult.error.code,
        };

        navigate(ROUTES.TENANT.PAYMENT_RESULT, { state: failureDetails });
        return;
      }

      // Handle payment success
      if (checkoutResult.type === "SUCCESS") {
        try {
          await tenantSubscriptionPlanService.verifyCheckout({
            checkoutId: checkout.checkoutId,
            razorpayOrderId: checkoutResult.response.razorpay_order_id,
            razorpayPaymentId: checkoutResult.response.razorpay_payment_id,
            razorpaySignature: checkoutResult.response.razorpay_signature,
          });

          const successDetails: PaymentSuccessDetails = {
            status: "success",
            transactionId: checkoutResult.response.razorpay_payment_id,
            planName: checkout.planName,
            planId: plan.id,
            amount: checkout.amount / 100,
            currency: "₹",
            paidAt: new Date().toISOString(),
          };

          navigate(ROUTES.TENANT.PAYMENT_RESULT, { state: successDetails });
        } catch (err) {
          const failureDetails: PaymentFailureDetails = {
            status: "failed",
            planName: checkout.planName,
            planId: plan.id,
            amount: checkout.amount / 100,
            currency: "₹",
            reason:
              err instanceof Error
                ? err.message
                : "Payment verification failed.",
            errorCode: "VERIFICATION_FAILED",
          };

          navigate(ROUTES.TENANT.PAYMENT_RESULT, { state: failureDetails });
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to initiate checkout. Please try again.",
      );
    } finally {
      setProcessingPlanId(null);
    }
  };
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeHref={ROUTES.TENANT.SUBSCRIPTION}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          user={{
            name: tenant.ownerName,
            role: "Tenant administrator",
            verificationStatus: mapTenantVerificationStatus(tenant.status),
            profile: tenant,
          }}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Subscription plans
          </h1>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Review the available plans for your fund.
          </p>

          <TenantCurrentPlanBanner subscription={currentSubscription} />

          {notice && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {notice}
            </div>
          )}

          {isLoading ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[420px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : error ? (
            <div className="mt-8 flex flex-col items-center rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                Couldn&apos;t load subscription plans
              </h2>
              <p className="mt-2 text-sm text-slate-500">{error}</p>
              <button
                type="button"
                onClick={() => void loadPlans()}
                className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Try again
              </button>
            </div>
          ) : plans.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-center lg:gap-8 lg:py-4">
              {plans.map((plan) => (
                <SubscriptionPlanCard
                  key={plan.id}
                  plan={plan}
                  variant="tenant"
                  icon={PLAN_ICONS[plan.planType]}
                  isCurrentPlan={
                    currentSubscription?.status === "ACTIVE" &&
                    currentSubscription.planId === plan.id
                  }
                  isProcessing={processingPlanId === plan.id}
                  onBuyNow={(selectedPlan) => void handleBuyNow(selectedPlan)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <PackageSearch className="h-6 w-6 text-indigo-500" />
              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No plans available right now
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Please check back later.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
