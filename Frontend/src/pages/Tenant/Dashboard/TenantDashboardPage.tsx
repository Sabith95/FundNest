import { Navigate } from "react-router-dom";
import TenantDashboardLayout from "./TenantDashboardlayout";
// import { getTenantSession } from "../../../services/tenantSession";
import { ROUTES } from "../../../shared/constants";
import { useAppSelector } from "../../../store/hooks";
import { mapTenantVerificationStatus } from "../../../utitls/tenantRouting";

export default function TenantDashboardPage() {
  // const tenant = getTenantSession();
  const tenant = useAppSelector((state) => state.tenant.tenant)
  if (!tenant) return <Navigate to={ROUTES.TENANT.LOGIN} replace />;

  return (
    <TenantDashboardLayout
      user={{
        name: tenant.ownerName,
        role: "Tenant administrator",
        verificationStatus: mapTenantVerificationStatus(tenant.status)
      }}
    >
      <div className="p-6">Your tenant dashboard is ready.</div>
    </TenantDashboardLayout>
  );
}