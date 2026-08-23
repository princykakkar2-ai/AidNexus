import { useState } from "react";

export default function DomainExplorer() {

  const [activeCategory, setActiveCategory] = useState("All");

  const domains = [
    { name: "All", icon: "🌐", count: "1,248" },
    { name: "Environment", icon: "🌱", count: "312" },
    { name: "Transportation", icon: "🚦", count: "284" },
    { name: "Education", icon: "📚", count: "195" },
    { name: "Healthcare", icon: "🏥", count: "168" },
    { name: "Infrastructure", icon: "🏗️", count: "289" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200">

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Domain Classification
          </span>

          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Explore Civic Sectors
          </h2>
        </div>

        <p className="text-sm text-slate-500 mt-2 md:mt-0">
          Filter issues by department oversight
        </p>

      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

        {domains.map((domain) => {

          const isActive = activeCategory === domain.name;

          return (
            <button
              key={domain.name}
              onClick={() => setActiveCategory(domain.name)}
              className={`group relative flex flex-col items-start p-4 rounded-lg border text-left transition-all ${isActive
                  ? "border-slate-900 bg-slate-900 text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50"
                }`}
            >

              <div className="flex items-center justify-between w-full mb-3">

                <span className="text-2xl">
                  {domain.icon}
                </span>

                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${isActive
                      ? "bg-slate-800 text-slate-300"
                      : "bg-slate-100 text-slate-600"
                    }`}
                >
                  {domain.count}
                </span>

              </div>

              <span className="text-sm font-semibold tracking-tight">
                {domain.name}
              </span>

              <span
                className={`text-[11px] mt-0.5 ${isActive
                    ? "text-slate-400"
                    : "text-slate-500"
                  }`}
              >
                View Registry
              </span>

            </button>
          );
        })}

      </div>

    </section>
  );
}