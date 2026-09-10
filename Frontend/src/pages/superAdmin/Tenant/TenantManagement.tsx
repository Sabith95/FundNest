import React from "react";
import AdminEntityManager, {
  type Column,
} from "../../../components/admin/AdminEntityManager";
import {
  adminTenantService,
  type AdminTenant,
} from "../../../services/adminTenantService";
import { useNavigate } from "react-router-dom";

type TenantRow = AdminTenant & { displayName: string };

const TenantManagement: React.FC = () => {
  const navigate = useNavigate();

  const columns: Column<TenantRow>[] = [
    {
      key: "company",
      header: "Company",
      render: (t) => (
        <button
          onClick={() => navigate(`/superadmin/tenants/${t.id}`)}
          className="font-semibold text-indigo-600 hover:underline text-left"
        >
          {t.companyName}
        </button>
      ),
    },
    {
      key: "owner",
      header: "Owner",
      render: (t) => (
        <span className="text-sm text-slate-600">{t.ownerName}</span>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (t) => <span className="text-sm text-slate-600">{t.email}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (t) => (
        <span
          className={
            t.isActive
              ? "inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
              : "inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700"
          }
        >
          {t.isActive ? "Active" : "Blocked"}
        </span>
      ),
    },
    {
      key: "verification",
      header: "Verification",
      render: (t) => (
        <span className="text-sm text-slate-600 capitalize">
          {t.verificationStatus.replace(/_/g, " ").toLowerCase()}
        </span>
      ),
    },
    {
      key: "created",
      header: "Created",
      render: (t) => (
        <span className="text-sm text-slate-500">
          {new Date(t.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <AdminEntityManager<TenantRow>
      breadcrumb="Admin / Tenants"
      title="Tenant Management"
      description="Manage access for your tenant organizations."
      searchPlaceholder="Search company, owner, or email..."
      columns={columns}
      service={{
        getList: (page, pageSize, search) =>
          adminTenantService.getTenants(page, pageSize, search).then((r) => ({
            data: r.tenants.map((t) => ({ ...t, displayName: t.companyName })),
            total: r.total,
          })),
        updateStatus: (id, isActive) =>
          adminTenantService
            .updateStatus(id, isActive)
            .then((t) => ({ ...t, displayName: t.companyName })),
      }}
    />
  );
};

export default TenantManagement;
