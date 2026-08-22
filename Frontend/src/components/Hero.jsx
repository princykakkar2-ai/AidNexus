import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section className="relative border-b border-slate-200 bg-white py-20">
            <div className="mx-auto max-w-5xl px-6 text-center">

                <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 shadow-sm">
                    <span>🏛️</span>
                    Citizen-State Collaboration Framework
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                    Empowering Citizens.
                    <br className="hidden sm:inline" />

                    <span className="text-slate-700">
                        {" "}Engineering Solutions.
                    </span>
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                    A unified platform connecting public administration,
                    academic institutions, and citizen bodies to systematically
                    address infrastructure and civic challenges.
                </p>

                <div className="mt-8 flex flex-wrap gap-4 justify-center">

                    <Link
                        to="/submit-problem"
                        className="rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-slate-800 transition-all"
                    >
                        Lodge a Civic Grievance →
                    </Link>

                    <Link
                        to="/problems"
                        className="rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
                    >
                        Browse Open Repositories
                    </Link>

                </div>

            </div>
        </section>
    );
}