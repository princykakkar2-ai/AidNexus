function Stat({ number, label }) {
    return (
        <div className="p-6 text-center">
            <div className="text-3xl font-extrabold text-slate-900 font-mono">
                {number}
            </div>

            <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {label}
            </div>
        </div>
    );
}

export default function Stats() {
    return (
       <section className="border-y border-slate-200 bg-white shadow-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4">
          <Stat number="1,248" label="Issues Reported" />
          <Stat number="586" label="Solutions Developed" />
          <Stat number="240" label="Academic Teams" />
          <Stat number="85" label="Industry Partners" />
        </div>
      </section>
    );
}