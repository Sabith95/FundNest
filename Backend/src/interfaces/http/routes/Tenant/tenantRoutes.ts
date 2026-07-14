import { Router } from "express";
import { container } from '../../../../infrastructure/container/container'
import { TenantAuthController } from "../../controllers/Tenant/TenantAuthController";
import { ENDPOINTS } from "../../../../shared/constants/endPoints";
import { TenantBusinessInfoController } from "../../controllers/Tenant/TenantBusinessInfoController";
import { createAuthMiddleware } from "../../middleware/authenticate";
import { TOKENS } from "../../../../shared/tokens";
import { JwtService } from "../../../../infrastructure/auth/JwtService";

const router = Router()
const jwtService = container.resolve(TOKENS.JwtService) as JwtService;
const authenticate = createAuthMiddleware(jwtService);
const tenantAuthcontroller = container.resolve(TenantAuthController)
const tenantBusinessInfoController = container.resolve(TenantBusinessInfoController)

router.post(ENDPOINTS.TENANT.AUTH.REGISTER, tenantAuthcontroller.registerTenant)
router.post(ENDPOINTS.TENANT.AUTH.VERIFY_OTP, tenantAuthcontroller.verifyTenantOtp)
router.post(ENDPOINTS.TENANT.AUTH.RESEND_OTP, tenantAuthcontroller.resendTenantOtp)

router.post(ENDPOINTS.TENANT.BUSINESS.BUSINESS_INFO, authenticate, tenantBusinessInfoController.updateBusinessInfo)


export default router