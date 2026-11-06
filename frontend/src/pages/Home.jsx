import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

// pages/Home.jsx
const problems = [
  { title: "Customers walk out", text: "when they see a long line" },
  { title: "Staff shout names", text: "creating chaos during rush" },
  {
    title: "Waiting rooms overflow",
    text: "and nobody knows how long it will take",
  },
];

const features = [
  {
    icon: "📱",
    title: "QR check-in",
    text: "Customers scan the code at your door and join the line in seconds. No app to install.",
  },
  {
    icon: "⏱️",
    title: "Live updates",
    text: "They see their position and estimated wait on their phone, so they can sit in the car or grab a coffee.",
  },
  {
    icon: "🔔",
    title: "Turn alerts",
    text: "When it's almost their turn, they get a notification and walk in right on time.",
  },
];

const dashboard = [
  {
    title: "Staff dashboard",
    text: "See the whole line, call the next person, or remove no-shows in one click.",
  },
  {
    title: "Easy setup",
    text: "Sign up, print your QR code, put it at the entrance, and you're live.",
  },
  {
    title: "Works on any device",
    text: "Run your queue from a phone, tablet, or the front-desk computer.",
  },
];

const places = [
  {
    icon: "🏥",
    title: "Hospitals & clinics",
    text: "Patients wait comfortably instead of crowding the corridor.",
  },
  {
    icon: "🍽️",
    title: "Restaurants & cafes",
    text: "Guests get a table alert, so the entrance stays clear.",
  },
  {
    icon: "✂️",
    title: "Barber shops & salons",
    text: "Customers arrive just in time for their turn.",
  },
];

const queue = [
  { n: 1, name: "Emma W.", status: "Serving" },
  { n: 2, name: "James K.", status: "Up next" },
  { n: 3, name: "Sophie L.", status: "Waiting" },
  { n: 4, name: "Mike T.", status: "Waiting" },
];

function Home() {
  return (
    <div className="bg-white text-slate-900">
      <Navbar />

      {/* HERO */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              No more standing in line.
            </h1>
            <p className="mt-6 max-w-md text-lg text-slate-300">
              ScanQ lets customers join your queue by scanning a QR code. No
              hardware, no app downloads, no crowded waiting area.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="rounded-full bg-blue-600 px-7 py-3 font-semibold hover:bg-blue-700"
              >
                Start for free
              </Link>
              <a
                href="#features"
                className="rounded-full border border-white/20 px-7 py-3 font-semibold hover:bg-white/10"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* phone mock */}
          <div className="mx-auto w-64 rounded-[2rem] border-4 border-slate-700 bg-white p-6 text-center text-slate-900 shadow-2xl shadow-blue-600/20">
            <p className="text-xs text-slate-500">Max Hospital</p>
            <div className="mx-auto my-5 flex h-24 w-24 items-center justify-center rounded-full border-4 border-blue-600 text-4xl font-bold">
              4
            </div>
            <p className="font-semibold">You're #4 in line</p>
            <p className="text-sm text-blue-600">about 12 min</p>
            <div className="mt-5 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white">
              Notify me when it's my turn
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="border-b border-slate-200 bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-2xl md:text-3xl">
            Still managing the lines by hand?
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {problems.map((p) => (
              <div key={p.title}>
                <span className="text-xl text-red-500">❌</span>
                <p className="mt-2 font-semibold">{p.title}</p>
                <p className="text-sm text-slate-500">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            Let your customers roam free
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-slate-600">
            They scan, go about their day, and come back when you're ready for
            them.
          </p>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title}>
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-3 text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section id="dashboard" className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
          {/* queue mock */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold">Waiting list</p>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Live
              </span>
            </div>
            <ul className="space-y-2">
              {queue.map((q) => (
                <li
                  key={q.n}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm ${
                    q.n === 1
                      ? "bg-orange-100"
                      : q.n === 2
                        ? "bg-green-100"
                        : "bg-slate-100"
                  }`}
                >
                  <span className="font-medium">
                    {q.n}. {q.name}
                  </span>
                  <span className="text-slate-500">{q.status}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold md:text-4xl">
              Run your queue from one screen
            </h2>
            <div className="mt-8 space-y-6">
              {dashboard.map((d) => (
                <div key={d.title}>
                  <h3 className="font-semibold">{d.title}</h3>
                  <p className="text-slate-600">{d.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section id="who" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            Built for places with a line
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {places.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-slate-200 p-6"
              >
                <span className="text-3xl">{p.icon}</span>
                <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
                <p className="mt-1 text-slate-600">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 text-center text-white">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to clear your waiting area?
        </h2>
        <p className="mt-3 text-blue-100">
          Create your account and get your QR code in minutes.
        </p>
        <Link
          to="/signup"
          className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-semibold text-blue-700 hover:bg-blue-50"
        >
          Create business account
        </Link>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
