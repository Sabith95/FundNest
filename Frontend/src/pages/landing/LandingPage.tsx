import React from "react";
import {
  Shield,
  Users,
  Briefcase,
  Wallet,
  Gavel,
  Layers,
  ArrowRight,
} from "lucide-react";
import { ROUTES } from "../../shared/constants";
import Header from "../../components/landing/Header";
import Footer, { type FooterColumn } from "../../components/landing/footer";

/**
 * FundNest Main Landing Page
 *
 * This is the entry point at ROUTES.COMMON.LANDING. Its only job is to get
 * a visitor to the right place fast: it explains, in plain terms, who a
 * Tenant is and who a User is, then hands off to the role-specific landing
 * page (TenantLandingPage / UserLandingPage) where each gets the full pitch.
 */

const STATS = [
  { value: "100+", label: "Tenants Running Funds", highlight: false },
  { value: "₹10Cr+", label: "Transactions Processed", highlight: true },
  { value: "99.9%", label: "Secure Platform", highlight: false },
];

interface RoleCard {
  key: "tenant" | "user";
  icon: React.ReactNode;
  iconBg: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  learnMoreHref: string;
  registerHref: string;
  accent: string;
}

const ROLE_CARDS: RoleCard[] = [
  {
    key: "tenant",
    icon: <Briefcase className="h-6 w-6 text-indigo-600" strokeWidth={2} />,
    iconBg: "bg-indigo-100",
    eyebrow: "FOR FUND OPERATORS",
    title: "I'm a Tenant",
    description:
      "A Tenant is a fund operator on FundNest — a chit fund business owner who subscribes to the platform to run their operations digitally.",
    bullets: [
      "Buy a subscription and set up your organization",
      "Create normal funds and multi-division funds",
      "Manage members, conduct lots, and run auctions",
      "Track collections and distribute payouts automatically",
    ],
    learnMoreHref: ROUTES.TENANT.LANDING,
    registerHref: ROUTES.TENANT.REGISTER,
    accent: "from-indigo-600 to-blue-500",
  },
  {
    key: "user",
    icon: <Users className="h-6 w-6 text-emerald-700" strokeWidth={2} />,
    iconBg: "bg-emerald-200",
    eyebrow: "FOR FUND MEMBERS",
    title: "I'm a User",
    description:
      "A User is a member who joins chit funds from their own portal — browsing funds published by different Tenants and picking the ones that fit.",
    bullets: [
      "Discover funds published by multiple Tenants",
      "Join normal funds or multi-division funds",
      "Bid and win live lot auctions",
      "Track payouts, dividends, and upcoming lots",
    ],
    learnMoreHref: ROUTES.USER.LANDING,
    registerHref: ROUTES.USER.REGISTER,
    accent: "from-emerald-600 to-teal-500",
  },
];

const FLOW_STEPS = [
  {
    icon: <Briefcase className="h-5 w-5 text-indigo-600" strokeWidth={2} />,
    title: "Tenant creates a fund",
    description:
      "A normal fund or a multi-division fund, with its own cycle and terms.",
  },
  {
    icon: <Users className="h-5 w-5 text-emerald-700" strokeWidth={2} />,
    title: "Users join",
    description:
      "Members browse open funds across Tenants and join the ones that fit their goals.",
  },
  {
    icon: <Gavel className="h-5 w-5 text-slate-700" strokeWidth={2} />,
    title: "Lots are conducted",
    description:
      "Tenants run the auction; Users bid in real time from their own portal.",
  },
  {
    icon: <Wallet className="h-5 w-5 text-slate-700" strokeWidth={2} />,
    title: "Amounts are distributed",
    description:
      "Payouts and dividends are tracked and settled for every member automatically.",
  },
];

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "For Tenants",
    links: [
      { label: "Tenant Features", href: ROUTES.TENANT.LANDING },
      { label: "Register as Tenant", href: ROUTES.TENANT.REGISTER },
      { label: "Pricing", href: ROUTES.COMMON.PRICING },
    ],
  },
  {
    title: "For Users",
    links: [
      { label: "User Features", href: ROUTES.USER.LANDING },
      { label: "Register as User", href: ROUTES.USER.REGISTER },
    ],
  },
  {
    title: "Legal",
    links: [{ label: "Terms of Service" }, { label: "Privacy Policy" }],
  },
];

const RoleVisual: React.FC<{ variant: "tenant" | "user" }> = ({ variant }) => {
  if (variant === "tenant") {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-5">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white/70">
            MULTI-DIVISION FUND
          </span>
          <Layers className="h-4 w-4 text-white/50" />
        </div>
        <div className="mt-4 space-y-2">
          {["Division A · ₹1L", "Division B · ₹2L", "Division C · ₹5L"].map(
            (row) => (
              <div
                key={row}
                className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
              >
                <span className="text-xs font-medium text-white/80">{row}</span>
                <span className="h-1.5 w-10 rounded-full bg-emerald-400/70" />
              </div>
            ),
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-5">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white/70">
          LIVE AUCTION
        </span>
        <Gavel className="h-4 w-4 text-white/50" />
      </div>
      <div className="mt-4 rounded-lg bg-white/5 p-3">
        <p className="text-[10px] font-medium uppercase tracking-wide text-white/40">
          Highest bid
        </p>
        <p className="mt-1 text-2xl font-extrabold text-emerald-400">₹48,200</p>
        <p className="mt-1 text-[11px] text-white/50">
          3 members bidding · closes in 02:14
        </p>
      </div>
    </div>
  );
};

const MainLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-900 antialiased">
      <Header active="main" />

      {/* ---------- Hero ---------- */}
      <section
        id="home"
        className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20"
      >
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700">
            <Shield className="h-3.5 w-3.5" strokeWidth={2.5} />
            SMART SAVINGS. SECURE FUTURE.
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            One platform. <span className="text-indigo-600">Two ways in.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
            FundNest connects the people who run chit funds with the people who
            join them. Tell us which one you are, and we'll take you straight
            there.
          </p>
        </div>
      </section>

      {/* ---------- Role cards ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {ROLE_CARDS.map((role) => (
            <div
              key={role.key}
              className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:shadow-lg sm:p-8"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${role.iconBg}`}
                >
                  {role.icon}
                </div>
                <span className="text-xs font-semibold tracking-wide text-slate-400">
                  {role.eyebrow}
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-extrabold text-slate-900">
                {role.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {role.description}
              </p>

              <ul className="mt-5 space-y-2">
                {role.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300" />
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <RoleVisual variant={role.key} />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={role.learnMoreHref}
                  className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${role.accent} px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90`}
                >
                  Explore {role.title.replace("I'm a ", "")} Features
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={role.registerHref}
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  Register as {role.title.replace("I'm a ", "")}
                </a>
              </div>
            </div>
          ))}
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
                <p className="text-2xl font-extrabold text-indigo-600 sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ) : (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* ---------- How it connects ---------- */}
      <section className="bg-slate-100/70 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-extrabold text-slate-900 sm:text-4xl">
            How a fund moves through FundNest
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-500">
            Tenants set the fund up. Users take part in it. Here's the same
            cycle a chit fund follows offline — just digitized end to end.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FLOW_STEPS.map((step, idx) => (
              <div
                key={step.title}
                className="relative rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                  {step.icon}
                </div>
                <p className="mt-4 text-xs font-semibold text-slate-400">
                  STEP {idx + 1}
                </p>
                <h3 className="mt-1 text-sm font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 px-6 py-14 text-center shadow-xl sm:px-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Not sure yet? Start with pricing.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-indigo-100">
            See what a Tenant subscription includes, or jump straight to
            registering as a User — it's free to join a fund.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={ROUTES.COMMON.PRICING}
              className="inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-indigo-700 shadow-md transition hover:bg-indigo-50"
            >
              View Pricing
            </a>
            <a
              href={ROUTES.USER.REGISTER}
              className="inline-block rounded-full border border-white/40 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Join as a User
            </a>
          </div>
        </div>
      </section>

      <Footer columns={FOOTER_COLUMNS} />
    </div>
  );
};

export default MainLandingPage;
