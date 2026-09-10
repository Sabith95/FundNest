import { Request, Response, Router } from "express";
import { ApiResponse } from "../../../shared/ApiResponse";
import { env } from "../../../infrastructure/config/env";
import authRoutes from "./auth/authRoutes";
import userRoutes from "../routes/user/userRoutes";
import tenantRoutes from "../routes/Tenant/tenantRoutes";
import adminRoutes from "./admin/adminRoutes";
import storageRoutes from "./storage/storageRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/tenants", tenantRoutes);
router.use("/admin", adminRoutes);
router.use("/storage", storageRoutes);

// Health check

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json(
    ApiResponse.success(
      {
        status: "healthy",
        timeStamp: new Date().toISOString(),
        upTime: `${Math.floor(process.uptime())}`,
        enviornment: env.NODE_ENV,
      },
      "FundNest Api is running",
    ),
  );
});

export default router;
