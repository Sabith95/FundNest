import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import type { TenantUser } from "../../types/tenant.types";

interface HeaderProps {
  user: TenantUser;
  onMenuClick: () => void;
  /** Hide the search bar while the tenant has nothing to search yet */
  disableSearch?: boolean;
}

export default function Header({
  user,
  onMenuClick,
  disableSearch = false,
}: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <div
          className={`relative max-w-md ${
            disableSearch ? "pointer-events-none opacity-40" : ""
          }`}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search funds, members or transactions..."
            disabled={disableSearch}
            className="hidden w-full rounded-lg border border-transparent bg-slate-100 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 sm:block"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <button
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          className="hidden rounded-full p-2 text-slate-500 hover:bg-slate-100 sm:block"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        <div className="ml-1 flex items-center gap-2.5 border-l border-slate-200 pl-3">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-400">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
