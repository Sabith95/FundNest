import { Router } from "express";
import {container} from '../../../../infrastructure/container/container'
import { TenantAuthController } from "../../controllers/Tenant/TenantAuthController";
import { ENDPOINTS } from "../../../../shared/constants/endPoints";

const router = Router()
const tenantAuthcontroller = container.resolve(TenantAuthController)

router.post(ENDPOINTS.TENANT.AUTH.REGISTER, tenantAuthcontroller.registerTenant)
router.post(ENDPOINTS.TENANT.AUTH.VERIFY_OTP, tenantAuthcontroller.verifyTenantOtp)
router.post(ENDPOINTS.TENANT.AUTH.RESEND_OTP, tenantAuthcontroller.resendTenantOtp)

export default router