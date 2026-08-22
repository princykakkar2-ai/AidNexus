export default function OfficialBanner() {
    return (
        <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-6 border-b border-slate-800">
            <div className="mx-auto max-w-7xl flex justify-between items-center">

                <span className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>

                    Official Civic Governance & Innovation Portal
                </span>

                <span className="hidden sm:inline text-slate-400">
                    Smart India Hackathon Initiative
                </span>

            </div>
        </div>
    );
}