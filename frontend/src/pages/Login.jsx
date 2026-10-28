import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";

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

const steps = [
  { title: "Customer scans your QR", text: "No app to install, it opens right in their phone browser." },
  { title: "They join the queue", text: "Their place in line is saved and updated live." },
  { title: "You call the next person", text: "They get notified and walk in exactly when it is their turn." },
];

function Login() {
  return (
    <div className="grid min-h-screen bg-slate-950 lg:grid-cols-2">
      {/* LEFT: product promo (hidden on small screens) */}
      <div className="hidden flex-col justify-between bg-blue-600 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <Logo className="h-9 w-9" />
          <span className="text-2xl font-bold tracking-tight">ScanQ</span>
        </div>

        <div>
          <h1 className="max-w-md text-5xl font-bold leading-tight">
            Your queue is waiting for you.
          </h1>
          <p className="mt-4 max-w-md text-lg text-blue-100">
            Log in to see who is in line, call the next customer, and keep your
            waiting area empty.
          </p>

          <ol className="mt-10 space-y-5">
            {steps.map((s, i) => (
              <li key={s.title} className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white font-bold text-blue-600">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-sm text-blue-100">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="text-sm text-blue-200">
          © {new Date().getFullYear()} ScanQ. No more physical lines.
        </p>
      </div>

      {/* RIGHT: login form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 text-white lg:hidden">
            <Logo className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold">ScanQ</span>
          </div>

          <h2 className="text-3xl font-bold text-white">Welcome back</h2>
          <p className="mb-8 mt-2 text-slate-400">
            Log in to manage your business queue.
          </p>

          <LoginForm />

          <p className="mt-6 text-center text-sm text-slate-400">
            New to ScanQ?{" "}
            <Link to="/signup" className="font-medium text-blue-500 hover:text-blue-400">
              Create a business account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
