import Step from "./Step";

export default function ResolutionProtocol() {

    return (
        <section className="mx-auto max-w-7xl px-6 py-16 border-t border-[#CCCCCC] mt-12">

            <div className="text-center max-w-2xl mx-auto mb-12">

                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Standard Operating Procedure
                </span>

                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                    Resolution Protocol
                </h2>

            </div>

            <div className="grid gap-6 md:grid-cols-4">

                <Step
                    number="01"
                    title="1. Submission"
                    text="Validated citizen entry with geo-tagged verification."
                />

                <Step
                    number="02"
                    title="2. Triage"
                    text="Automated classification and priority allocation."
                />

                <Step
                    number="03"
                    title="3. R&D"
                    text="Student and institutional innovation proposals."
                />

                <Step
                    number="04"
                    title="4. Execution"
                    text="Municipal endorsement and field implementation."
                />

            </div>

        </section>
    );
}