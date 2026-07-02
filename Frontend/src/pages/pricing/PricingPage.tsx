import { useState } from "react";

// ─── Shared Logo / Brand ──────────────────────────────────────────────────────
const Logo = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <circle cx="13" cy="13" r="13" fill="#4ADE80" fillOpacity="0.2" />
    <circle cx="13" cy="13" r="7.5" fill="#22C55E" fillOpacity="0.6" />
    <circle cx="13" cy="13" r="3.5" fill="#16A34A" />
  </svg>
);

// ─── Icon helpers ─────────────────────────────────────────────────────────────
const CheckCircle = ({ className = "" }: { className?: string }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    className={`shrink-0 ${className}`}
  >
    <circle cx="12" cy="12" r="12" fill="#22C55E" fillOpacity="0.15" />
    <circle cx="12" cy="12" r="12" fill="currentColor" fillOpacity="0.1" />
    <path
      d="M7 12.5l3.5 3.5 6.5-7"
      stroke="#22C55E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CrossCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <circle cx="12" cy="12" r="12" fill="#94A3B8" fillOpacity="0.12" />
    <path
      d="M9 9l6 6M15 9l-6 6"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ScaleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 3v18M3 9l9-6 9 6M5 21h14" />
    <path d="M3 9l4 6H3zM17 9l4 6h-4z" />
  </svg>
);

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={`transition-transform duration-300 shrink-0 ${open ? "rotate-180" : ""}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlanFeature {
  label: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  features: PlanFeature[];
  cta: string;
  highlighted: boolean;
  badge?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Essential tools for small personal groups.",
    price: "₹299",
    period: "/mo",
    features: [
      { label: "Up to 2 Active Chits", included: true },
      { label: "Max users: 20", included: true },
      { label: "Basic notifications", included: true },
      { label: "No fund suggestions", included: false },
    ],
    cta: "Subscribe Now",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "The standard for professional fund managers.",
    price: "₹799",
    period: "/mo",
    features: [
      { label: "Max funds: 10", included: true },
      { label: "Max users: 100", included: true },
      { label: "Payment reminders", included: true },
      { label: "Autopay", included: true },
      { label: "Fund suggestion", included: true },
    ],
    cta: "Subscribe Now",
    highlighted: true,
    badge: "MOST POPULAR",
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Bespoke infrastructure for large institutions.",
    price: "₹1499",
    period: "/mo",
    features: [
      { label: "Unlimited fund", included: true },
      { label: "Unlimited users", included: true },
      { label: "Autopay", included: true },
      { label: "Fund suggestion", included: true },
    ],
    cta: "Subscribe Now",
    highlighted: false,
  },
];

const faqs: FaqItem[] = [
  {
    question: "Can I switch plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Adjustments will be reflected in your next billing cycle.",
  },
  {
    question: "What is the processing fee?",
    answer:
      "FundNest does not take a percentage of your capital. You only pay the flat monthly subscription fee.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "We offer a 14-day free trial on our Basic and Pro plans for you to explore the interface.",
  },
  {
    question: "Do you offer discounts for non-profits?",
    answer:
      "Contact our sales team for specialized rates for community saving groups and NGOs.",
  },
];

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
const FaqItem = ({ item }: { item: FaqItem }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl p-5 cursor-pointer select-none hover:border-gray-200 transition-colors"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-indigo-600 font-semibold text-[14px] leading-snug">{item.question}</h4>
        <ChevronDown open={open} />
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 mt-3" : "max-h-0"}`}
      >
        <p className="text-gray-500 text-sm leading-relaxed">{item.answer}</p>
      </div>
      {/* Always show answer (matches the original design where answers are visible) */}
      {!open && (
        <p className="text-gray-500 text-sm leading-relaxed mt-2">{item.answer}</p>
      )}
    </div>
  );
};

// ─── Pricing Card ─────────────────────────────────────────────────────────────
const PricingCard = ({ plan }: { plan: Plan }) => {
  if (plan.highlighted) {
    return (
      <div className="relative z-10 flex flex-col">
        {/* Badge */}
        <div className="flex justify-center mb-0">
          <span className="bg-emerald-400 text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-sm">
            {plan.badge}
          </span>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl px-7 py-8 flex flex-col gap-5 shadow-2xl"
          style={{
            background: "linear-gradient(150deg, #3730a3 0%, #4f46e5 45%, #6d5bde 100%)",
          }}
        >
          {/* Name + tagline */}
          <div>
            <h3 className="text-white text-xl font-bold mb-1">{plan.name}</h3>
            <p className="text-indigo-200 text-sm">{plan.tagline}</p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1 border-b border-indigo-400/40 pb-5">
            <span className="text-white text-4xl font-extrabold tracking-tight">{plan.price}</span>
            <span className="text-indigo-300 text-sm font-medium">{plan.period}</span>
          </div>

          {/* Features */}
          <ul className="flex flex-col gap-3">
            {plan.features.map((f) => (
              <li key={f.label} className="flex items-center gap-3">
                <CheckCircle />
                <span className="text-white text-sm font-medium">{f.label}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button className="mt-2 bg-emerald-400 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 rounded-full transition-colors shadow-md shadow-emerald-900/30 tracking-wide">
            {plan.cta}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-6 py-8 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow self-center w-full">
      {/* Name + tagline */}
      <div>
        <h3 className="text-gray-900 text-lg font-bold mb-1">{plan.name}</h3>
        <p className="text-gray-400 text-sm">{plan.tagline}</p>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1">
        <span className="text-gray-900 text-3xl font-extrabold tracking-tight">{plan.price}</span>
        <span className="text-gray-400 text-sm font-medium">{plan.period}</span>
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-2.5">
        {plan.features.map((f) => (
          <li key={f.label} className="flex items-center gap-3">
            {f.included ? <CheckCircle /> : <CrossCircle />}
            <span className={`text-sm ${f.included ? "text-gray-700" : "text-gray-400"}`}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button className="mt-auto border border-gray-200 text-gray-700 font-semibold text-sm py-3 rounded-full hover:border-indigo-300 hover:text-indigo-600 transition-colors">
        {plan.cta}
      </button>
    </div>
  );
};

// ─── Office Image (SVG placeholder matching the bank/office photo feel) ───────
const OfficeImage = () => (
  <div className="w-full h-full min-h-[260px] rounded-2xl overflow-hidden relative bg-gradient-to-br from-blue-900 via-blue-700 to-slate-800 flex items-end">
    {/* Abstract office scene */}
    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      {/* Floor */}
      <rect x="0" y="200" width="400" height="100" fill="#1e3a5f" />
      {/* Wall */}
      <rect x="0" y="0" width="400" height="210" fill="#1a4a7a" />
      {/* Glass partition */}
      <rect x="240" y="60" width="120" height="150" rx="2" fill="#2563eb" fillOpacity="0.25" stroke="#3b82f6" strokeWidth="1.5" />
      <rect x="260" y="60" width="2" height="150" fill="#3b82f6" fillOpacity="0.4" />
      <rect x="300" y="60" width="2" height="150" fill="#3b82f6" fillOpacity="0.4" />
      <rect x="340" y="60" width="2" height="150" fill="#3b82f6" fillOpacity="0.4" />
      {/* Monitor / display on wall */}
      <rect x="30" y="40" width="180" height="110" rx="6" fill="#0f2d54" stroke="#2563eb" strokeWidth="1.5" />
      <rect x="38" y="48" width="164" height="94" rx="3" fill="#1e3a78" />
      {/* Screen content lines */}
      <rect x="48" y="60" width="80" height="6" rx="3" fill="#3b82f6" fillOpacity="0.7" />
      <rect x="48" y="72" width="130" height="4" rx="2" fill="#60a5fa" fillOpacity="0.4" />
      <rect x="48" y="80" width="110" height="4" rx="2" fill="#60a5fa" fillOpacity="0.3" />
      <rect x="48" y="95" width="50" height="28" rx="3" fill="#2563eb" fillOpacity="0.5" />
      <rect x="106" y="95" width="50" height="28" rx="3" fill="#1d4ed8" fillOpacity="0.5" />
      <rect x="162" y="95" width="26" height="28" rx="3" fill="#1e40af" fillOpacity="0.5" />
      {/* Kiosk stand */}
      <rect x="130" y="160" width="30" height="50" rx="2" fill="#0f2d54" stroke="#1d4ed8" strokeWidth="1" />
      <rect x="118" y="155" width="54" height="12" rx="3" fill="#1d4ed8" fillOpacity="0.6" />
      <rect x="115" y="205" width="60" height="6" rx="2" fill="#1e3a5f" />
      {/* Ceiling light */}
      <ellipse cx="200" cy="5" rx="80" ry="12" fill="#60a5fa" fillOpacity="0.15" />
      <rect x="170" y="0" width="60" height="4" rx="2" fill="#93c5fd" fillOpacity="0.4" />
      {/* Reflection on floor */}
      <ellipse cx="160" cy="220" rx="100" ry="20" fill="#2563eb" fillOpacity="0.08" />
    </svg>
    {/* Overlay gradient for depth */}
    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 to-transparent" />
  </div>
);

// ─── Main Pricing Page ────────────────────────────────────────────────────────
const PricingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">

      {/* ── Navbar ───────────────────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-gray-900 text-[16px] tracking-tight">FundNest</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {(["Home", "Pricing", "Register", "Login"] as const).map((link) => (
              <a
                key={link}
                href="/"
                className={`text-sm font-medium transition-colors ${
                  link === "Pricing"
                    ? "text-indigo-600 border-b-2 border-indigo-600 pb-0.5"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {link}
              </a>
            ))}
          </div>

          <button className="hidden md:inline-flex bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors shadow-sm shadow-indigo-200">
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
              <a key={link} href="/" className="text-sm text-gray-600 hover:text-indigo-600 font-medium py-1">
                {link}
              </a>
            ))}
            <button className="mt-2 bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-full">
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="pt-14 pb-8 px-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.08] tracking-tight mb-2">
          Secure Your Capital
        </h1>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-indigo-600 leading-[1.08] tracking-tight mb-5">
          Scale Your Growth
        </h2>
        <p className="text-gray-500 text-[15px] leading-relaxed max-w-md mx-auto">
          Transparent pricing for individual savers and institutional fund managers.
          <br className="hidden sm:block" />
          Choose the vault that fits your financial journey.
        </p>
      </section>

      {/* ── Pricing Cards ────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        {/* Three-column grid — Pro card is taller and overlaps vertically */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-start">
          {/* Basic */}
          <div className="md:mt-16">
            <PricingCard plan={plans[0]} />
          </div>

          {/* Pro (highlighted, tallest) */}
          <div className="md:-mt-2">
            <PricingCard plan={plans[1]} />
          </div>

          {/* Premium */}
          <div className="md:mt-16">
            <PricingCard plan={plans[2]} />
          </div>
        </div>
      </section>

      {/* ── Why Trust FundNest ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left: Office photo */}
          <div className="h-64 md:h-80 rounded-2xl overflow-hidden shadow-md">
            <OfficeImage />
          </div>

          {/* Right: Trust points */}
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
              Why Trust FundNest?
            </h2>

            <div className="flex flex-col gap-7">
              {/* Bank-Grade Encryption */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                  <ShieldIcon />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[15px] mb-1">Bank-Grade Encryption</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Every transaction is layered with AES-256 encryption, ensuring your vault remains private and impenetrable.
                  </p>
                </div>
              </div>

              {/* Regulatory Compliance */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <ScaleIcon />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[15px] mb-1">Regulatory Compliance</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Automated reporting tools keep your chit fund operations fully compliant with regional financial laws.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center tracking-tight mb-10">
          Common Questions
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h4 className="text-indigo-600 font-semibold text-[14px] mb-2">{faq.question}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <Logo />
                <span className="font-bold text-indigo-600 text-[15px]">FundNest</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed max-w-[180px]">
                The Digital Vault for your Capital. Pioneering trust in community finance.
              </p>
            </div>

            {/* Platform */}
            <div>
              <div className="font-semibold text-gray-800 text-sm mb-3">Platform</div>
              {["About Us", "Security", "Pricing"].map((l, i) => (
                <a
                  key={l}
                  href="#"
                  className={`block text-xs mb-2 transition-colors ${
                    i === 2 ? "text-indigo-500 hover:text-indigo-700 font-medium" : "text-gray-400 hover:text-indigo-500"
                  }`}
                >
                  {l}
                </a>
              ))}
            </div>

            {/* Legal */}
            <div>
              <div className="font-semibold text-gray-800 text-sm mb-3">Legal</div>
              {["Terms of Service", "Privacy Policy"].map((l) => (
                <a key={l} href="#" className="block text-gray-400 text-xs hover:text-indigo-500 mb-2 transition-colors">
                  {l}
                </a>
              ))}
            </div>

            {/* Help */}
            <div>
              <div className="font-semibold text-gray-800 text-sm mb-3">Help</div>
              {["Contact Support", "Documentation"].map((l) => (
                <a key={l} href="#" className="block text-gray-400 text-xs hover:text-indigo-500 mb-2 transition-colors">
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

export default PricingPage;