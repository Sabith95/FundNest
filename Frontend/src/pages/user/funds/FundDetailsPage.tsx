import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import {
  userFundService,
  type IFundFullDetailsResponse,
  type IFundTenantDetails,
  type IFundJoinStatusResponse,
} from "../../../services/userFundService";
import { formatCurrency } from "../../../utitls/fund.utils";
import { useAppSelector } from "../../../store/hooks";
import { openRazorpayCheckout } from "../../../services/razorpayCheckout";

// ─── Types ────────────────────────────────────────────────
type FundStatus = "active" | "upcoming" | "closed";

interface IStep {
  id: string;
  title: string;
  description: string;
}

// ─── Icons (static, hoisted) ──────────────────────────────
const svgBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

const ArrowLeftIcon = () => (
  <svg width="14" height="14" {...svgBase}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="18" height="18" {...svgBase}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const UsersIcon = () => (
  <svg width="14" height="14" {...svgBase}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" {...svgBase}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const AwardIcon = () => (
  <svg width="14" height="14" {...svgBase}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.48 12.89L17 22l-5-3-5 3 1.52-9.11" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" {...svgBase}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="8 12 11 15 16 9" />
  </svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" {...svgBase}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const TrendDownIcon = () => (
  <svg width="18" height="18" {...svgBase}>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

// const ClockIcon = () => (
//   <svg width="20" height="20" {...svgBase}>
//     <circle cx="12" cy="12" r="10" />
//     <polyline points="12 6 12 12 16 14" />
//   </svg>
// );

// const GavelIcon = () => (
//   <svg width="20" height="20" {...svgBase}>
//     <path d="M14 13l-8.5 8.5a2.12 2.12 0 01-3-3L11 10" />
//     <path d="M16 16l6-6" />
//     <path d="M8 8l6-6" />
//     <path d="M9 7l8 8" />
//     <path d="M21 11l-8-8" />
//   </svg>
// );

const BuildingIcon = () => (
  <svg width="18" height="18" {...svgBase}>
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <line x1="8" y1="6" x2="8.01" y2="6" />
    <line x1="16" y1="6" x2="16.01" y2="6" />
    <line x1="12" y1="6" x2="12.01" y2="6" />
    <line x1="12" y1="10" x2="12.01" y2="10" />
    <line x1="12" y1="14" x2="12.01" y2="14" />
    <line x1="16" y1="10" x2="16.01" y2="10" />
    <line x1="16" y1="14" x2="16.01" y2="14" />
    <line x1="8" y1="10" x2="8.01" y2="10" />
    <line x1="8" y1="14" x2="8.01" y2="14" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="18" height="18" {...svgBase}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

// ─── Constants ────────────────────────────────────────────
const STATUS_STYLES: Record<
  FundStatus,
  { label: string; cls: string; dot: string }
> = {
  active: {
    label: "Active Status",
    cls: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  upcoming: {
    label: "Upcoming",
    cls: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  closed: {
    label: "Closed",
    cls: "bg-gray-100 text-gray-600",
    dot: "bg-gray-400",
  },
};

// const RULE_TONES: Record<IRule["tone"], string> = {
//   blue: "bg-blue-50 text-[#006590]",
//   green: "bg-emerald-50 text-emerald-700",
//   red: "bg-red-50 text-red-600",
// };

// const RULES: IRule[] = [
//   {
//     id: "deadlines",
//     title: "Payment Deadlines",
//     description:
//       "Contributions must be initiated by the 5th of every month. A 48-hour grace period is granted before late charges are applied.",
//     tone: "blue",
//     icon: <ClockIcon />,
//   },
//   {
//     id: "withdrawal",
//     title: "Withdrawal Policy",
//     description:
//       "Premature exits are subject to standard scheme exit procedures. Foreclosed amounts are settled according to state chit fund regulations.",
//     tone: "green",
//     icon: <GavelIcon />,
//   },
//   {
//     id: "penalties",
//     title: "Auction & Bidding Rules",
//     description:
//       "Discount bidding happens on designated monthly draw dates. Each participant can successfully win the pooled capital only once per cycle.",
//     tone: "red",
//     icon: <InfoIcon />,
//   },
// ];

// ─── Helpers ──────────────────────────────────────────────
const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const clampPercent = (value: number, total: number): number =>
  total > 0 ? Math.min(100, Math.max(0, (value / total) * 100)) : 0;

// ─── Small shared pieces ──────────────────────────────────
interface IProgressBarProps {
  percent: number;
  label: string;
  className?: string;
}

const ProgressBar = memo(
  ({ percent, label, className = "" }: IProgressBarProps) => (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      className={`h-1.5 rounded-full bg-gray-200 overflow-hidden ${className}`}
    >
      <div
        className="h-full rounded-full bg-[#006590]"
        style={{ width: `${percent}%` }}
      />
    </div>
  ),
);
ProgressBar.displayName = "ProgressBar";

const SectionTitle = memo(({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-4">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 whitespace-nowrap">
      {children}
    </h2>
    <div className="h-px flex-1 bg-gray-100" />
  </div>
));
SectionTitle.displayName = "SectionTitle";

// ─── Hero Section ─────────────────────────────────────────
interface IHeroProps {
  name: string;
  fundType: "NORMAL" | "MULTI_DIVISION";
  status: FundStatus;
  membersJoined: number;
  totalMembers: number;
  auctionsPerMonth: number;
  winnersPerCycle: number;
  joinStatus: IFundJoinStatusResponse | null;
  contributionAmount: number;
  isPaying: boolean;
  onBack: () => void;
  onJoinKyc: () => void;
  onPayInitial: () => void;
  onReuploadKyc: () => void;
}

const FundHero = memo(
  ({
    name,
    fundType,
    status,
    membersJoined,
    totalMembers,
    auctionsPerMonth,
    winnersPerCycle,
    joinStatus,
    contributionAmount,
    isPaying,
    onBack,
    onJoinKyc,
    onPayInitial,
    onReuploadKyc,
  }: IHeroProps) => {
    const statusStyle = STATUS_STYLES[status];
    const slotsLeft = Math.max(0, totalMembers - membersJoined);
    const filled = clampPercent(membersJoined, totalMembers);
    const isFundOpen = status !== "closed" && slotsLeft > 0;

    const requestStatus = joinStatus?.status || "NONE";
    const isEnrolled = joinStatus?.isEnrolled || requestStatus === "COMPLETED";

    return (
      <section
        aria-labelledby="fund-title"
        className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"
      >
        <div className="min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#006590] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006590] rounded"
          >
            <ArrowLeftIcon /> Back to Funds
          </button>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1
              id="fund-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900"
            >
              {name}
            </h1>
            <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#0a7fc2]">
              {fundType === "MULTI_DIVISION"
                ? "Multi Division Fund"
                : "Standard Chit Fund"}
            </span>

            {isEnrolled && (
              <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs sm:text-sm font-bold text-emerald-700">
                Active Member · Slot #{joinStatus?.slotNumber}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${statusStyle.cls}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
              {statusStyle.label}
            </span>

            <span className="inline-flex items-center gap-1.5 text-sm sm:text-base text-gray-700">
              <UsersIcon />
              {membersJoined}/{totalMembers} Members Joined
            </span>

            <ProgressBar
              percent={filled}
              label="Member slots filled"
              className="w-24 sm:w-28"
            />

            {slotsLeft > 0 && !isEnrolled && (
              <span className="text-[11px] font-bold uppercase text-red-600">
                {slotsLeft} Slots Left
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-semibold text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon /> {auctionsPerMonth} Auction
              {auctionsPerMonth > 1 ? "s" : ""} per Month
            </span>
            <span className="inline-flex items-center gap-1.5">
              <AwardIcon /> {winnersPerCycle} Winner
              {winnersPerCycle > 1 ? "s" : ""} per Cycle
            </span>
          </div>
        </div>

        {/* Dynamic CTA according to KYC / Request Status */}
        <div className="flex w-full flex-col gap-3 lg:w-72 xl:w-80 lg:flex-shrink-0">
          {/* Status Alert Banners */}
          {requestStatus === "PENDING_VERIFICATION" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">
              <div className="flex items-center gap-2">
                <InfoIcon />
                <span>Verification in Progress</span>
              </div>
              <p className="mt-1 font-normal text-[11px] text-amber-700">
                The organizer is reviewing your KYC documents. You'll receive an email once approved.
              </p>
            </div>
          )}

          {requestStatus === "REJECTED" && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">
              <span className="block font-bold">KYC Rejected by Organizer:</span>
              <p className="mt-1 text-[11px] text-rose-700">
                {joinStatus?.rejectionReason || "Please re-upload clearer documents."}
              </p>
            </div>
          )}

          {requestStatus === "APPROVED" && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
              <div className="flex items-center gap-1.5">
                <CheckCircleIcon />
                <span>KYC Approved!</span>
              </div>
              <p className="mt-1 font-normal text-[11px] text-emerald-700">
                Complete the initial payment of {formatCurrency(contributionAmount)} to secure your seat.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {isEnrolled ? (
            <div className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3.5 text-white font-bold shadow-sm">
              <span className="inline-flex items-center gap-2">
                ✓ Member Enrolled (Slot #{joinStatus?.slotNumber})
              </span>
            </div>
          ) : requestStatus === "PENDING_VERIFICATION" ? (
            <button
              type="button"
              disabled
              className="flex w-full items-center justify-center rounded-xl bg-amber-500 px-5 py-3 text-white font-bold opacity-80 cursor-not-allowed shadow-sm text-sm"
            >
              Awaiting KYC Approval
            </button>
          ) : requestStatus === "REJECTED" ? (
            <button
              type="button"
              onClick={onReuploadKyc}
              className="flex w-full items-center justify-center rounded-xl bg-rose-600 px-5 py-3 text-white font-bold shadow-sm hover:bg-rose-700 transition text-sm gap-2"
            >
              Fix &amp; Re-upload KYC <ArrowRightIcon />
            </button>
          ) : requestStatus === "APPROVED" ? (
            <button
              type="button"
              onClick={onPayInitial}
              disabled={!isFundOpen || isPaying}
              className="flex w-full flex-col items-center justify-center rounded-xl bg-[#0a8fe0] px-5 py-3 text-white shadow-sm transition hover:bg-[#0980c8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="inline-flex items-center gap-2 text-base font-bold">
                {isPaying ? "Processing..." : `Pay ${formatCurrency(contributionAmount)} & Join`}
                <ArrowRightIcon />
              </span>
              <span className="text-[10px] font-medium text-white/80">
                Razorpay Secure Checkout
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onJoinKyc}
              disabled={!isFundOpen}
              className="flex w-full flex-col items-center justify-center rounded-xl bg-[#0a8fe0] px-5 py-3 text-white shadow-sm transition hover:bg-[#0980c8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="inline-flex items-center gap-2 text-base font-bold">
                Proceed to Join <ArrowRightIcon />
              </span>
              <span className="text-[10px] font-medium text-white/80">
                Complete Organizer KYC
              </span>
            </button>
          )}
        </div>
      </section>
    );
  },
);
FundHero.displayName = "FundHero";

// ─── Highlights Bar ───────────────────────────────────────
const HighlightsBar = memo(({ items }: { items: string[] }) => {
  if (!items || items.length === 0) return null;

  return (
    <section
      aria-label="Fund highlights"
      className="flex flex-col gap-3 border-y border-gray-100 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8"
    >
      <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-800">
        Fund Highlights
      </h2>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-800"
          >
            <span className="text-[#006590]">
              <CheckCircleIcon />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
});
HighlightsBar.displayName = "HighlightsBar";

// ─── Contribution & Financial Card ────────────────────────
interface IContributionCardProps {
  monthlyContribution: number;
  totalPool: number;
  durationMonths: number;
  startDate: string;
  isMultiDivision: boolean;
  description?: string;
}

const ContributionCard = memo(
  ({
    monthlyContribution,
    totalPool,
    durationMonths,
    startDate,
    isMultiDivision,
    description,
  }: IContributionCardProps) => {
    return (
      <section
        aria-label="Contribution summary"
        className="w-full rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-gray-600">
              Monthly Contribution
            </p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight text-[#006590] sm:text-5xl">
              {formatCurrency(monthlyContribution)}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-gray-600">
              Total Pool Value
            </p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 sm:text-3xl">
              {formatCurrency(totalPool)}
            </p>
          </div>
        </div>

        {description && (
          <p className="mt-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
            {description}
          </p>
        )}

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#0a7fc2]">
            <TrendDownIcon />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#0b4f7a]">
              {isMultiDivision
                ? "Accelerated Multi-Division Payout"
                : "Discount-based Dividend Model"}
            </p>
            <p className="text-[11px] text-[#0a7fc2]">
              {isMultiDivision
                ? "Multiple winners selected each cycle to drastically minimize wait times."
                : "Monthly discount dividends distributed directly to participants to lower effective contributions."}
            </p>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#0a7fc2]">
            Chit Logic
          </span>
        </div>

        <div className="mt-4 rounded-2xl bg-gray-100 p-4 sm:p-5">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="min-w-[180px] flex-1">
              <p className="text-xs font-semibold uppercase text-gray-700">
                Scheme Duration
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {durationMonths} Months
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Fixed cycle commitment
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-700">
                Commencement Date
              </p>
              <p className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">
                {formatDate(startDate)}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  },
);
ContributionCard.displayName = "ContributionCard";

// ─── Tenant & Organizer Business Details ──────────────────
const TenantBusinessDetails = memo(
  ({ tenant }: { tenant: IFundTenantDetails }) => {
    return (
      <section
        aria-labelledby="organizer-title"
        className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2
                id="organizer-title"
                className="text-xl sm:text-2xl font-bold text-gray-900"
              >
                {tenant.companyName}
              </h2>
              {tenant.isVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  <ShieldCheckIcon /> Verified Organizer
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  Verification in Progress
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Registered Chit Fund Organization · Managed by{" "}
              <span className="font-semibold text-gray-700">
                {tenant.ownerName}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2 border border-slate-100">
            <BuildingIcon />
            <span className="text-xs font-semibold text-slate-700">
              Organizer Since {new Date(tenant.memberSince).getFullYear()}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Business Structure
            </p>
            <p className="mt-1.5 text-sm font-bold text-gray-800">
              {tenant.businessType
                ? tenant.businessType.replace(/_/g, " ")
                : "Private Limited"}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Registration / CIN
            </p>
            <p className="mt-1.5 text-sm font-bold text-gray-800 font-mono break-all">
              {tenant.registrationId ||
                "REG-" + tenant.id.slice(-6).toUpperCase()}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Official Contact
            </p>
            <p
              className="mt-1.5 text-sm font-bold text-gray-800 truncate"
              title={tenant.email}
            >
              {tenant.email}
            </p>
            {tenant.phone && (
              <p className="mt-0.5 text-xs text-gray-500 font-medium">
                {tenant.phone}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Registered Office
            </p>
            <p
              className="mt-1.5 text-xs font-medium text-gray-700 leading-snug line-clamp-2"
              title={tenant.registeredBusinessAddress}
            >
              {tenant.registeredBusinessAddress ||
                "Corporate Registered Office Address Verified"}
            </p>
          </div>
        </div>
      </section>
    );
  },
);
TenantBusinessDetails.displayName = "TenantBusinessDetails";

// ─── How It Works ─────────────────────────────────────────
const HowItWorks = memo(({ steps }: { steps: IStep[] }) => (
  <section
    aria-labelledby="how-it-works"
    className="rounded-3xl bg-gray-200/70 p-5 sm:p-8"
  >
    <div className="flex items-center gap-4">
      <h2
        id="how-it-works"
        className="text-lg font-bold text-gray-900 sm:text-xl whitespace-nowrap"
      >
        How This Chit Fund Works
      </h2>
      <div className="h-px flex-1 bg-gray-300/60" />
    </div>
    <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {steps.map((step, i) => (
        <li key={step.id} className="rounded-2xl bg-white p-5 shadow-sm">
          <span className="text-2xl font-bold text-[#006590]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-4 text-base font-bold text-gray-900">
            {step.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-gray-600">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  </section>
));
HowItWorks.displayName = "HowItWorks";

// // ─── Rules and Terms ──────────────────────────────────────
// const RulesAndTerms = memo(({ rules }: { rules: IRule[] }) => (
//   <section aria-labelledby="rules-title">
//     <div id="rules-title"><SectionTitle>Rules &amp; Terms</SectionTitle></div>
//     <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
//       {rules.map((rule) => (
//         <article key={rule.id}>
//           <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${RULE_TONES[rule.tone]}`}>
//             {rule.icon}
//           </span>
//           <h3 className="mt-5 text-lg font-bold text-gray-900">{rule.title}</h3>
//           <p className="mt-3 text-sm leading-relaxed text-gray-600">{rule.description}</p>
//         </article>
//       ))}
//     </div>
//   </section>
// ));
// RulesAndTerms.displayName = "RulesAndTerms";

// ─── Page Skeleton ────────────────────────────────────────
const DetailsSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="h-10 w-48 rounded bg-gray-200" />
    <div className="h-48 rounded-3xl bg-gray-200" />
    <div className="h-12 rounded-xl bg-gray-200" />
    <div className="h-64 rounded-3xl bg-gray-200" />
    <div className="h-44 rounded-3xl bg-gray-200" />
  </div>
);

// ─── Main Fund Details Component ──────────────────────────
const FundDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { fundId } = useParams<{ fundId: string }>();

  const currentUser = useAppSelector((state) => state.auth.user);

  const [details, setDetails] = useState<IFundFullDetailsResponse | null>(null);
  const [joinStatus, setJoinStatus] = useState<IFundJoinStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFundDetails = useCallback(async () => {
    if (!fundId) return;
    try {
      setLoading(true);
      setError(null);
      const [fundRes, statusRes] = await Promise.all([
        userFundService.getFundDetails(fundId),
        userFundService.getJoinStatus(fundId).catch(() => null),
      ]);
      setDetails(fundRes);
      setJoinStatus(statusRes);
    } catch (err: any) {
      console.error("Failed to load fund details:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load fund details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [fundId]);

  useEffect(() => {
    fetchFundDetails();
  }, [fetchFundDetails]);

  const handleBack = useCallback(() => navigate("/funds"), [navigate]);

  const handleJoinKyc = useCallback(() => {
    navigate(`/funds/${fundId}/kyc`);
  }, [navigate, fundId]);

  const handleReuploadKyc = useCallback(() => {
    navigate(`/funds/${fundId}/kyc`);
  }, [navigate, fundId]);

  const handlePayInitial = useCallback(async () => {
    if (!fundId || !details) return;
    try {
      setIsPaying(true);
      const checkoutData = await userFundService.createJoinCheckout(fundId);

      const result = await openRazorpayCheckout({
        key: checkoutData.razorpayKeyId,
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        name: "FundNest",
        description: `Initial Contribution - ${checkoutData.fundName}`,
        order_id: checkoutData.razorpayOrderId,
        prefill: {
          name: checkoutData.user.name,
          email: checkoutData.user.email,
          contact: checkoutData.user.phone,
        },
      });

      if (result.type === "SUCCESS") {
        await userFundService.verifyJoinCheckout({
          fundId,
          razorpayOrderId: result.response.razorpay_order_id,
          razorpayPaymentId: result.response.razorpay_payment_id,
          razorpaySignature: result.response.razorpay_signature,
        });

        // Re-fetch details and join status to show enrolled status immediately
        await fetchFundDetails();
        toast.success("Payment successful! You are now an active enrolled member of this chit fund.");
      } else if (result.type === "FAILED") {
        toast.error(result.error.description || "Payment failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Payment checkout error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to initiate payment session");
    } finally {
      setIsPaying(false);
    }
  }, [fundId, details, fetchFundDetails]);

  // Dynamic How It Works Steps
  const steps: IStep[] = useMemo(() => {
    const isMulti = details?.fund.fundType === "MULTI_DIVISION";
    const divisions = details?.fund.division ?? 4;

    if (isMulti) {
      return [
        {
          id: "s1",
          title: "Join the Fund",
          description:
            "Complete your profile KYC and lock in your slot before the commencement date.",
        },
        {
          id: "s2",
          title: `Monthly Auctions (${divisions} Draws)`,
          description: `Participate in ${divisions} scheduled bidding rounds conducted per month directly from your dashboard.`,
        },
        {
          id: "s3",
          title: "Accelerated Payouts",
          description: `${divisions} lucky subscribers claim the chit pool each cycle, dramatically shortening the wait.`,
        },
        {
          id: "s4",
          title: "Win Only Once",
          description:
            "Each participant claims the prize pool exactly once per cycle while enjoying monthly dividends.",
        },
      ];
    }

    return [
      {
        id: "s1",
        title: "Join the Fund",
        description:
          "Verify your identity and reserve your membership slot before the start date.",
      },
      {
        id: "s2",
        title: "Monthly Auction",
        description:
          "Join the transparent monthly bidding session held on scheduled draw dates.",
      },
      {
        id: "s3",
        title: "Lowest Bid Wins Pool",
        description:
          "The member offering the highest auction discount claims the prize capital for that month.",
      },
      {
        id: "s4",
        title: "Equal Dividend Sharing",
        description:
          "Auction discounts are distributed evenly to all non-prized members, reducing monthly installments.",
      },
    ];
  }, [details?.fund.fundType, details?.fund.division]);

  const status: FundStatus = useMemo(() => {
    if (!details) return "active";
    if (!details.fund.isActive) return "closed";
    if (details.fund.currentMembersCount >= details.fund.totalMembers)
      return "closed";
    const start = new Date(details.fund.startDate).getTime();
    const now = Date.now();
    return start > now ? "upcoming" : "active";
  }, [details]);

  const isMulti = details?.fund.fundType === "MULTI_DIVISION";
  const auctionsPerMonth = isMulti ? (details?.fund.division ?? 4) : 1;
  const winnersPerCycle = isMulti ? (details?.fund.division ?? 4) : 1;

  // Highlights bullet points from fund or fallback
  const highlights = useMemo(() => {
    if (details?.fund.highlights && details.fund.highlights.length > 0) {
      return details.fund.highlights;
    }
    return [
      "High ROI & Dividend Earnings",
      "Government Registered & Regulated",
      "Transparent Digital Auctions",
      "Escrow-Protected Capital",
    ];
  }, [details?.fund.highlights]);

  return (
    <div className="flex min-h-screen bg-gray-50/60">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          userName={currentUser?.name || "Member"}
          userRole={currentUser?.role || "Subscriber"}
          notificationCount={0}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-8 lg:gap-10">
            {loading ? (
              <DetailsSkeleton />
            ) : error ? (
              <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  Unable to Load Fund Details
                </h2>
                <p className="mt-2 text-sm text-gray-500">{error}</p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Back to Funds
                  </button>
                  <button
                    type="button"
                    onClick={fetchFundDetails}
                    className="rounded-xl bg-[#006590] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005275]"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : details ? (
              <>
                <FundHero
                  name={details.fund.name}
                  fundType={details.fund.fundType}
                  status={status}
                  membersJoined={details.fund.currentMembersCount ?? 0}
                  totalMembers={details.fund.totalMembers}
                  auctionsPerMonth={auctionsPerMonth}
                  winnersPerCycle={winnersPerCycle}
                  joinStatus={joinStatus}
                  contributionAmount={details.fund.contributionAmount}
                  isPaying={isPaying}
                  onBack={handleBack}
                  onJoinKyc={handleJoinKyc}
                  onPayInitial={handlePayInitial}
                  onReuploadKyc={handleReuploadKyc}
                />

                <HighlightsBar items={highlights} />

                <ContributionCard
                  monthlyContribution={details.fund.contributionAmount}
                  totalPool={details.fund.chitValue}
                  durationMonths={details.fund.durationMonths}
                  startDate={details.fund.startDate}
                  isMultiDivision={isMulti}
                  description={details.fund.description}
                />

                <TenantBusinessDetails tenant={details.tenant} />

                <HowItWorks steps={steps} />

                {/* <RulesAndTerms rules={RULES} /> */}
              </>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FundDetailsPage;
