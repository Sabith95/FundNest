import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Package,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ShieldCheck,
  X,
} from "lucide-react";
import type { NavItem } from "../../types/nav.types";

// Single source of truth for every sidebar link. These are navigators to
// their respective pages, not standalone components — the pages they point
// to are built separately.
const primaryNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/superadmin/dashboard",
  },
  {
    id: "tenant-management",
    label: "Tenant Management",
    icon: Building2,
    path: "/superadmin/tenants",
  },
  {
    id: "user-management",
    label: "User Management",
    icon: Users,
    path: "/superadmin/users",
  },
  {
    id: "billing",
    label: "Billing & Subscriptions",
    icon: CreditCard,
    path: "/billing",
  },
  { id: "plans", label: "Plans & Pricing", icon: Package, path: "/plans" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics" },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    path: "/notifications",
  },
];

interface SidebarProps {
  /** Controls the slide-in drawer on mobile/tablet. Ignored on desktop (lg+). */
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-600"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:z-0 lg:h-screen lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo / brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-base font-bold text-slate-900">FundNest</p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Super Admin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Primary navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {primaryNavItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={linkClasses}
              onClick={onClose}
              end={item.path === "/"}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer navigation */}
        <div className="shrink-0 space-y-1 border-t border-slate-200 px-3 py-4">
          <NavLink to="/settings" className={linkClasses} onClick={onClose}>
            <Settings className="h-5 w-5 shrink-0" />
            <span className="truncate">Settings</span>
          </NavLink>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="truncate">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
