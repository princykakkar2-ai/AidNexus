import React from "react";

export default function EcosystemAnalytics() {
  // 1. Department-wise Problem Classifications
  const categories = [
    { label: "Environment & Pollution Control", count: 41, percentage: "32%", ministry: "Ministry of Environment" },
    { label: "Infrastructure Development", count: 36, percentage: "28%", ministry: "Ministry of Road Transport" },
    { label: "Healthcare Services & Sanitation", count: 20, percentage: "16%", ministry: "Ministry of Health & Family Welfare" },
    { label: "Education & Digital Literacy", count: 15, percentage: "12%", ministry: "Ministry of Education" },
    { label: "Water Resource Management", count: 10, percentage: "8%", ministry: "Ministry of Jal Shakti" },
    { label: "Other Civic Demands", count: 6, percentage: "4%", ministry: "Department of Local Governance" },
  ];

  // 2. Priority / Severity Metric
  const priorities = [
    { label: "High Priority", count: 35, percentage: "27%", action: "Immediate matching required (within 24h)", color: "text-red-700 font-bold" },
    { label: "Medium Priority", count: 68, percentage: "53%", action: "Standard match sequence (within 3 days)", color: "text-amber-700 font-bold" },
    { label: "Low Priority", count: 25, percentage: "20%", action: "Routine review (within 7 days)", color: "text-slate-700 font-bold" },
  ];

  // 3. Status Tracking Logs
  const statuses = [
    { label: "Open (Unassigned)", count: 45, percentage: "35%", actionRequired: "Awaiting student team assignment" },
    { label: "Under Expert Review", count: 32, percentage: "25%", actionRequired: "Awaiting mentor verification feedback" },
    { label: "Solution Submitted", count: 26, percentage: "20%", actionRequired: "Awaiting sponsor review & funding" },
    { label: "In Progress", count: 15, percentage: "12%", actionRequired: "Team building prototype milestone" },
    { label: "Resolved & Closed", count: 10, percentage: "8%", actionRequired: "Grievance successfully addressed" },
  ];

  return (
    <div className="w-full bg-white border border-[#CCCCCC] rounded-[2px] p-6 shadow-none">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-[#0A192F] pb-4 mb-6">
        <div>
          <h3 className="text-base font-black text-[#0A192F] uppercase tracking-wide">
            Ecosystem Analytics & Case Distribution Summary
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-semibold">
            Official department-wise classification, priority severity metrics, and resolution logs
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Table 1: Category Classification */}
        <div className="border border-[#CCCCCC] p-4 rounded-[2px] bg-slate-50/50">
          <h4 className="text-xs font-black uppercase text-[#0A192F] border-b border-[#CCCCCC] pb-2 mb-3 tracking-wider">
            1. Classification by Department
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-200 border-b border-[#CCCCCC] text-slate-800 font-bold">
                  <th className="p-2 border border-[#CCCCCC]">Domain / Category</th>
                  <th className="p-2 border border-[#CCCCCC] text-center w-14">Cases</th>
                  <th className="p-2 border border-[#CCCCCC] text-center w-14">Share</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={idx} className="hover:bg-white border-b border-[#CCCCCC] font-semibold text-slate-700">
                    <td className="p-2 border border-[#CCCCCC]">
                      <div>{cat.label}</div>
                      <div className="text-[9px] text-slate-400 font-normal uppercase mt-0.5">{cat.ministry}</div>
                    </td>
                    <td className="p-2 border border-[#CCCCCC] text-center font-mono font-bold text-slate-900 bg-white">{cat.count}</td>
                    <td className="p-2 border border-[#CCCCCC] text-center font-mono text-slate-600">{cat.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Priority Distribution */}
        <div className="border border-[#CCCCCC] p-4 rounded-[2px] bg-slate-50/50">
          <h4 className="text-xs font-black uppercase text-[#0A192F] border-b border-[#CCCCCC] pb-2 mb-3 tracking-wider">
            2. Priority & Severity Distribution
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-200 border-b border-[#CCCCCC] text-slate-800 font-bold">
                  <th className="p-2 border border-[#CCCCCC]">Severity Level</th>
                  <th className="p-2 border border-[#CCCCCC] text-center w-14">Cases</th>
                  <th className="p-2 border border-[#CCCCCC] text-center w-14">Share</th>
                </tr>
              </thead>
              <tbody>
                {priorities.map((prio, idx) => (
                  <tr key={idx} className="hover:bg-white border-b border-[#CCCCCC] font-semibold text-slate-700">
                    <td className="p-2 border border-[#CCCCCC]">
                      <div className={prio.color}>{prio.label}</div>
                      <div className="text-[9px] text-slate-500 font-normal mt-0.5">{prio.action}</div>
                    </td>
                    <td className="p-2 border border-[#CCCCCC] text-center font-mono font-bold text-slate-900 bg-white">{prio.count}</td>
                    <td className="p-2 border border-[#CCCCCC] text-center font-mono text-slate-600">{prio.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 border-t border-[#CCCCCC] pt-4">
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
              <div className="bg-red-50 p-2 rounded-[2px] border border-red-200">
                <span className="text-red-800 uppercase block">High</span>
                <p className="text-sm font-black text-red-700 mt-1">35</p>
              </div>
              <div className="bg-amber-50 p-2 rounded-[2px] border border-amber-200">
                <span className="text-amber-800 uppercase block">Med</span>
                <p className="text-sm font-black text-amber-700 mt-1">68</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-[2px] border border-[#CCCCCC]">
                <span className="text-slate-700 uppercase block">Low</span>
                <p className="text-sm font-black text-slate-800 mt-1">25</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table 3: Status Logs */}
        <div className="border border-[#CCCCCC] p-4 rounded-[2px] bg-slate-50/50">
          <h4 className="text-xs font-black uppercase text-[#0A192F] border-b border-[#CCCCCC] pb-2 mb-3 tracking-wider">
            3. Case Lifecycle & Resolution Log
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-200 border-b border-[#CCCCCC] text-slate-800 font-bold">
                  <th className="p-2 border border-[#CCCCCC]">Resolution Stage</th>
                  <th className="p-2 border border-[#CCCCCC] text-center w-14">Cases</th>
                  <th className="p-2 border border-[#CCCCCC] text-center w-14">Share</th>
                </tr>
              </thead>
              <tbody>
                {statuses.map((stat, idx) => (
                  <tr key={idx} className="hover:bg-white border-b border-[#CCCCCC] font-semibold text-slate-700">
                    <td className="p-2 border border-[#CCCCCC]">
                      <div className="text-slate-900 font-bold">{stat.label}</div>
                      <div className="text-[9px] text-slate-500 font-normal mt-0.5">{stat.actionRequired}</div>
                    </td>
                    <td className="p-2 border border-[#CCCCCC] text-center font-mono font-bold text-slate-900 bg-white">{stat.count}</td>
                    <td className="p-2 border border-[#CCCCCC] text-center font-mono text-slate-600">{stat.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
