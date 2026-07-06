import React from "react";
import {
  Shield,
  Users,
  Wallet,
  ShieldCheck,
  LineChart,
  Briefcase,
  Bell,
} from "lucide-react";

/**
 * FundNest Landing Page
 * React + TypeScript + Tailwind CSS
 * Fully responsive: mobile -> tablet -> desktop
 */

const NAV_LINKS = [
  { label: "Home", href: "#home", active: true },
  { label: "Pricing", href: "/pricing" },
  { label: "Register", href: "#register" },
  { label: "Login", href: "#login" },
];

const STATS = [
  { value: "100+", label: "Tenants Managed", highlight: false },
  { value: "₹10Cr+", label: "Transactions", highlight: true },
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
    icon: <Users className="h-5 w-5 text-indigo-600" strokeWidth={2} />,
    iconBg: "bg-indigo-100",
    title: "Tenant Management",
    description:
      "Centralized profiles for all members with historical payment data and risk assessment.",
  },
  {
    icon: <Wallet className="h-5 w-5 text-emerald-700" strokeWidth={2} />,
    iconBg: "bg-emerald-200",
    title: "Automated Payment Tracking",
    description:
      "No more manual entries. Our system automatically reconciles incoming transfers and updates ledgers.",
  },
  {
    icon: <Shield className="h-5 w-5 text-indigo-600" strokeWidth={2} />,
    iconBg: "bg-indigo-100",
    title: "Secure Transactions",
    description:
      "Multi-factor authentication and end-to-end encryption for every financial movement.",
  },
  {
    icon: <LineChart className="h-5 w-5 text-slate-700" strokeWidth={2} />,
    iconBg: "bg-slate-200",
    title: "Real-time Analytics",
    description:
      "Instantly visualize fund health, dividend distributions, and cash flow projections.",
  },
  {
    icon: <Briefcase className="h-5 w-5 text-slate-700" strokeWidth={2} />,
    iconBg: "bg-slate-200",
    title: "Multi-user Access",
    description:
      "Assign roles to administrators and agents with granular permission controls.",
  },
  {
    icon: <Bell className="h-5 w-5 text-slate-700" strokeWidth={2} />,
    iconBg: "bg-slate-200",
    title: "Notifications & Reminders",
    description:
      "Automated alerts for upcoming auctions and installment deadlines.",
  },
];

interface JourneyStep {
  number: string;
  title: string;
  description: string;
  visual: React.ReactNode;
}

const LaptopVisual = () => (
  <div className="relative overflow-hidden rounded-2xl bg-slate-800 shadow-lg">
    <div className="aspect-[4/3] w-full bg-gradient-to-br from-sky-700 via-slate-700 to-slate-900 p-6 sm:p-8">
      <p className="font-mono text-lg font-bold tracking-wide text-white/90 sm:text-2xl">
        BUSINESS REGISTRATION
      </p>
      <div className="mt-6 space-y-2 opacity-70">
        <div className="h-2 w-2/3 rounded bg-white/40" />
        <div className="h-2 w-1/2 rounded bg-white/40" />
        <div className="h-2 w-3/5 rounded bg-white/40" />
      </div>
    </div>
  </div>
);

const GrowthVisual = () => (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-600 to-slate-900 shadow-lg">
    <div className="flex aspect-[4/3] w-full items-end justify-center gap-2 p-6 sm:gap-3 sm:p-8">
      {[30, 45, 35, 55, 70, 60, 85, 100].map((h, i) => (
        <div
          key={i}
          className="w-4 rounded-t-sm bg-gradient-to-t from-emerald-500 to-lime-400 sm:w-6"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  </div>
);

const JOURNEY_STEPS: JourneyStep[] = [
  {
    number: "01",
    title: "Register company",
    description:
      "Setup your organization profile in minutes. We handle the compliance scaffolding so you can focus on your capital growth.",
    visual: <LaptopVisual />,
  },
  {
    number: "02",
    title: "Add tenants & create funds",
    description:
      "Bulk import your existing members or add them individually. Create custom chit cycles with varying values and durations.",
    visual: null,
  },
  {
    number: "03",
    title: "Track payments & grow",
    description:
      "Our automated engine takes over. Monitor dividends, auction wins, and overall portfolio growth through a singular lens.",
    visual: <GrowthVisual />,
  },
];

const FOOTER_COLUMNS: { title: string; links: { label: string; underline?: boolean }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features" },
      { label: "Security", underline: true },
      { label: "Pricing" },
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
    {/* ambient glow */}
    <div className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-full bg-emerald-300/40 blur-3xl" />

    {/* main chart card */}
    <div className="absolute left-1/2 top-1/2 h-[62%] w-[55%] -translate-x-[58%] -translate-y-1/2 rounded-xl bg-white p-3 shadow-2xl sm:p-4">
      <div className="mb-2 flex gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
      </div>
      <svg viewBox="0 0 200 90" className="h-16 w-full sm:h-20" preserveAspectRatio="none">
        <polyline
          points="0,70 25,55 45,60 65,35 90,45 115,15 140,30 165,10 200,20"
          fill="none"
          stroke="#059669"
          strokeWidth="3"
        />
        <polygon
          points="0,70 25,55 45,60 65,35 90,45 115,15 140,30 165,10 200,20 200,90 0,90"
          fill="url(#areaGradient)"
          opacity="0.5"
        />
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4338ca" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4338ca" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="mt-3 space-y-1.5">
        <div className="h-1.5 w-4/5 rounded-full bg-slate-100" />
        <div className="h-1.5 w-3/5 rounded-full bg-slate-100" />
        <div className="h-2 w-1/2 rounded-full bg-indigo-100" />
      </div>
    </div>

    {/* circular gauge card */}
    <div className="absolute left-[6%] top-[42%] flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg sm:h-16 sm:w-16">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-4 border-slate-100 sm:h-10 sm:w-10">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-indigo-600" />
        <ShieldCheck className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
      </div>
    </div>

    {/* small stat cards */}
    <div className="absolute right-[4%] top-[22%] flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 shadow-lg sm:px-3 sm:py-2">
      <LineChart className="h-3.5 w-3.5 text-indigo-500" />
      <div className="h-1.5 w-6 rounded-full bg-slate-200 sm:w-8" />
    </div>
    <div className="absolute right-[2%] top-[42%] flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 shadow-lg sm:px-3 sm:py-2">
      <span className="text-[10px] font-bold text-emerald-600">%</span>
      <div className="h-1.5 w-6 rounded-full bg-slate-200 sm:w-8" />
    </div>
    <div className="absolute right-[6%] top-[60%] flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 shadow-lg sm:px-3 sm:py-2">
      <span className="text-xs font-bold text-indigo-600">↑</span>
      <div className="h-1.5 w-6 rounded-full bg-slate-200 sm:w-8" />
    </div>
  </div>
);

const FundNestLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-900 antialiased">
      {/* ---------- Header ---------- */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-2">
            <span className="text-xl">🥥</span>
            <span className="text-lg font-bold text-slate-900">FundNest</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={
                  link.active
                    ? "border-b-2 border-indigo-600 pb-1 text-sm font-medium text-indigo-600"
                    : "text-sm font-medium text-slate-600 hover:text-slate-900"
                }
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#get-started"
            className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800 sm:px-5"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section id="home" className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left column */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700">
              <Shield className="h-3.5 w-3.5" strokeWidth={2.5} />
              SMART SAVINGS. SECURE FUTURE.
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
              Smart Chit Fund
              <br />
              Management
              <br />
              <span className="text-indigo-600">Made Simple</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500 sm:text-lg">
              Manage tenants, automate collections, and grow your chit fund
              business effortlessly with our institutional-grade digital
              vault.
            </p>

            <div className="mt-8">
              <a
                href="/pricing"
                className="inline-block rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
              >
                View Pricing
              </a>
            </div>
          </div>

          {/* Right column - illustration */}
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
            )
          )}
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="bg-slate-50 px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Institutional-Grade Features
            </h2>
            <p className="mt-3 text-slate-500">
              Everything you need to run your fund with transparency and scale.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.iconBg}`}
                >
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Journey ---------- */}
      <section className="bg-slate-100/70 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Your Journey to Efficiency
          </h2>

          <div className="mt-14 space-y-16">
            {JOURNEY_STEPS.map((step, idx) => {
              const textBlock = (
                <div>
                  <span className="block text-5xl font-extrabold text-slate-300 sm:text-6xl">
                    {step.number}
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-md text-slate-500">
                    {step.description}
                  </p>
                </div>
              );

              const visualBlock = step.visual ? (
                <div className="w-full">{step.visual}</div>
              ) : (
                <div className="hidden md:block" />
              );

              const isEven = idx % 2 === 1;

              return (
                <div
                  key={step.number}
                  className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12"
                >
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
            Start Managing Your Chit Funds Today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-indigo-100">
            Join hundreds of fund managers who have digitized their
            operations with FundNest. Security, transparency, and
            growth—all in one place.
          </p>
          <a
            href="#get-started"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-indigo-700 shadow-md transition hover:bg-indigo-50"
          >
            Get Started Now
          </a>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-slate-100 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-base font-bold text-slate-900">FundNest</p>
            <p className="mt-2 max-w-xs text-sm text-slate-500">
              The Digital Vault for your Capital. Institutional-grade chit
              fund management software for the modern economy.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-bold text-slate-900">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href="#"
                      className={`text-sm text-slate-500 hover:text-slate-800 ${
                        link.underline ? "underline" : ""
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-6xl border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-400">
            © 2026 FundNest. The Digital Vault for your Capital.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FundNestLandingPage;