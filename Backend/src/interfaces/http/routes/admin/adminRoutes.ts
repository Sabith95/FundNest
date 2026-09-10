import { Router } from "express";
import { container } from "tsyringe";
import { AdminTenantController } from "../../controllers/admin/AdminTenantController";
import { createAuthMiddleware } from "../../middleware/authenticate";
import { TOKENS } from "../../../../shared/tokens";
import { IJwtService } from "../../../../infrastructure/auth/interfaces/IJwtService";
import { authorize } from "../../middleware/authorize";
import { ROLES } from "../../../../shared/constants/roles";
import { AdminUserController } from "../../controllers/admin/AdminUserController";
import { ENDPOINTS } from "../../../../shared/constants/endPoints";

const router = Router();
const controller = container.resolve(AdminTenantController);
const adminUserController = container.resolve(AdminUserController);

const authenticate = createAuthMiddleware(
  container.resolve<IJwtService>(TOKENS.JwtService),
);

// tenant routes
router.get(
  ENDPOINTS.SUPER_ADMIN.TENANT.GET_ALL,
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  controller.getAll,
);
router.get(
  ENDPOINTS.SUPER_ADMIN.TENANT.GET_ONE,
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  controller.getOne,
);
router.patch(
  ENDPOINTS.SUPER_ADMIN.TENANT.UPDATE_STATUS,
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  controller.updateStatus,
);

// tenant verification routes
router.patch(
  ENDPOINTS.SUPER_ADMIN.TENANT.VERIFICATION.BUSINESS,
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  controller.verifyBusinessDetails,
);
router.patch(
  ENDPOINTS.SUPER_ADMIN.TENANT.VERIFICATION.KYC,
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  controller.verifyKycDocuments,
);
router.patch(
  ENDPOINTS.SUPER_ADMIN.TENANT.VERIFICATION.BANK,
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  controller.verifyBankDetails,
);
router.post(
  ENDPOINTS.SUPER_ADMIN.TENANT.VERIFICATION.COMPLETE,
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  controller.completeVerification,
);

// user routes

router.get(
  ENDPOINTS.SUPER_ADMIN.USER.GET_ALL,
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  adminUserController.getAll,
);
router.get(
  ENDPOINTS.SUPER_ADMIN.USER.GET_ONE,
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  adminUserController.getOne,
);
router.patch(
  ENDPOINTS.SUPER_ADMIN.USER.UPDATE_STATUS,
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  adminUserController.updateStatus,
);

export default router;
