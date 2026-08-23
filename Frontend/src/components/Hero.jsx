import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-10 md:py-16 flex flex-col items-center justify-center text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-[2px] border border-[#CCCCCC] bg-slate-100 px-4 py-1.5 text-xs text-[#0B2545] font-bold uppercase tracking-wider">
        🛡️ NATIONAL COLLABORATION HUB
      </div>

      <h1 className="text-4xl font-extrabold leading-tight md:text-5xl text-[#0B2545] tracking-tight">
        Co-creating India's Smart Solutions For
        <span className="text-[#E65C00]"> Civic Challenges</span>
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-700">
        AidNexus acts as a high-trust platform matching local community problems reported by citizens
        with innovation capabilities of student teams, funded and sponsored by official NGO and Industry partners.
      </p>

      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link
          to="/submit-problem"
          className="rounded-[2px] bg-[#E65C00] px-6 py-3 text-sm font-bold text-white hover:bg-[#C24E00] shadow-none transition-colors"
        >
          REPORT A CIVIC ISSUE
        </Link>

        <Link
          to="/citizen"
          className="rounded-[2px] border-2 border-[#0B2545] bg-white px-6 py-3 text-sm font-bold text-[#0B2545] hover:bg-slate-50 shadow-none transition-colors"
        >
          VIEW REPORT ARCHIVE
        </Link>
      </div>
    </section>
  );
}