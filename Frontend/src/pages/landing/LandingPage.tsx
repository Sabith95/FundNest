
import { useState } from "react";

// ─── Icons (inline SVG components) ───────────────────────────────────────────

const Logo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="14" fill="#4ADE80" opacity="0.2" />
    <circle cx="14" cy="14" r="8" fill="#22C55E" opacity="0.6" />
    <circle cx="14" cy="14" r="4" fill="#16A34A" />
  </svg>
);

const UsersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ZapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const KeyIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

// interface StepProps {
//   number: string;
//   title: string;
//   description: string;
//   image: React.ReactNode;
//   reversed?: boolean;
// }

// ─── Sub-components ───────────────────────────────────────────────────────────

const FeatureCard = ({ icon, title, description, iconBg, iconColor }: FeatureCardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
      <span className={iconColor}>{icon}</span>
    </div>
    <h3 className="font-semibold text-gray-900 text-[15px] mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
  </div>
);

// Dashboard illustration for hero
const DashboardIllustration = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Card shadow bg */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-blue-50 rounded-3xl" />

    {/* Main dashboard card */}
    <div className="relative z-10 bg-white rounded-2xl shadow-xl p-4 w-[88%] mx-auto">
      {/* Top bar */}
      <div className="flex gap-1.5 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
      </div>

      {/* Chart area */}
      <div className="bg-gradient-to-b from-blue-50 to-white rounded-xl p-3 mb-3">
        <svg viewBox="0 0 200 80" className="w-full h-16">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,60 C30,50 50,20 80,30 C110,40 130,10 160,15 C180,18 195,25 200,20 L200,80 L0,80 Z"
            fill="url(#chartGrad)" />
          <path d="M0,60 C30,50 50,20 80,30 C110,40 130,10 160,15 C180,18 195,25 200,20"
            fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
          <path d="M0,70 C40,65 70,55 100,50 C130,45 160,55 200,48"
            fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeDasharray="4,2" />
          {/* Data point */}
          <circle cx="160" cy="15" r="3.5" fill="#6366f1" />
          <circle cx="160" cy="15" r="6" fill="#6366f1" fillOpacity="0.2" />
        </svg>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Revenue", value: "₹4.2Cr", color: "text-indigo-600" },
          { label: "Members", value: "1,240", color: "text-green-600" },
          { label: "Funds", value: "38", color: "text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-lg p-2 text-center">
            <div className={`font-bold text-xs ${s.color}`}>{s.value}</div>
            <div className="text-[9px] text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Floating mini card */}
    <div className="absolute bottom-6 left-2 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 z-20">
      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div>
        <div className="text-[9px] text-gray-400">Payment</div>
        <div className="text-[10px] font-semibold text-gray-700">Confirmed</div>
      </div>
    </div>
  </div>
);

// Step images
const RegistrationImage = () => (
  <div className="w-full h-52 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl overflow-hidden flex items-center justify-center relative">
    <div className="absolute inset-0 opacity-20"
      style={{ backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)", backgroundSize: "8px 8px" }} />
    <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl p-5 mx-6 w-full border border-white/20">
      <div className="text-white/60 text-xs mb-2 uppercase tracking-widest">Business Registration</div>
      {["Company Name", "Registration No.", "GST Number", "Director Name"].map((field) => (
        <div key={field} className="flex items-center gap-2 mb-1.5">
          <div className="text-white/50 text-[10px] w-24 shrink-0">{field}</div>
          <div className="flex-1 h-1.5 bg-white/20 rounded-full">
            <div className="h-full bg-white/50 rounded-full" style={{ width: `${60 + Math.random() * 35}%` }} />
          </div>
        </div>
      ))}
      <div className="mt-3 bg-indigo-500 rounded-lg py-1 text-center">
        <span className="text-white text-[10px] font-semibold">Submit</span>
      </div>
    </div>
  </div>
);

const GrowthImage = () => (
  <div className="w-full h-52 bg-gradient-to-br from-teal-600 to-emerald-800 rounded-2xl overflow-hidden flex items-end justify-center pb-4 px-6 relative">
    <div className="absolute inset-0 opacity-10"
      style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
    <div className="relative z-10 flex items-end gap-2 w-full justify-center">
      {[40, 55, 38, 70, 58, 85, 65, 95].map((h, i) => (
        <div key={i} className="flex-1 rounded-t-md"
          style={{
            height: `${h * 1.4}px`,
            background: `linear-gradient(to top, #34d399, #6ee7b7)`,
            opacity: 0.7 + i * 0.04,
          }} />
      ))}
    </div>
    {/* Trend line overlay */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="none">
      <path d="M20,160 C80,130 120,90 160,80 C200,70 240,50 280,30"
        fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="5,3" />
    </svg>
  </div>
);

// ─── Main Landing Page Component ─────────────────────────────────────────────

const FundNestLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features: FeatureCardProps[] = [
    {
      icon: <UsersIcon />,
      title: "Tenant Management",
      description: "Centralized profiles for all members with historical payment data and risk assessment.",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-500",
    },
    {
      icon: <ZapIcon />,
      title: "Automated Payment Tracking",
      description: "No more manual entries. Our system automatically reconciles incoming transfers and updates ledgers.",
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      icon: <ShieldIcon />,
      title: "Secure Transactions",
      description: "Multi-factor authentication and end-to-end encryption for every financial movement.",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      icon: <BarChartIcon />,
      title: "Real-time Analytics",
      description: "Instantly visualize fund health, dividend distributions, and cash flow projections.",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-500",
    },
    {
      icon: <KeyIcon />,
      title: "Multi-user Access",
      description: "Assign roles to administrators and agents with granular permission controls.",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-500",
    },
    {
      icon: <BellIcon />,
      title: "Notifications & Reminders",
      description: "Automated WhatsApp and SMS alerts for upcoming auctions and installment deadlines.",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-500",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Register company",
      description:
        "Setup your organization profile in minutes. We handle the compliance scaffolding so you can focus on your capital growth.",
      image: <RegistrationImage />,
      reversed: false,
    },
    {
      number: "02",
      title: "Add tenants & create funds",
      description:
        "Bulk import your existing members or add them individually. Create custom chit cycles with varying values and durations.",
      image: null,
      reversed: true,
    },
    {
      number: "03",
      title: "Track payments & grow",
      description:
        "Our automated engine takes over. Monitor dividends, auction wins, and overall portfolio growth through a singular lens.",
      image: <GrowthImage />,
      reversed: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-gray-900 text-[17px] tracking-tight">FundNest</span>
          </div>

          {/* Nav links – desktop */}
          <div className="hidden md:flex items-center gap-7">
            {["Home", "Pricing", "Register", "Login"].map((link, i) => (
              <a
                key={link}
                href="/pricing"
                className={`text-sm font-medium transition-colors ${
                  i === 0
                    ? "text-indigo-600 border-b-2 border-indigo-600 pb-0.5"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {link}
              </a>
            ))}
          </div>

          {/* CTA */}
          <button className="hidden md:inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors shadow-sm shadow-indigo-200">
            Get Started
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-3">
            {["Home", "Pricing", "Register", "Login"].map((link) => (
              <a key={link} href="/pricing" className="text-sm text-gray-600 hover:text-indigo-600 font-medium py-1">
                {link}
              </a>
            ))}
            <button className="mt-2 bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-full">
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-10 md:pt-20 md:pb-16 grid md:grid-cols-2 gap-10 items-center">
        {/* Left copy */}
        <div>
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            <svg width="8" height="8" viewBox="0 0 8 8" className="shrink-0">
              <circle cx="4" cy="4" r="4" fill="#6366f1" />
            </svg>
            Smart Savings. Secure Future.
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.12] tracking-tight mb-3">
            Smart Chit Fund
            <br />
            Management
            <br />
            <span className="text-indigo-600">Made Simple</span>
          </h1>

          <p className="text-gray-500 text-[15px] leading-relaxed mt-5 mb-8 max-w-md">
            Manage tenants, automate collections, and grow your chit fund business effortlessly with our
            institutional-grade digital vault.
          </p>

          <button className="inline-flex items-center bg-white border border-gray-200 text-gray-700 text-sm font-semibold px-6 py-2.5 rounded-full shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
            View Pricing
          </button>
        </div>

        {/* Right illustration */}
        <div className="relative h-64 md:h-80">
          <DashboardIllustration />
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          {[
            { value: "100+", label: "Tenants Managed", highlight: false },
            { value: "₹10Cr+", label: "Transactions", highlight: true },
            { value: "99.9%", label: "Secure Platform", highlight: false },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`py-8 text-center ${
                stat.highlight ? "bg-white border-x border-gray-100 shadow-inner" : "bg-gray-50"
              }`}
            >
              <div className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{stat.value}</div>
              <div className="text-gray-400 text-xs mt-1.5 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
              Institutional-Grade Features
            </h2>
            <p className="text-gray-400 text-sm">Everything you need to run your fund with transparency and scale.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Journey ────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Your Journey to Efficiency
          </h2>
        </div>

        <div className="flex flex-col gap-16">
          {/* Step 01 */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-6xl font-black text-gray-100 leading-none mb-1 select-none">01</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Register company</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                Setup your organization profile in minutes. We handle the compliance scaffolding so you can focus on
                your capital growth.
              </p>
            </div>
            <div>
              <RegistrationImage />
            </div>
          </div>

          {/* Step 02 – no image, text centered-right */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="hidden md:block" /> {/* spacer */}
            <div>
              <div className="text-6xl font-black text-gray-100 leading-none mb-1 select-none">02</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Add tenants & create funds</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                Bulk import your existing members or add them individually. Create custom chit cycles with varying
                values and durations.
              </p>
            </div>
          </div>

          {/* Step 03 */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-6xl font-black text-gray-100 leading-none mb-1 select-none">03</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track payments & grow</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                Our automated engine takes over. Monitor dividends, auction wins, and overall portfolio growth through
                a singular lens.
              </p>
            </div>
            <div>
              <GrowthImage />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div
          className="rounded-3xl px-8 py-14 text-center"
          style={{ background: "linear-gradient(135deg, #3730a3 0%, #4f46e5 50%, #6366f1 100%)" }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-tight">
            Start Managing Your Chit Funds Today
          </h2>
          <p className="text-indigo-200 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            Join hundreds of fund managers who have digitized their operations with FundNest. Security, transparency,
            and growth—all in one place.
          </p>
          <button className="bg-white text-indigo-700 font-bold text-sm px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/30">
            Get Started Now
          </button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Logo />
                <span className="font-bold text-gray-900 text-[15px]">FundNest</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed max-w-[180px]">
                The Digital Vault for your Capital. Institutional-grade chit fund management software for the modern
                economy.
              </p>
            </div>

            {/* Product */}
            <div>
              <div className="font-semibold text-gray-800 text-sm mb-3">Product</div>
              {["Features", "Security", "Pricing"].map((l) => (
                <a key={l} href="/pricing" className="block text-gray-400 text-xs hover:text-indigo-600 mb-2 transition-colors">
                  {l}
                </a>
              ))}
            </div>

            {/* Legal */}
            <div>
              <div className="font-semibold text-gray-800 text-sm mb-3">Legal</div>
              {["Terms of Service", "Privacy Policy"].map((l) => (
                <a key={l} href="#" className="block text-gray-400 text-xs hover:text-indigo-600 mb-2 transition-colors">
                  {l}
                </a>
              ))}
            </div>

            {/* Support */}
            <div>
              <div className="font-semibold text-gray-800 text-sm mb-3">Support</div>
              {["Contact Support", "Help Center"].map((l) => (
                <a key={l} href="#" className="block text-gray-400 text-xs hover:text-indigo-600 mb-2 transition-colors">
                  {l}
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <p className="text-gray-300 text-xs">© 2026 FundNest. The Digital Vault for your Capital.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FundNestLanding;