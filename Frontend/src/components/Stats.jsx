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
        <section className="border-b border-slate-200 bg-slate-100/70">
            <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y md:divide-y-0 divide-slate-200 border-x border-slate-200 md:grid-cols-4">

                <Stat number="1,248" label="Logged Issues" />
                <Stat number="586" label="Deployed Solutions" />
                <Stat number="240" label="Institutional Partners" />
                <Stat number="85" label="Municipal Bodies" />

            </div>
        </section>
    );
}