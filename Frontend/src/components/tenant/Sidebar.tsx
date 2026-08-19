import {
  LayoutGrid,
  Users,
  Wallet,
  Package,
  CreditCard,
  ArrowLeftRight,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import type { NavItem } from "../../types/tenant.types";

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "User Management", href: "/users", icon: Users },
  { label: "Fund", href: "/fund", icon: Wallet },
  { label: "Lot Management", href: "/lots", icon: Package },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Wallet and Transaction", href: "/wallet", icon: ArrowLeftRight },
  { label: "Notification", href: "/notifications", icon: Bell },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

interface SidebarProps {
  activeHref: string;
  isOpen: boolean;
  onClose: () => void;
  /** Disable navigation while the tenant is not yet verified */
  disabled?: boolean;
}

export default function Sidebar({
  activeHref,
  isOpen,
  onClose,
  disabled = false,
}: SidebarProps) {
  return (
    <>
      {/* Mobile scrim */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 transform flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-out lg:static lg:z-0 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 pb-5 pt-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-base">
              🐣
            </div>
            <div className="leading-tight">
              <p className="text-lg font-bold tracking-tight text-slate-900">
                FundNest
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Tenant Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav
          className={`flex-1 space-y-1 overflow-y-auto px-3 ${
            disabled ? "pointer-events-none opacity-40" : ""
          }`}
          aria-disabled={disabled}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === activeHref;
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 ${
                    isActive ? "text-indigo-600" : "text-slate-400"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="space-y-1 border-t border-slate-100 px-3 py-4">
          <a
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          >
            <Settings className="h-[18px] w-[18px] text-slate-400" />
            Settings
          </a>
          <a
            href="/logout"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </a>
        </div>
      </aside>
    </>
  );
}