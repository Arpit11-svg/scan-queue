import React from "react";
import { Link } from "react-router-dom";
import Logo from "./ui/Logo.jsx";

// components/Footer.jsx
const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Dashboard", href: "/#dashboard" },
      { label: "Who it's for", href: "/#who" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", to: "/login" },
      { label: "Create account", to: "/signup" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "hello@scanq.com", href: "mailto:hello@scanq.com" },
      { label: "Privacy policy", href: "#" },
      { label: "Terms of service", href: "#" },
    ],
  },
];

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-white">
            <Logo className="h-7 w-7 text-blue-500" />
            <span className="text-xl font-bold">ScanQ</span>
          </div>
          <p className="mt-4 max-w-xs text-sm">
            Scan a QR code, join the line from your phone, and skip the wait.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-4 font-semibold text-white">{col.title}</p>
            <ul className="space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.to ? (
                    <Link to={l.to} className="hover:text-white">{l.label}</Link>
                  ) : (
                    <a href={l.href} className="hover:text-white">{l.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 py-6 text-center text-sm">
        © {new Date().getFullYear()} ScanQ. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
