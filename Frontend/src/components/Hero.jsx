import { Link } from "react-router-dom";

export default function Hero() {
    return (
              <section className="mx-auto max-w-5xl px-6 py-20 flex flex-col items-center justify-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-[4px] border border-slate-300 bg-slate-100 px-4 py-1.5 text-xs text-[#0F172A] font-bold uppercase tracking-wider">
          🛡️ NATIONAL COLLABORATION HUB
        </div>

        <h1 className="text-4xl font-extrabold leading-tight md:text-5xl text-[#0F172A] tracking-tight">
          Co-creating India's Smart Solutions For
          <span className="text-[#D97706]"> Civic Challenges</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-700">
          AidNexus acts as a high-trust platform matching local community problems reported by citizens 
          with innovation capabilities of student teams, funded and sponsored by official NGO and Industry partners.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            to="/submit-problem"
            className="rounded-[4px] bg-[#D97706] px-6 py-3 text-sm font-bold text-white hover:bg-[#B45309] shadow-sm transition-all"
          >
            REPORT A CIVIC ISSUE
          </Link>

          <Link
            to="/citizen"
            className="rounded-[4px] border-2 border-[#0F172A] bg-white px-6 py-3 text-sm font-bold text-[#0F172A] hover:bg-slate-50 shadow-sm transition-all"
          >
            VIEW REPORT ARCHIVE
          </Link>
        </div>
      </section>
    );
}