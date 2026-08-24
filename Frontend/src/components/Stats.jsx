import { useEffect, useState } from "react";
import { fetchStats } from "../services/api";

function StatCard({ number, label, increase, icon, accentBorder, iconBg, textColor }) {
  return (
    <div className={`relative overflow-hidden rounded-[2px] border border-[#CCCCCC] bg-white p-6 shadow-none transition-colors duration-100  hover:shadow-none border-t-4 ${accentBorder}`}>
      {/* Decorative subtle background design */}
      <div className="absolute right-0 top-0 h-16 w-16 translate-x-4 -translate-y-4 rounded-full bg-slate-50 opacity-40"></div>

      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-[2px] border border-[#CCCCCC] ${iconBg} shadow-inner`}>
          {icon}
        </div>
        <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 shadow-none">
          <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 24 24">
            <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
          </svg>
          {increase}
        </span>
      </div>

      <div className="mt-5">
        <h3 className={`text-3.5xl font-black tracking-tight ${textColor} font-sans leading-none`}>
          {number}
        </h3>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="mt-0.5 text-[9px] text-slate-400 font-semibold uppercase tracking-wide">
          vs last week
        </p>
      </div>
    </div>
  );
}

export default function Stats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Configuration for presentation and fallbacks
  const statConfig = {
    totalProblems: {
      defaultNumber: "128",
      label: "Total Problems",
      increase: "12%",
      accentBorder: "border-t-amber-500",
      iconBg: "bg-amber-50 text-amber-600",
      textColor: "text-slate-900",
      icon: (
        <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    solutionsSubmitted: {
      defaultNumber: "76",
      label: "Solutions Submitted",
      increase: "18%",
      accentBorder: "border-t-emerald-500",
      iconBg: "bg-emerald-50 text-emerald-600",
      textColor: "text-slate-900",
      icon: (
        <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    activeProjects: {
      defaultNumber: "42",
      label: "Active Projects",
      increase: "15%",
      accentBorder: "border-t-blue-500",
      iconBg: "bg-blue-50 text-blue-600",
      textColor: "text-slate-900",
      icon: (
        <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      )
    },
    industryExperts: {
      defaultNumber: "18",
      label: "Industry Experts",
      increase: "5%",
      accentBorder: "border-t-purple-500",
      iconBg: "bg-purple-50 text-purple-600",
      textColor: "text-slate-900",
      icon: (
        <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    aiResolution: {
      defaultNumber: "78%",
      label: "AI Resolution Score",
      increase: "10%",
      accentBorder: "border-t-cyan-500",
      iconBg: "bg-cyan-50 text-cyan-600",
      textColor: "text-slate-900",
      icon: (
        <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  };

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchStats();
        // Map dynamic values matching statConfig keys
        const mergedData = Object.keys(statConfig).map(key => {
          const fetchedStat = data?.find(item => item.key === key);
          return {
            key,
            number: fetchedStat ? fetchedStat.number : statConfig[key].defaultNumber,
            label: fetchedStat ? fetchedStat.label : statConfig[key].label,
            increase: fetchedStat ? fetchedStat.increase : statConfig[key].increase,
            ...statConfig[key]
          };
        });
        setStats(mergedData);
      } catch (err) {
        console.warn("Failed to fetch dynamic stats, using fallback defaults.", err);
        const fallbackData = Object.keys(statConfig).map(key => ({
          key,
          number: statConfig[key].defaultNumber,
          label: statConfig[key].label,
          increase: statConfig[key].increase,
          ...statConfig[key]
        }));
        setStats(fallbackData);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <section className="border-y border-[#CCCCCC] bg-slate-50/50 py-10 shadow-none">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {loading
            ? Object.keys(statConfig).map(key => (
              <div key={key} className="animate-pulse rounded-[2px] border border-[#CCCCCC] bg-white p-6 shadow-none min-h-[140px] flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <div className="h-11 w-11 rounded-[2px] bg-slate-200"></div>
                  <div className="h-6 w-12 rounded bg-slate-200"></div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="h-8 w-16 rounded bg-slate-200"></div>
                  <div className="h-3 w-24 rounded bg-slate-200"></div>
                </div>
              </div>
            ))
            : stats.map(({ key, ...statProps }) => (
              <StatCard key={key} {...statProps} />
            ))
          }
        </div>
      </div>
    </section>
  );
}