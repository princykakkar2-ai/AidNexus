export default function Step({ number, title, text }) {

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">

            <span className="text-xs font-mono font-bold text-slate-400">
                {number}
            </span>

            <h3 className="mt-2 text-base font-bold text-slate-900">
                {title}
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-slate-600">
                {text}
            </p>

        </div>
    );
}