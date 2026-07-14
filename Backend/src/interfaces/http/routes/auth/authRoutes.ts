import { Router } from "express";
import { container } from "../../../../infrastructure/container/container";
import { AuthController } from "../../controllers/auth/AuthController";
import { ENDPOINTS } from "../../../../shared/constants/endPoints";

const router = Router();
const authController = container.resolve(AuthController);

// super admin login
router.post(ENDPOINTS.SUPER_ADMIN.AUTH.LOGIN, authController.loginSuperAdmin);
router.post(ENDPOINTS.SUPER_ADMIN.SESSION.REFRESH_TOKEN, authController.refreshSuperAdminToken);
router.post(ENDPOINTS.SUPER_ADMIN.SESSION.LOGOUT, authController.logoutSuperAdmin);
router.post(ENDPOINTS.USER.SESSION.REFRESH_TOKEN, authController.refreshUserToken);
router.post(ENDPOINTS.USER.SESSION.LOGOUT, authController.logoutUser);
router.post(ENDPOINTS.TENANT.SESSION.REFRESH_TOKEN, authController.refreshTenantToken)
router.post(ENDPOINTS.TENANT.SESSION.LOGOUT, authController.logoutTenant)


export default router;
