import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentResultCard from "../../components/payment/PaymentResultCard";
import type {
  PaymentResult,
  PaymentSuccessDetails,
  PaymentFailureDetails,
} from "../../types/payment.types";
import { ROUTES } from "../../shared/constants";
import { tenantSubscriptionPlanService } from "../../services/tenantSubscriptionService";
import { openRazorpayCheckout } from "../../services/razorpayCheckout";

export default function PaymentResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);

  const result = location.state as PaymentResult | undefined;

  // Guard against direct URL visits with no payment state
  useEffect(() => {
    if (!result) {
      navigate(ROUTES.TENANT.SUBSCRIPTION, { replace: true });
    }
  }, [result, navigate]);

  if (!result) return null;

  const handleGoBack = () => {
    navigate(ROUTES.TENANT.SUBSCRIPTION);
  };

  const handlePrimaryAction = async () => {
    if (result.status === "success") {
      navigate(ROUTES.TENANT.SUBSCRIPTION);
      return;
    }

    if (!result.planId) {
      navigate(ROUTES.TENANT.SUBSCRIPTION);
      return;
    }

    // Retry checkout for the failed plan
    setIsRetrying(true);
    try {
      const checkout = await tenantSubscriptionPlanService.createCheckout(result.planId);
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

      if (checkoutResult.type === "SUCCESS") {
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
          planId: result.planId,
          amount: checkout.amount / 100,
          currency: "₹",
          paidAt: new Date().toISOString(),
        };

        navigate(ROUTES.TENANT.PAYMENT_RESULT, {
          state: successDetails,
          replace: true,
        });
      } else if (checkoutResult.type === "FAILED") {
        const failureDetails: PaymentFailureDetails = {
          status: "failed",
          planName: checkout.planName,
          planId: result.planId,
          amount: checkout.amount / 100,
          currency: "₹",
          reason: checkoutResult.error.description || "Payment retry failed.",
          errorCode: checkoutResult.error.code,
        };

        navigate(ROUTES.TENANT.PAYMENT_RESULT, {
          state: failureDetails,
          replace: true,
        });
      }
    } catch (err) {
      const failureDetails: PaymentFailureDetails = {
        status: "failed",
        planName: result.planName,
        planId: result.planId,
        amount: result.amount,
        currency: result.currency ?? "₹",
        reason: err instanceof Error ? err.message : "Unable to initiate payment retry.",
      };

      navigate(ROUTES.TENANT.PAYMENT_RESULT, {
        state: failureDetails,
        replace: true,
      });
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <PaymentResultCard
        result={result}
        onPrimaryAction={handlePrimaryAction}
        onGoBack={handleGoBack}
        isRetrying={isRetrying}
      />
    </div>
  );
}