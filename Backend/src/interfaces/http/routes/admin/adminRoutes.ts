import { Router } from "express";
import { container } from "tsyringe";
import { AdminTenantController } from "../../controllers/admin/AdminTenantController";
import { createAuthMiddleware } from "../../middleware/authenticate";
import { TOKENS } from "../../../../shared/tokens";
import { IJwtService } from "../../../../infrastructure/auth/interfaces/IJwtService";
import { authorize } from "../../middleware/authorize";
import { ROLES } from "../../../../shared/constants/roles";

const router = Router();
const controller = container.resolve(AdminTenantController);
const authenticate = createAuthMiddleware(container.resolve<IJwtService>(TOKENS.JwtService));
router.get("/tenants", authenticate, authorize(ROLES.SUPER_ADMIN), controller.getAll);
router.get("/tenants/:id", authenticate, authorize(ROLES.SUPER_ADMIN), controller.getOne);
router.patch("/tenants/:id/status", authenticate, authorize(ROLES.SUPER_ADMIN), controller.updateStatus);
export default router;
