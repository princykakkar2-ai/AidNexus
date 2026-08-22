import { useState } from "react";
import { Link } from "react-router-dom";
import background from "../assets/bg2.png";
import Navbar from "../components/Navbar";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div 
    >
      <div className="absolute inset-0 bg-white/90 z-0 pointer-events-none"></div>
      <div className="relative z-10">
        <Navbar />
        <section className="mx-auto max-w-4xl px-6 py-20 flex flex-col items-center justify-center text-center">
          <div className="mb-6 inline-flex rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm text-teal-700 font-medium">
            🛡️ Smart Civic Problem-Solving Platform
          </div>

          <h1 className="text-5xl font-bold leading-tight md:text-6xl text-slate-900">
            Turn
            <span className="text-teal-600"> Problems </span>
            Into
            <span className="text-amber-600"> Solutions.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            CivicConnect brings you closer to your city's heart. Collaborate with 
            neighbors, students, and officials to co-create a better, brighter, more 
            sustainable future for your community.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to="/submit-problem"
              className="rounded-full bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700 shadow-sm transition-all"
            >
              Report a Problem →
            </Link>

            <Link
              to="/problems"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
            >
              Explore Problems
            </Link>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y border-slate-200 bg-slate-50/70 backdrop-blur-sm">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
            <Stat number="1,248+" label="Problems Reported" />
            <Stat number="586+" label="Solutions Created" />
            <Stat number="240+" label="Students & Experts" />
            <Stat number="85+" label="Organizations" />
          </div>
        </section>

        {/* NEW FEATURE 1: Category Explorer */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">
              Explore Domains
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Explore Domains
            </h2>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {["All", "Environment", "Transportation", "Education", "Healthcare", "Infrastructure"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-amber-500 text-slate-900 font-semibold shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 shadow-sm"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </section>

        {/* NEW FEATURE 2: Trending & Most Upvoted Problems */}
        <section className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Top Voted Civic Issues</h2>
              <p className="text-slate-500 text-sm">Issues needing urgent innovation teams</p>
            </div>
            <Link to="/problems" className="text-sm font-semibold text-teal-600 hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <TrendingCard
              title="Pothole Detection & Rapid Patch System"
              category="Infrastructure"
              votes={342}
              location="Ward 12, Delhi"
              status="Solutions Open"
            />
            <TrendingCard
              title="Solar Micro-Grid for Rural Schools"
              category="Clean Energy"
              votes={289}
              location="Solar Energy"
              status="Under Review"
            />
            <TrendingCard
              title="AI Water Leak Detection Network"
              category="Environment"
              votes={210}
              location="AI Water Leak Detection Network"
              status="Solutions Open"
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">
              HOW IT WORKS
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl text-slate-900">
              HOW IT WORKS
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              A simple platform that transforms real-world challenges into collaborative solutions.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <Step number="01" icon="📝" title="Report" text="Citizens submit real-world problems." />
            <Step number="02" icon="🤖" title="Analyze" text="AI categorizes and prioritizes the problem." />
            <Step number="03" icon="💡" title="Innovate" text="Students and experts propose solutions." />
            <Step number="04" icon="🚀" title="Implement" text="Organizations evaluate and implement solutions." />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row">
            <p>© 2026 CivicConnect Platform. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-slate-800">Privacy</Link>
              <Link to="/contact" className="hover:text-slate-800">Contact</Link>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function ProblemCard({ title, category, priority, badgeBg }) {
  return (
    <div className={`rounded-2xl p-4 flex items-center justify-between gap-4 border border-slate-200 shadow-sm ${badgeBg}`}>
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {category && <p className="text-xs text-slate-500 mt-0.5">{category}</p>}
      </div>
      <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
        {priority}
      </span>
    </div>
  );
}

function TrendingCard({ title, category, votes, location, status }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-teal-300 transition-all">
      <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
        <span>📍 {location}</span>
        <span className="text-teal-600 font-semibold">{status}</span>
      </div>
      <h3 className="font-bold text-slate-900 text-base">{title}</h3>
      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
          {category}
        </span>
        <div className="flex items-center gap-1 text-sm font-semibold text-teal-600">
          ▲ {votes} <span className="text-xs text-slate-400">votes</span>
        </div>
      </div>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="text-center">
      <h3 className="text-4xl font-extrabold text-amber-600">{number}</h3>
      <p className="mt-2 text-sm text-slate-600">{label}</p>
    </div>
  );
}

function Step({ number, icon, title, text }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-teal-600">{number}</span>
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="mt-6 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}