import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import TenantDashboardLayout from "../Dashboard/TenantDashboardlayout";
import FundPage from "../../fund/FundPage";
import { ROUTES } from "../../../shared/constants";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { mapTenantVerificationStatus } from "../../../utitls/tenantRouting";
import { tenantAuthService } from "../../../services/tenantAuthService";
import { setTenant } from "../../../store/slices/tenantSlice";

export default function TenantFundPageContainer() {
  const dispatch = useAppDispatch();
  const tenant = useAppSelector((state) => state.tenant.tenant);

  useEffect(() => {
    if (!tenant) {
      tenantAuthService
        .getTenantProfile()
        .then((data) => {
          dispatch(setTenant(data));
        })
        .catch((err) => {
          console.error("Failed to fetch tenant profile:", err);
        });
    }
  }, [dispatch, tenant]);

  if (!tenant) return <Navigate to={ROUTES.TENANT.LOGIN} replace />;

  const tenantUser = {
    name: tenant.ownerName || tenant.companyName,
    role: "Tenant Administrator",
    verificationStatus: mapTenantVerificationStatus(tenant.status),
    rejectionReason: tenant.rejectionReason,
    profile: tenant,
  };

  return (
    <TenantDashboardLayout user={tenantUser} activeHref={ROUTES.TENANT.FUND}>
      <FundPage user={tenantUser} />
    </TenantDashboardLayout>
  );
}
