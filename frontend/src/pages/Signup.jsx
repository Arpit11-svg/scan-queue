import React from "react";
import { Link } from "react-router-dom";
import SignupForm from "../components/SignupForm.jsx";

function Logo({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="2" y="2" width="8" height="8" rx="2" />
      <rect x="14" y="2" width="8" height="8" rx="2" />
      <rect x="2" y="14" width="8" height="8" rx="2" />
      <rect x="14" y="14" width="3" height="3" />
      <rect x="19" y="14" width="3" height="3" />
      <rect x="14" y="19" width="3" height="3" />
      <rect x="19" y="19" width="3" height="3" />
    </svg>
  );
}

const places = [
  {
    icon: "🏥",
    title: "Hospitals",
    text: "Patients wait at home or in the car, not in a crowded corridor.",
  },
  {
    icon: "🍽️",
    title: "Restaurants",
    text: "Guests scan at the door and get a table alert on their phone.",
  },
  {
    icon: "✂️",
    title: "Barber shops",
    text: "Customers see their turn live and arrive just in time.",
  },
];

function Signup() {
  return (
    <div className="grid min-h-screen bg-slate-950 lg:grid-cols-2">
      {/* LEFT: product promo (hidden on small screens) */}
      <div className="hidden flex-col justify-between bg-blue-600 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <Logo className="h-9 w-9" />
          <span className="text-2xl font-bold tracking-tight">ScanQ</span>
        </div>

        <div>
          <h1 className="max-w-md text-3xl font-bold leading-tight">
            <span className="block">No more Physical lines.</span>
            <span className="block">Scan the QRCode.</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-blue-100">
            Customers scan your QR code, join the queue from their phone, and
            walk in when it is their turn.
          </p>

          <div className="mt-10 space-y-5">
            {places.map((p) => (
              <div key={p.title} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-xl">
                  {p.icon}
                </span>
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-blue-100">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-blue-200">
          © {new Date().getFullYear()} ScanQ. No more physical lines.
        </p>
      </div>

      {/* RIGHT: signup form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 text-white lg:hidden">
            <Logo className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold">ScanQ</span>
          </div>

          <h2 className="text-3xl font-bold text-white">
            Create your business account
          </h2>
          <p className="mb-8 mt-2 text-slate-400">
            Set up your queue in minutes and get your QR code.
          </p>

          <SignupForm />

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
