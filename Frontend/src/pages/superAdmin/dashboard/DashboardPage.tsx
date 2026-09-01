import React, { useState } from "react";
import { Building2, Users, CreditCard, AlertTriangle } from "lucide-react";
import Sidebar from "../../../components/admin/Sidebar"
import Header from "../../../components/admin/Header"

interface StatCard {
  id: string;
  label: string;
  value: string;
  helperText: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const stats: StatCard[] = [
  {
    id: "tenants",
    label: "Total Tenants",
    value: "48",
    helperText: "42 active organizations",
    icon: Building2,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    id: "users",
    label: "Total Users",
    value: "3,214",
    helperText: "Across all tenants",
    icon: Users,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    id: "subscriptions",
    label: "Active Subscriptions",
    value: "39",
    helperText: "On paid plans",
    icon: CreditCard,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  {
    id: "pending",
    label: "Pending Approvals",
    value: "6",
    helperText: "Tenant sign-ups waiting",
    icon: AlertTriangle,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Reusable sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex min-h-screen w-full flex-1 flex-col">
        {/* Reusable header */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Page header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Dashboard Overview</h1>
              <p className="mt-1 text-sm text-slate-500">
                Monitor tenants, users and platform activity from one place.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <UserPlus className="h-4 w-4" />
                Add User
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                <Building className="h-4 w-4" />
                Add Tenant
              </button> */}
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </span>
                </div>
                <p className="mt-4 text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-400">
                  {stat.helperText}
                </p>
              </div>
            ))}
          </div>

          {/*
            Charts, System Overview and Recent Activity sections intentionally
            omitted — to be added separately.
          */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;