import React, { memo } from "react";
import type { FundIcon, IFund } from "../../../types/fund.types";
import { formatCurrency } from "../../../utitls/fund.utils";

// ─── Icons (local to this card) ───────────────────────────
type IconProps = { size?: number; className?: string };
const Svg: React.FC<IconProps & { children: React.ReactNode }> = ({ size = 16, className, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const CalendarIcon = (p: IconProps) => (<Svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></Svg>);
const ClockIcon = (p: IconProps) => (<Svg {...p}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></Svg>);
const SpeedIcon = (p: IconProps) => (<Svg {...p}><path d="M12 14l4-4" /><path d="M3.3 17a10 10 0 1117.4 0" /></Svg>);
const BoltIcon = (p: IconProps) => (<Svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Svg>);
const LeafIcon = (p: IconProps) => (<Svg {...p}><path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z" /><path d="M2 21c0-3 1.9-5.4 5.1-6" /></Svg>);
const DiamondIcon = (p: IconProps) => (<Svg {...p}><path d="M6 3h12l4 6-10 13L2 9z" /><path d="M2 9h20" /></Svg>);
const StarIcon = (p: IconProps) => (<Svg {...p}><polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2" /></Svg>);

interface IFundCardProps {
  fund: IFund;
  onJoin: (fund: IFund) => void;
}

const ICONS: Record<FundIcon, { el: React.ReactNode; tone: string }> = {
  leaf: { el: <LeafIcon size={18} />, tone: "bg-emerald-50 text-emerald-700" },
  diamond: { el: <DiamondIcon size={18} />, tone: "bg-sky-50 text-sky-700" },
  bolt: { el: <BoltIcon size={18} />, tone: "bg-red-50 text-red-600" },
  star: { el: <StarIcon size={18} />, tone: "bg-amber-50 text-amber-600" },
};

// ─── Small shared pieces ──────────────────────────────────
const TypeBadge: React.FC<{ multi: boolean }> = ({ multi }) => (
  <span
    className={`inline-block rounded px-2 py-1 text-[9px] font-bold uppercase tracking-widest ${
      multi ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"
    }`}
  >
    {multi ? "Multi Division Fund" : "Normal Fund"}
  </span>
);

const SlotsMeter: React.FC<{ left: number; total: number; className?: string }> = ({ left, total, className = "" }) => {
  const filled = Math.round(((total - left) / total) * 100);
  return (
    <div className={className}>
      <p className="text-xs font-semibold text-teal-600 whitespace-nowrap">{left} Slots Left</p>
      <div
        className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={total - left}
        aria-label={`${total - left} of ${total} slots filled`}
      >
        <div className="h-full rounded-full bg-teal-500" style={{ width: `${filled}%` }} />
      </div>
    </div>
  );
};

const JoinButton: React.FC<{ primary: boolean; onClick: () => void; label: string }> = ({
  primary, onClick, label,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 ${
      primary ? "bg-indigo-700 text-white hover:bg-indigo-800" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
    }`}
  >
    Join &amp; Participate
  </button>
);

const Row: React.FC<{ label: string; value: string; accent?: boolean }> = ({ label, value, accent }) => (
  <div className="flex items-baseline justify-between gap-3 text-sm">
    <dt className="text-gray-500">{label}</dt>
    <dd className={`font-bold ${accent ? "text-sky-800" : "text-gray-900"}`}>{value}</dd>
  </div>
);

const scheduleText = (f: IFund): string =>
  f.type === "multi"
    ? `${f.auctionsPerMonth} Auctions / Month • ${f.winnersPerCycle} Winners`
    : `${f.auctionsPerMonth} Auction${f.auctionsPerMonth > 1 ? "s" : ""} / Month`;

const PayoutNote: React.FC<{ multi: boolean }> = ({ multi }) =>
  multi ? (
    <p className="flex items-center gap-2 text-xs font-semibold text-sky-800">
      <BoltIcon size={14} /> Faster Payout (Multi-Winner)
    </p>
  ) : (
    <p className="flex items-center gap-2 text-xs font-medium text-gray-600">
      <ClockIcon size={14} /> Standard Payout Speed
    </p>
  );

// ─── Standard Card (Uniform layout for all cards) ─────────
const FundCard: React.FC<IFundCardProps> = ({ fund, onJoin }) => {
  const multi = fund.type === "multi";
  const icon = ICONS[fund.icon];

  return (
    <article className="flex flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
      <header className="flex items-start justify-between gap-3">
        <TypeBadge multi={multi} />
        <SlotsMeter left={fund.slotsLeft} total={fund.totalSlots} className="w-24 flex-shrink-0 text-right" />
      </header>

      <span className={`mt-3 flex h-10 w-10 items-center justify-center rounded-xl ${icon.tone}`}>{icon.el}</span>

      <h3 className="mt-4 text-xl font-semibold text-gray-900">{fund.name}</h3>
      <p className="mt-1 text-xs text-gray-400">by {fund.tenant}</p>

      <p className="mt-3 flex items-start justify-between gap-3 text-sm text-gray-600">
        <span>{scheduleText(fund)}</span>
        <span className="mt-0.5 flex-shrink-0 text-sky-700">
          {multi ? <SpeedIcon size={14} /> : <CalendarIcon size={14} />}
        </span>
      </p>

      <dl className="mt-4 space-y-3">
        <Row label="Total Pool" value={formatCurrency(fund.totalPool)} />
        <Row label="Monthly" value={formatCurrency(fund.monthly)} accent />
        <Row label="Duration" value={`${fund.durationMonths} Months`} />
      </dl>

      <div className="mt-5 space-y-2">
        <p className="text-[10px] italic text-gray-400">* Each member can win only once</p>
        <PayoutNote multi={multi} />
      </div>

      <div className="mt-auto pt-5">
        <JoinButton primary={multi} label={`Join ${fund.name}`} onClick={() => onJoin(fund)} />
      </div>
    </article>
  );
};

export default memo(FundCard);