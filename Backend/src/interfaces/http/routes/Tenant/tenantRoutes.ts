import { Router } from "express";
import { container } from '../../../../infrastructure/container/container'
import { TenantAuthController } from "../../controllers/Tenant/TenantAuthController";
import { ENDPOINTS } from "../../../../shared/constants/endPoints";
import { TenantBusinessInfoController } from "../../controllers/Tenant/TenantBusinessInfoController";
import { createAuthMiddleware } from "../../middleware/authenticate";
import { TOKENS } from "../../../../shared/tokens";
import { JwtService } from "../../../../infrastructure/auth/JwtService";
import { TenantKycController } from "../../controllers/Tenant/TenantKycController";
import { authorize } from "../../middleware/authorize";
import { ROLES } from "../../../../shared/constants/roles";
import upload from "../../middleware/upload";
import { TenantBankDetailsController } from "../../controllers/Tenant/TenantBankDetailsController";

const router = Router()
const jwtService = container.resolve(TOKENS.JwtService) as JwtService;
const authenticate = createAuthMiddleware(jwtService);
const tenantAuthcontroller = container.resolve(TenantAuthController)
const tenantBusinessInfoController = container.resolve(TenantBusinessInfoController)
const tenantKycController = container.resolve(TenantKycController)
const tenantBankDetailsController = container.resolve(TenantBankDetailsController)

//tenant registration
router.post(ENDPOINTS.TENANT.AUTH.REGISTER, tenantAuthcontroller.registerTenant)
router.post(ENDPOINTS.TENANT.AUTH.VERIFY_OTP, tenantAuthcontroller.verifyTenantOtp)
router.post(ENDPOINTS.TENANT.AUTH.RESEND_OTP, tenantAuthcontroller.resendTenantOtp)

router.post(ENDPOINTS.TENANT.BUSINESS.BUSINESS_INFO, authenticate, authorize(ROLES.TENANT_ADMIN), tenantBusinessInfoController.updateBusinessInfo)
router.post(ENDPOINTS.TENANT.KYC.KYC_UPLOAD, authenticate,authorize(ROLES.TENANT_ADMIN),upload.fields([
        { name: "businessRegistrationCertificate", maxCount: 1 },
        { name: "ownerIdProof", maxCount: 1 },
        
]),
    tenantKycController.uploadKycDocuments
)

router.post(ENDPOINTS.TENANT.BANKING.BANK_DETAILS,authenticate, authorize(ROLES.TENANT_ADMIN), tenantBankDetailsController.updateBankingDetails)

export default router