import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { ROUTES } from "../../shared/constants";

/**
 * Shared FundNest header.
 *
 * Used by the Main, Tenant, and User landing pages so navigation stays
 * identical everywhere. "Register" and "Login" are role pickers, not
 * direct links: each opens a small menu, and picking a role sends the
 * visitor straight to that role's register/login page.
 *
 * NOTE: this assumes the following keys exist on ROUTES (see
 * shared/constants.ts). Add whichever of these are missing in your project:
 *   ROUTES.COMMON.LANDING          -> "/"
 *   ROUTES.COMMON.PRICING          -> "/pricing"
 *   ROUTES.COMMON.TENANT_LANDING   -> "/tenant"
 *   ROUTES.COMMON.USER_LANDING     -> "/user"
 *   ROUTES.TENANT.REGISTER / LOGIN -> already present
 *   ROUTES.USER.REGISTER / LOGIN   -> new
 *   ROUTES.ADMIN.LOGIN             -> new
 */

export type ActivePage = "main" | "pricing" | "tenant" | "user";

interface HeaderProps {
  active?: ActivePage;
}

type MenuKey = "register" | "login" | null;

const REGISTER_OPTIONS = [
  {
    label: "As a Tenant",
    description: "Run and manage your own chit funds",
    href: ROUTES.TENANT.REGISTER,
  },
  {
    label: "As a User",
    description: "Join funds and bid in auctions",
    href: ROUTES.USER.REGISTER,
  },
];

const LOGIN_OPTIONS = [
  { label: "Tenant", href: ROUTES.TENANT.LOGIN },
  { label: "User", href: ROUTES.USER.LOGIN },
  { label: "Admin", href: ROUTES.SUPER_ADMIN.LOGIN },
];

const ACTIVE_LINK = "border-b-2 border-indigo-600 pb-1 text-sm font-medium text-indigo-600";
const INACTIVE_LINK = "text-sm font-medium text-slate-600 hover:text-slate-900";
const TRIGGER = "flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900";

const Header: React.FC<HeaderProps> = ({ active = "main" }) => {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const toggleMenu = (key: Exclude<MenuKey, null>) =>
    setOpenMenu((prev) => (prev === key ? null : key));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href={ROUTES.COMMON.LANDING} className="flex items-center gap-2">
          <span className="text-xl">🥥</span>
          <span className="text-lg font-bold text-slate-900">FundNest</span>
        </a>

        {/* Desktop nav */}
        <nav ref={navRef} className="hidden items-center gap-8 md:flex">
          <a href={ROUTES.COMMON.LANDING} className={active === "main" ? ACTIVE_LINK : INACTIVE_LINK}>
            Home
          </a>
          <a href={ROUTES.COMMON.PRICING} className={active === "pricing" ? ACTIVE_LINK : INACTIVE_LINK}>
            Pricing
          </a>

          {/* Register dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu("register")}
              aria-haspopup="menu"
              aria-expanded={openMenu === "register"}
              className={TRIGGER}
            >
              Register
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${openMenu === "register" ? "rotate-180" : ""}`}
              />
            </button>
            {openMenu === "register" && (
              <div
                role="menu"
                className="absolute left-1/2 top-full mt-3 w-64 -translate-x-1/2 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl"
              >
                {REGISTER_OPTIONS.map((opt) => (
                  <a
                    key={opt.label}
                    href={opt.href}
                    role="menuitem"
                    className="block rounded-xl px-3 py-2.5 transition hover:bg-slate-50"
                  >
                    <p className="text-sm font-semibold text-slate-900">{opt.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{opt.description}</p>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Login dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu("login")}
              aria-haspopup="menu"
              aria-expanded={openMenu === "login"}
              className={TRIGGER}
            >
              Login
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${openMenu === "login" ? "rotate-180" : ""}`}
              />
            </button>
            {openMenu === "login" && (
              <div
                role="menu"
                className="absolute left-1/2 top-full mt-3 w-44 -translate-x-1/2 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl"
              >
                {LOGIN_OPTIONS.map((opt) => (
                  <a
                    key={opt.label}
                    href={opt.href}
                    role="menuitem"
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    {opt.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-50 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="space-y-5 border-t border-slate-100 bg-white px-4 py-5 md:hidden">
          <div className="flex flex-col gap-3">
            <a href={ROUTES.COMMON.LANDING} className="text-sm font-medium text-slate-700">
              Home
            </a>
            <a href={ROUTES.COMMON.PRICING} className="text-sm font-medium text-slate-700">
              Pricing
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Register</p>
            <div className="mt-2 flex flex-col gap-1">
              {REGISTER_OPTIONS.map((opt) => (
                <a
                  key={opt.label}
                  href={opt.href}
                  className="rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {opt.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Login</p>
            <div className="mt-2 flex flex-col gap-1">
              {LOGIN_OPTIONS.map((opt) => (
                <a
                  key={opt.label}
                  href={opt.href}
                  className="rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {opt.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;