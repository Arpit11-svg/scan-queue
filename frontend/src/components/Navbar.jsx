import React from "react";
import { Link } from "react-router-dom";
import Logo from "./ui/Logo.jsx";

// components/Navbar.jsx
function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-white">
          <Logo className="h-7 w-7 text-blue-500" />
          <span className="text-xl font-bold">ScanQ</span>
        </Link>

        <nav className="hidden gap-8 text-sm text-slate-300 md:flex">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#dashboard" className="hover:text-white">Dashboard</a>
          <a href="#who" className="hover:text-white">Who it's for</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white">
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
