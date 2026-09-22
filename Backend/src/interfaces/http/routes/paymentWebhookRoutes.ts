import { Router } from "express";
import { container } from "../../../infrastructure/container/container";
import { TenantSubscriptionCheckoutController } from "../controllers/Tenant/TenantSubscriptionCheckoutController";

const router = Router();

const checkoutController = container.resolve(
  TenantSubscriptionCheckoutController,
);

router.post("/razorpay/webhook", checkoutController.webhook);

export default router;
