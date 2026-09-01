import React from "react";

export interface FooterLink {
  label: string;
  href?: string;
  underline?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  tagline?: string;
  columns?: FooterColumn[];
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [{ label: "Features" }, { label: "Security", underline: true }, { label: "Pricing" }],
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

const Footer: React.FC<FooterProps> = ({
  tagline = "The Digital Vault for your Capital. Institutional-grade chit fund management software for the modern economy.",
  columns = DEFAULT_COLUMNS,
}) => {
  return (
    <footer className="border-t border-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <p className="text-base font-bold text-slate-900">FundNest</p>
          <p className="mt-2 max-w-xs text-sm text-slate-500">{tagline}</p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-bold text-slate-900">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href ?? "#"}
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
        <p className="text-xs text-slate-400">© 2026 FundNest. The Digital Vault for your Capital.</p>
      </div>
    </footer>
  );
};

export default Footer;