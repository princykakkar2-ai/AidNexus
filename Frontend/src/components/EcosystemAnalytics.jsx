import React from "react";

export default function EcosystemAnalytics({ problems = [] }) {
  // Reconcile stats dynamically by adding dynamic data to the baseline seed values
  const sanitationCount = 20 + problems.filter(p => p.category === "Sanitation").length;
  const infrastructureCount = 36 + problems.filter(p => p.category === "Infrastructure" || p.category === "Transportation").length;
  const environmentCount = 41 + problems.filter(p => p.category === "Environment" || p.category === "Waste Management").length;
  const educationCount = 15 + problems.filter(p => p.category === "Education").length;
  const otherCount = 16 + problems.filter(p => !["Sanitation", "Infrastructure", "Transportation", "Environment", "Waste Management", "Education"].includes(p.category)).length;

  const totalCat = sanitationCount + infrastructureCount + environmentCount + educationCount + otherCount;

  // Category Percentages
  const envPct = Math.max(1, Math.round((environmentCount / totalCat) * 100));
  const infrPct = Math.max(1, Math.round((infrastructureCount / totalCat) * 100));
  const saniPct = Math.max(1, Math.round((sanitationCount / totalCat) * 100));
  const eduPct = Math.max(1, Math.round((educationCount / totalCat) * 100));
  const otherPct = 100 - envPct - infrPct - saniPct - eduPct;

  // Priorities
  const highCount = 35 + problems.filter(p => p.priority === "CRITICAL" || p.priority === "HIGH").length;
  const mediumCount = 68 + problems.filter(p => p.priority === "MEDIUM").length;
  const lowCount = 22 + problems.filter(p => p.priority === "LOW" || !p.priority).length;

  const totalPri = highCount + mediumCount + lowCount;
  const highPct = Math.max(1, Math.round((highCount / totalPri) * 100));
  const medPct = Math.max(1, Math.round((mediumCount / totalPri) * 100));
  const lowPct = 100 - highPct - medPct;

  // Lifecycle logs
  const openCount = 45 + problems.filter(p => p.status === "SUBMITTED").length;
  const reviewCount = 32 + problems.filter(p => p.status === "UNDER_REVIEW").length;
  const activeCount = 26 + problems.filter(p => p.status === "IN_PROGRESS").length;
  const resolvedCount = 22 + problems.filter(p => p.status === "RESOLVED" || p.status === "REJECTED").length;

  return (
    <div className="w-full bg-white border border-[#CCCCCC] rounded-[2px] p-6 shadow-none">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 mb-6">
        <div>
          <h3 className="text-base font-black text-[#0B2545] uppercase tracking-wide">
            Ecosystem Analytics & Case Distribution Summary
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-semibold">
            Official department-wise classification, priority severity metrics, and resolution logs
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart 1: Donut ring for department distribution */}
        <div className="border border-slate-200 p-5 rounded-lg bg-slate-50/50 flex flex-col justify-between min-h-[300px]">
          <h4 className="text-xs font-black uppercase text-[#0B2545] border-b border-slate-100 pb-2 mb-4 tracking-wider">
            1. Classification by Department
          </h4>
          
          <div className="flex items-center justify-center gap-6 my-auto">
            {/* Donut Chart */}
            <div className="relative flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
                
                {/* Environment */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="4.5" strokeDasharray={`${envPct} 100`} strokeDashoffset="0" />
                {/* Infrastructure */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="4.5" strokeDasharray={`${infrPct} 100`} strokeDashoffset={`-${envPct}`} />
                {/* Sanitation */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6366F1" strokeWidth="4.5" strokeDasharray={`${saniPct} 100`} strokeDashoffset={`-${envPct + infrPct}`} />
                {/* Education */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray={`${eduPct} 100`} strokeDashoffset={`-${envPct + infrPct + saniPct}`} />
                {/* Others */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#64748B" strokeWidth="4.5" strokeDasharray={`${otherPct} 100`} strokeDashoffset={`-${envPct + infrPct + saniPct + eduPct}`} />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-[10px] font-black text-[#0B2545]">TOTAL</span>
                <span className="text-base font-black text-slate-800">{totalCat}</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-[9px] font-bold text-slate-600 uppercase">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#10B981] shrink-0"></span>
                <span>Env ({envPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#3B82F6] shrink-0"></span>
                <span>Infr ({infrPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#6366F1] shrink-0"></span>
                <span>Sani ({saniPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#F59E0B] shrink-0"></span>
                <span>Edu ({eduPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#64748B] shrink-0"></span>
                <span>Other ({otherPct}%)</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-[9px] text-center font-bold text-slate-400 uppercase tracking-wide">Case distribution by domain</div>
        </div>

        {/* Chart 2: Priority Severity Index (Stacked Bar Chart) */}
        <div className="border border-slate-200 p-5 rounded-lg bg-slate-50/50 flex flex-col justify-between min-h-[300px]">
          <h4 className="text-xs font-black uppercase text-[#0B2545] border-b border-slate-100 pb-2 mb-4 tracking-wider">
            2. Priority & Severity Distribution
          </h4>

          <div className="space-y-6 my-auto">
            {/* Horizontal Stacked Bar */}
            <div className="w-full h-8 rounded-lg overflow-hidden flex border border-slate-200/80 shadow-xs">
              <div className="bg-rose-500 hover:bg-rose-600 transition-colors text-white flex items-center justify-center text-[9px] font-black shrink-0" style={{ width: `${highPct}%` }}>
                {highPct > 15 ? `HIGH (${highPct}%)` : 'H'}
              </div>
              <div className="bg-orange-500 hover:bg-orange-600 transition-colors text-white flex items-center justify-center text-[9px] font-black shrink-0" style={{ width: `${medPct}%` }}>
                {medPct > 15 ? `MED (${medPct}%)` : 'M'}
              </div>
              <div className="bg-yellow-400 hover:bg-yellow-500 transition-colors text-yellow-950 flex items-center justify-center text-[9px] font-black shrink-0" style={{ width: `${lowPct}%` }}>
                {lowPct > 15 ? `LOW (${lowPct}%)` : 'L'}
              </div>
            </div>

            {/* List breakdown */}
            <div className="grid grid-cols-3 gap-3 text-center text-[10px] font-bold">
              <div className="bg-red-50 p-2.5 rounded border border-red-200">
                <span className="text-red-800 uppercase block tracking-wider">High</span>
                <p className="text-base font-black text-red-700 mt-1">{highCount}</p>
              </div>
              <div className="bg-orange-50 p-2.5 rounded border border-orange-200">
                <span className="text-orange-800 uppercase block tracking-wider">Medium</span>
                <p className="text-base font-black text-orange-700 mt-1">{mediumCount}</p>
              </div>
              <div className="bg-yellow-50 p-2.5 rounded border border-yellow-200">
                <span className="text-yellow-800 uppercase block tracking-wider">Low</span>
                <p className="text-base font-black text-yellow-700 mt-1">{lowCount}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-[9px] text-center font-bold text-slate-400 uppercase tracking-wide">Case severity and resolution index</div>
        </div>

        {/* Chart 3: Pipeline life tracking */}
        <div className="border border-slate-200 p-5 rounded-lg bg-slate-50/50 flex flex-col justify-between min-h-[300px]">
          <h4 className="text-xs font-black uppercase text-[#0B2545] border-b border-slate-100 pb-2 mb-4 tracking-wider">
            3. Case Lifecycle & Resolution Log
          </h4>

          <div className="space-y-4 pl-3 relative before:absolute before:left-7.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 my-auto">
            {/* Step 1 */}
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-9 w-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xs shadow-sm ring-4 ring-amber-100">1</div>
              <div>
                <span className="block text-[8.5px] font-black text-slate-400 uppercase">Awaiting Action</span>
                <span className="block text-xs font-extrabold text-[#0B2545] uppercase">{openCount} Cases Logged</span>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-9 w-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-xs shadow-sm ring-4 ring-blue-100">2</div>
              <div>
                <span className="block text-[8.5px] font-black text-slate-400 uppercase">Under Review</span>
                <span className="block text-xs font-extrabold text-[#0B2545] uppercase">{reviewCount} In Verification</span>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-9 w-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-black text-xs shadow-sm ring-4 ring-indigo-100">3</div>
              <div>
                <span className="block text-[8.5px] font-black text-slate-400 uppercase">Active Workspace</span>
                <span className="block text-xs font-extrabold text-[#0B2545] uppercase">{activeCount} Developing Solutions</span>
              </div>
            </div>
            {/* Step 4 */}
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-sm ring-4 ring-emerald-100">✓</div>
              <div>
                <span className="block text-[8.5px] font-black text-slate-400 uppercase">Resolved & Closed</span>
                <span className="block text-xs font-extrabold text-[#0B2545] uppercase">{resolvedCount} Completed Archives</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-[9px] text-center font-bold text-slate-400 uppercase tracking-wide">Dynamic workflow pipeline tracking</div>
        </div>
      </div>
    </div>
  );
}
