import React from "react";
import { Shield, Search, Layers, TrendingUp, Wallet, ShieldCheck, Bell } from "lucide-react";
import { ROUTES } from "../../shared/constants";
import Header from "../../components/landing/Header";
import Footer, {type FooterColumn } from "../../components/landing/footer";

/**
 * FundNest User Landing Page
 *
 * Mirrors the Tenant landing page's design system (same layout rhythm,
 * type scale, spacing, and card treatments) but speaks to Users: people
 * who join chit funds published by different Tenants and take part in
 * lots and auctions from their own portal, rather than running a fund.
 */

const STATS = [
  { value: "500+", label: "Active Members", highlight: false },
  { value: "₹10Cr+", label: "Payouts Distributed", highlight: true },
  { value: "99.9%", label: "Secure Platform", highlight: false },
];

interface Feature {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: <Search className="h-5 w-5 text-indigo-600" strokeWidth={2} />,
    iconBg: "bg-indigo-100",
    title: "Browse Funds Across Tenants",
    description:
      "Explore funds published by different tenants in one place, and compare terms before you join.",
  },
  {
    icon: <Layers className="h-5 w-5 text-emerald-700" strokeWidth={2} />,
    iconBg: "bg-emerald-200",
    title: "Normal & Multi-Division Funds",
    description:
      "Join a single-pool normal fund, or a multi-division fund split into smaller groups with their own cycles.",
  },
  {
    icon: <TrendingUp className="h-5 w-5 text-indigo-600" strokeWidth={2} />,
    iconBg: "bg-indigo-100",
    title: "Live Lot Auctions",
    description:
      "Bid on open lots in real time from your portal and see where you stand as the auction moves.",
  },
  {
    icon: <Wallet className="h-5 w-5 text-slate-700" strokeWidth={2} />,
    iconBg: "bg-slate-200",
    title: "Payout & Dividend Tracking",
    description:
      "See every payout, dividend, and installment against each fund you've joined, in real time.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-slate-700" strokeWidth={2} />,
    iconBg: "bg-slate-200",
    title: "Secure, Verified Transactions",
    description:
      "Multi-factor authentication and end-to-end encryption protect every payment you make or receive.",
  },
  {
    icon: <Bell className="h-5 w-5 text-slate-700" strokeWidth={2} />,
    iconBg: "bg-slate-200",
    title: "Auction & Due-Date Alerts",
    description:
      "Get notified before a lot opens for bidding and before each installment is due.",
  },
];

interface FundType {
  icon: React.ReactNode;
  title: string;
  description: string;
  points: string[];
}

const FUND_TYPES: FundType[] = [
  {
    icon: <Wallet className="h-5 w-5 text-indigo-600" strokeWidth={2} />,
    title: "Normal Fund",
    description:
      "One pool, one group. Every member contributes the same installment each cycle, and one member takes the pot per lot.",
    points: [
      "Single pool shared by all members",
      "Fixed installment and fund value",
      "One lot conducted per cycle",
    ],
  },
  {
    icon: <Layers className="h-5 w-5 text-emerald-700" strokeWidth={2} />,
    title: "Multi-Division Fund",
    description:
      "One fund split into several divisions, each with its own value and members, run in parallel under one tenant.",
    points: [
      "Multiple divisions, each its own sub-group",
      "Different values per division (e.g. ₹1L / ₹2L / ₹5L)",
      "Lots conducted independently per division",
    ],
  },
];

interface JourneyStep {
  number: string;
  title: string;
  description: string;
  visual: React.ReactNode;
}

const BrowseVisual = () => (
  <div className="relative overflow-hidden rounded-2xl bg-slate-800 shadow-lg">
    <div className="aspect-[4/3] w-full bg-gradient-to-br from-indigo-700 via-slate-700 to-slate-900 p-6 sm:p-8">
      <p className="font-mono text-lg font-bold tracking-wide text-white/90 sm:text-2xl">
        BROWSE OPEN FUNDS
      </p>
      <div className="mt-6 space-y-2.5">
        {["Tenant A · Normal · ₹2L", "Tenant B · Multi-Division", "Tenant C · Normal · ₹5L"].map((row) => (
          <div key={row} className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2">
            <span className="text-xs font-medium text-white/80">{row}</span>
            <span className="rounded-full bg-emerald-400/80 px-2 py-0.5 text-[10px] font-bold text-slate-900">
              OPEN
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AuctionVisual = () => (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-600 to-slate-900 shadow-lg">
    <div className="flex aspect-[4/3] w-full flex-col justify-end gap-3 p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Lot #14 · Live</p>
      <p className="text-3xl font-extrabold text-white sm:text-4xl">₹48,200</p>
      <div className="flex items-end gap-2">
        {[40, 55, 50, 70, 65, 85, 100].map((h, i) => (
          <div
            key={i}
            className="w-4 rounded-t-sm bg-gradient-to-t from-white/40 to-lime-300 sm:w-6"
            style={{ height: `${h}%`, maxHeight: "70px" }}
          />
        ))}
      </div>
    </div>
  </div>
);

const JOURNEY_STEPS: JourneyStep[] = [
  {
    number: "01",
    title: "Create your profile",
    description:
      "Sign up and browse funds published by different tenants — filter by value, duration, or fund type.",
    visual: <BrowseVisual />,
  },
  {
    number: "02",
    title: "Join the fund that fits",
    description:
      "Pick a normal fund for a straightforward single pool, or a multi-division fund to join a smaller group within a larger one.",
    visual: null,
  },
  {
    number: "03",
    title: "Bid, win, and get paid",
    description:
      "Take part in each lot's auction from your portal, then track your payouts and upcoming installments in one view.",
    visual: <AuctionVisual />,
  },
];

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features" },
      { label: "Security", underline: true },
      { label: "Browse Funds" },
    ],
  },
  {
    title: "Legal",
    links: [{ label: "Terms of Service" }, { label: "Privacy Policy" }],
  },
  {
    title: "Support",
    links: [{ label: "Contact Support" }, { label: "Help Center" }],
  },
];

const HeroIllustration: React.FC = () => (
  <div className="relative aspect-[4/3] w-full rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-xl">
    <div className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-full bg-emerald-300/40 blur-3xl" />

    {/* main auction card */}
    <div className="absolute left-1/2 top-1/2 h-[62%] w-[55%] -translate-x-[58%] -translate-y-1/2 rounded-xl bg-white p-3 shadow-2xl sm:p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
        </div>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
          LIVE
        </span>
      </div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Highest bid</p>
      <p className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">₹48,200</p>
      <div className="mt-3 space-y-1.5">
        <div className="h-1.5 w-4/5 rounded-full bg-slate-100" />
        <div className="h-1.5 w-3/5 rounded-full bg-slate-100" />
        <div className="h-2 w-1/2 rounded-full bg-emerald-100" />
      </div>
    </div>

    {/* circular badge card */}
    <div className="absolute left-[6%] top-[42%] flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg sm:h-16 sm:w-16">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-4 border-slate-100 sm:h-10 sm:w-10">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-indigo-600" />
        <ShieldCheck className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
      </div>
    </div>

    {/* small stat cards */}
    <div className="absolute right-[4%] top-[22%] flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 shadow-lg sm:px-3 sm:py-2">
      <Layers className="h-3.5 w-3.5 text-indigo-500" />
      <div className="h-1.5 w-6 rounded-full bg-slate-200 sm:w-8" />
    </div>
    <div className="absolute right-[2%] top-[42%] flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 shadow-lg sm:px-3 sm:py-2">
      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
      <div className="h-1.5 w-6 rounded-full bg-slate-200 sm:w-8" />
    </div>
    <div className="absolute right-[6%] top-[60%] flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 shadow-lg sm:px-3 sm:py-2">
      <Bell className="h-3.5 w-3.5 text-indigo-600" />
      <div className="h-1.5 w-6 rounded-full bg-slate-200 sm:w-8" />
    </div>
  </div>
);

const UserLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-900 antialiased">
      <Header active="user" />

      {/* ---------- Hero ---------- */}
      <section id="home" className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700">
              <Shield className="h-3.5 w-3.5" strokeWidth={2.5} />
              FOR FUND MEMBERS
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
              Join Funds.
              <br />
              Bid Smart.
              <br />
              <span className="text-indigo-600">Grow Your Savings.</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500 sm:text-lg">
              Browse funds from different tenants, join the ones that fit your goals, and
              take part in every lot and auction from your own secure portal.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={ROUTES.USER.REGISTER}
                className="inline-block rounded-full bg-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800"
              >
                Register as User
              </a>
              <a
                href={ROUTES.USER.LOGIN}
                className="inline-block rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
              >
                Browse Open Funds
              </a>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-6 px-4 sm:grid-cols-3 sm:gap-4 sm:px-6 lg:px-8">
          {STATS.map((stat) =>
            stat.highlight ? (
              <div
                key={stat.label}
                className="order-first rounded-2xl bg-white px-6 py-6 text-center shadow-md sm:order-none"
              >
                <p className="text-2xl font-extrabold text-indigo-600 sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ) : (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* ---------- Fund types ---------- */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Two kinds of funds to join</h2>
            <p className="mt-3 text-slate-500">
              Every fund on FundNest is one of these two types — pick whichever matches how you
              want to save.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {FUND_TYPES.map((fund) => (
              <div
                key={fund.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  {fund.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{fund.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{fund.description}</p>
                <ul className="mt-4 space-y-2">
                  {fund.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="bg-slate-50 px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Everything You Need as a Member
            </h2>
            <p className="mt-3 text-slate-500">
              From discovery to payout, manage your fund membership end to end.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.iconBg}`}>
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Journey ---------- */}
      <section className="bg-slate-100/70 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Your Journey as a Member
          </h2>

          <div className="mt-14 space-y-16">
            {JOURNEY_STEPS.map((step, idx) => {
              const textBlock = (
                <div>
                  <span className="block text-5xl font-extrabold text-slate-300 sm:text-6xl">
                    {step.number}
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-3 max-w-md text-slate-500">{step.description}</p>
                </div>
              );

              const visualBlock = step.visual ? (
                <div className="w-full">{step.visual}</div>
              ) : (
                <div className="hidden md:block" />
              );

              const isEven = idx % 2 === 1;

              return (
                <div key={step.number} className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
                  {isEven ? (
                    <>
                      <div className="order-2 md:order-1">{visualBlock}</div>
                      <div className="order-1 md:order-2">{textBlock}</div>
                    </>
                  ) : (
                    <>
                      <div className="order-1">{textBlock}</div>
                      <div className="order-2">{visualBlock}</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 px-6 py-14 text-center shadow-xl sm:px-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Start Growing Your Savings Today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-indigo-100">
            Join a fund that matches your goals, bid with confidence, and track every payout
            in one place.
          </p>
          <a
            href={ROUTES.USER.REGISTER}
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-indigo-700 shadow-md transition hover:bg-indigo-50"
          >
            Register as User
          </a>
        </div>
      </section>

      <Footer columns={FOOTER_COLUMNS} />
    </div>
  );
};

export default UserLandingPage;