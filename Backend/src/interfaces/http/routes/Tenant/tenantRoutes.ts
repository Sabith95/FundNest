import { Router } from "express";
import { container } from "../../../../infrastructure/container/container";
import { TenantAuthController } from "../../controllers/Tenant/TenantAuthController";
import { ENDPOINTS } from "../../../../shared/constants/endPoints";
import { TenantBusinessInfoController } from "../../controllers/Tenant/TenantBusinessInfoController";
import { createAuthMiddleware } from "../../middleware/authenticate";
import { TOKENS } from "../../../../shared/tokens";
import { JwtService } from "../../../../infrastructure/auth/JwtService";
import { TenantKycController } from "../../controllers/Tenant/TenantKycController";
import { authorize } from "../../middleware/authorize";
import { ROLES } from "../../../../shared/constants/roles";
import { TenantBankDetailsController } from "../../controllers/Tenant/TenantBankDetailsController";
import { TenantSubscriptionPlanController } from "../../controllers/Tenant/TenantSubscriptionPlanController";
import { TenantSubscriptionCheckoutController } from "../../controllers/Tenant/TenantSubscriptionCheckoutController";
import { TenantChitFundController } from "../../controllers/Tenant/TenantChitFundController";
import { TenantKycConfigController } from "../../controllers/Tenant/TenantKycConfigController";

const router = Router();
const jwtService = container.resolve(TOKENS.JwtService) as JwtService;
const authenticate = createAuthMiddleware(jwtService);
const tenantAuthcontroller = container.resolve(TenantAuthController);
const tenantBusinessInfoController = container.resolve(
  TenantBusinessInfoController,
);
const tenantKycController = container.resolve(TenantKycController);
const tenantBankDetailsController = container.resolve(
  TenantBankDetailsController,
);
const tenantSubscriptionPlanController = container.resolve(
  TenantSubscriptionPlanController,
);
const tenantSubscriptionCheckoutController = container.resolve(
  TenantSubscriptionCheckoutController,
);
const tenantChitFundController = container.resolve(TenantChitFundController);
const tenantKycConfigController = container.resolve(TenantKycConfigController);

//tenant registration
router.post(
  ENDPOINTS.TENANT.AUTH.REGISTER,
  tenantAuthcontroller.registerTenant,
);
router.post(
  ENDPOINTS.TENANT.AUTH.VERIFY_OTP,
  tenantAuthcontroller.verifyTenantOtp,
);
router.post(
  ENDPOINTS.TENANT.AUTH.RESEND_OTP,
  tenantAuthcontroller.resendTenantOtp,
);
router.post(ENDPOINTS.TENANT.AUTH.LOGIN, tenantAuthcontroller.loginTenant);
router.get(
  ENDPOINTS.TENANT.PROFILE.GET,
  authenticate,
  authorize(ROLES.TENANT_ADMIN),
  tenantAuthcontroller.getProfile,
);

router.post(
  ENDPOINTS.TENANT.BUSINESS.BUSINESS_INFO,
  authenticate,
  authorize(ROLES.TENANT_ADMIN),
  tenantBusinessInfoController.updateBusinessInfo,
);

router.post(
  ENDPOINTS.TENANT.KYC.KYC_UPLOAD,
  authenticate,
  authorize(ROLES.TENANT_ADMIN),
  tenantKycController.uploadKycDocuments,
);

router.post(
  ENDPOINTS.TENANT.BANKING.BANK_DETAILS,
  authenticate,
  authorize(ROLES.TENANT_ADMIN),
  tenantBankDetailsController.updateBankingDetails,
);

// tenant forgot password
router.post(
  ENDPOINTS.TENANT.PASSWORD.SEND_OTP,
  tenantAuthcontroller.requestPasswordResetOtp,
);
router.post(
  ENDPOINTS.TENANT.PASSWORD.RESEND_OTP,
  tenantAuthcontroller.requestPasswordResetOtp,
);
router.post(
  ENDPOINTS.TENANT.PASSWORD.VERIFY_OTP,
  tenantAuthcontroller.verifyPasswordResetOtp,
);
router.post(
  ENDPOINTS.TENANT.PASSWORD.RESET,
  tenantAuthcontroller.resetPassword,
);

// tenant subscription
router.get(
  ENDPOINTS.TENANT.SUBSCRIPTION_PLAN.GET_AVAILABLE,
  authenticate,
  authorize(ROLES.TENANT_ADMIN),
  tenantSubscriptionPlanController.getAvailable,
);
router.post(
  ENDPOINTS.TENANT.SUBSCRIPTION_PLAN.CREATE_CHECKOUT,
  authenticate,
  authorize(ROLES.TENANT_ADMIN),
  tenantSubscriptionCheckoutController.createCheckout,
);

router.post(
  ENDPOINTS.TENANT.SUBSCRIPTION_PLAN.VERIFY_CHECKOUT,
  authenticate,
  authorize(ROLES.TENANT_ADMIN),
  tenantSubscriptionCheckoutController.verifyCheckout,
);

router.get(
  ENDPOINTS.TENANT.SUBSCRIPTION_PLAN.CURRENT,
  authenticate,
  authorize(ROLES.TENANT_ADMIN),
  tenantSubscriptionCheckoutController.getCurrent,
);

// tenant chit funds
router.get(
  ENDPOINTS.TENANT.CHIT_FUND.GET_ALL,
  authenticate,
  authorize(ROLES.TENANT_ADMIN),
  tenantChitFundController.getAll,
);
router.post(
  ENDPOINTS.TENANT.CHIT_FUND.CREATE_NORMAL,
  authenticate,
  authorize(ROLES.TENANT_ADMIN),
  tenantChitFundController.createNormal,
);
router.post(
  ENDPOINTS.TENANT.CHIT_FUND.CREATE_MULTI_DIVISION,
  authenticate,
  authorize(ROLES.TENANT_ADMIN),
  tenantChitFundController.createMultiDivision,
);
router.patch(
  ENDPOINTS.TENANT.CHIT_FUND.BLOCK,
  authenticate,
  authorize(ROLES.TENANT_ADMIN),
  tenantChitFundController.block,
);
router.patch(
  ENDPOINTS.TENANT.CHIT_FUND.UNBLOCK,
  authenticate,
  authorize(ROLES.TENANT_ADMIN),
  tenantChitFundController.unblock,
);

// kyc configuration

// Tenant KYC Configuration
router.get(
  ENDPOINTS.TENANT.KYC_CONFIG.GET,
  authenticate,
  authorize(ROLES.TENANT_ADMIN),
  tenantKycConfigController.getTemplate,
);

router.put(
  ENDPOINTS.TENANT.KYC_CONFIG.CONFIGURE,
  authenticate,
  authorize(ROLES.TENANT_ADMIN),
  tenantKycConfigController.configureTemplate,
);

export default router;
