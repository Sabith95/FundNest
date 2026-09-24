import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import FundCard from "../../../components/user/fund/FundCard";
import { matchesFilters } from "../../../utitls/fund.utils";
import {
  AMOUNT_OPTIONS,
  DURATION_OPTIONS,
  type IFund,
  type IFundFilters,
} from "../../../types/fund.types";
import { userFundService } from "../../../services/userFundService";

// ─── Icons ────────────────────────────────────────────────
type IconProps = { size?: number; className?: string };
const Svg: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 16,
  className,
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);
// const TrendIcon = (p: IconProps) => (
//   <Svg {...p}>
//     <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
//     <polyline points="16 7 22 7 22 13" />
//   </Svg>
// );
const ChevronIcon = (p: IconProps) => (
  <Svg {...p}>
    <polyline points="6 9 12 15 18 9" />
  </Svg>
);
// const ArrowIcon = (p: IconProps) => (
//   <Svg {...p}>
//     <path d="M5 12h14M12 5l7 7-7 7" />
//   </Svg>
// );
const WalletIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 12V7H5a2 2 0 010-4h14v4" />
    <path d="M3 5v14a2 2 0 002 2h16v-5" />
    <path d="M18 12a2 2 0 000 4h4v-4z" />
  </Svg>
);
const PlusCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8M8 12h8" />
  </Svg>
);
const RefreshCwIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </Svg>
);

// ─── Constants ────────────────────────────────────────────
const DEFAULT_FILTERS: IFundFilters = { amount: "all", duration: "any" };

// const FOOTER_LINKS = {
//   Support: [
//     { label: "How it works", to: "/help/how-it-works" },
//     { label: "Security & Trust", to: "/help/security" },
//     { label: "Risk Disclosure", to: "/help/risk" },
//   ],
//   Connect: [
//     { label: "Global Help Desk", to: "/help/contact" },
//     { label: "Institutional Access", to: "/help/institutional" },
//   ],
// };

const selectClass =
  "w-full appearance-none rounded-xl bg-white py-2.5 pl-4 pr-9 text-sm font-medium text-gray-800 shadow-sm ring-1 ring-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 sm:w-44";
const labelClass =
  "block text-[10px] font-semibold uppercase tracking-widest text-gray-400";
const outlineBtn =
  "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-indigo-700 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 sm:flex-none";

// ─── Page Component ───────────────────────────────────────
const FundsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<IFundFilters>(DEFAULT_FILTERS);
  const [funds, setFunds] = useState<IFund[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFunds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userFundService.getAvailableFunds();
      setFunds(data);
    } catch (err: any) {
      console.error("Failed to load chit funds:", err);
      const msg =
        err.response?.data?.message ||
        "Failed to load chit funds. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFunds();
  }, [fetchFunds]);


  const visibleFunds = useMemo(
    () => funds.filter((f) => matchesFilters(f, filters)),
    [funds, filters],
  );

  const handleJoin = useCallback(
    (fund: IFund) => navigate(`/funds/${fund.id}`),
    [navigate],
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          userName="Alex Sterling"
          userRole="Premium Member"
          notificationCount={1}
        />

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          {/* Title */}
          <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                Available Funds
              </h1>
              <p className="mt-3 text-base leading-relaxed text-gray-600">
                Curated chit fund circles designed for maximum transparency and
                collective growth. Secure your financial future in the sanctuary
                of community capital.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchFunds}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                title="Refresh Funds"
              >
                <RefreshCwIcon
                  size={16}
                  className={loading ? "animate-spin text-indigo-600" : ""}
                />
              </button>
              {/* <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800">
                <TrendIcon size={16} className="text-emerald-600" /> 12.4% Avg
                yield
              </span> */}
            </div>
          </section>

          {/* Filters */}
          <section className="mt-8" aria-label="Filter funds">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex gap-3">
                <div className="min-w-0 flex-1 sm:flex-none">
                  <label htmlFor="amount-filter" className={labelClass}>
                    Amount range
                  </label>
                  <div className="relative mt-1.5">
                    <select
                      id="amount-filter"
                      value={filters.amount}
                      onChange={(e) =>
                        setFilters((p) => ({
                          ...p,
                          amount: e.target.value as IFundFilters["amount"],
                        }))
                      }
                      className={selectClass}
                    >
                      {AMOUNT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <ChevronIcon
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1 sm:flex-none">
                  <label htmlFor="duration-filter" className={labelClass}>
                    Duration
                  </label>
                  <div className="relative mt-1.5">
                    <select
                      id="duration-filter"
                      value={filters.duration}
                      onChange={(e) =>
                        setFilters((p) => ({
                          ...p,
                          duration: e.target.value as IFundFilters["duration"],
                        }))
                      }
                      className={selectClass}
                    >
                      {DURATION_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <ChevronIcon
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/funds/joined")}
                  className={outlineBtn}
                >
                  <WalletIcon size={16} /> Joined Funds
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/funds/suggest")}
                  className={outlineBtn}
                >
                  <PlusCircleIcon size={16} /> Suggest Fund
                </button>
              </div>
            </div>
          </section>

          {/* Grid / Content */}
          <section className="mt-8" aria-live="polite">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-80 animate-pulse rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
                  >
                    <div className="h-4 w-24 rounded bg-gray-200" />
                    <div className="mt-4 h-10 w-10 rounded-xl bg-gray-200" />
                    <div className="mt-4 h-6 w-3/4 rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
                    <div className="mt-6 space-y-3">
                      <div className="h-4 rounded bg-gray-100" />
                      <div className="h-4 rounded bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-red-100">
                <p className="text-lg font-semibold text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={fetchFunds}
                  className="mt-4 rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800"
                >
                  Try Again
                </button>
              </div>
            ) : visibleFunds.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleFunds.map((fund) => (
                  <FundCard key={fund.id} fund={fund} onJoin={handleJoin} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-gray-100">
                <p className="text-lg font-semibold text-gray-900">
                  No funds match these filters
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {funds.length === 0
                    ? "There are currently no active funds with open enrollment slots."
                    : "Try a wider amount or duration range."}
                </p>
                {filters.amount !== "all" || filters.duration !== "any" ? (
                  <button
                    type="button"
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="mt-5 rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800"
                  >
                    Clear filters
                  </button>
                ) : null}
              </div>
            )}
          </section>

          {/* Footer CTA */}
          {/* <footer className="mt-auto pt-16">
            <div className="flex flex-col gap-8 border-t border-gray-200 pt-8 md:flex-row md:justify-between">
              <div className="max-w-sm">
                <h2 className="text-xl font-semibold text-gray-900">
                  Not seeing the right fit?
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Launch your own private fund circle and invite your trusted
                  community to grow together.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/funds/custom")}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-800 hover:underline"
                >
                  Create a custom circle <ArrowIcon size={16} />
                </button>
              </div>

              <nav aria-label="Footer" className="flex gap-12 sm:gap-16">
                {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                  <div key={title}>
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                      {title}
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {links.map((l) => (
                        <li key={l.to}>
                          <button
                            type="button"
                            onClick={() => navigate(l.to)}
                            className="text-left text-sm font-medium text-gray-700 hover:text-indigo-700"
                          >
                            {l.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </footer> */}
        </main>
      </div>
    </div>
  );
};

export default FundsPage;
