import React from "react";
import { Menu, Search, Bell, HelpCircle } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  adminName?: string;
  adminRole?: string;
  avatarUrl?: string;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  adminName = "Alex Thompson",
  adminRole = "Super Admin",
  avatarUrl,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative hidden flex-1 max-w-md sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search tenants, users or transactions..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Mobile search icon only */}
      <button
        type="button"
        className="ml-auto rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 sm:hidden"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>

      <div className="ml-auto hidden items-center gap-1 sm:flex">
        <button
          type="button"
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </div>

      {/* Divider */}
      <div className="hidden h-8 w-px bg-slate-200 sm:block" />

      {/* Admin profile */}
      <div className="flex items-center gap-2.5 pl-1">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={adminName}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
            {adminName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        )}
        <div className="hidden leading-tight sm:block">
          <p className="text-sm font-semibold text-slate-900">{adminName}</p>
          <p className="text-xs text-slate-400">{adminRole}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;