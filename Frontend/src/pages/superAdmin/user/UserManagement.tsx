import React from "react";
import AdminEntityManager, {
  type Column,
} from "../../../components/admin/AdminEntityManager";
import {
  adminUserService,
  type AdminUser,
} from "../../../services/adminUserService";

type UserRow = AdminUser & { displayName: string };

const UserManagement: React.FC = () => {
  const columns: Column<UserRow>[] = [
    {
      key: "name",
      header: "Name",
      render: (u) => (
        <span className="text-sm font-semibold text-slate-900">{u.name}</span>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (u) => <span className="text-sm text-slate-600">{u.email}</span>,
    },
    {
      key: "phone",
      header: "Phone",
      render: (u) => (
        <span className="text-sm text-slate-600">{u.phone || "—"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (u) => (
        <span
          className={
            u.isActive
              ? "inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
              : "inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700"
          }
        >
          {u.isActive ? "Active" : "Blocked"}
        </span>
      ),
    },
    {
      key: "created",
      header: "Created",
      render: (u) => (
        <span className="text-sm text-slate-500">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <AdminEntityManager<UserRow>
      breadcrumb="Admin / Users"
      title="User Management"
      description="View, search and manage access for every user across all tenants."
      searchPlaceholder="Search by name, email or phone..."
      columns={columns}
      service={{
        getList: (page, pageSize, search) =>
          adminUserService.getUsers(page, pageSize, search).then((r) => ({
            data: r.users.map((u) => ({ ...u, displayName: u.name })),
            total: r.total,
          })),
        updateStatus: (id, isActive) =>
          adminUserService
            .updateStatus(id, isActive)
            .then((u) => ({ ...u, displayName: u.name })),
      }}
    />
  );
};

export default UserManagement;
