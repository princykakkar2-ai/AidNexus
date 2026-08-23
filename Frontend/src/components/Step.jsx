export default function Step({ number, icon, title, text }) {

  return (
    <div className="rounded-[2px] border border-[#CCCCCC] bg-white p-6 shadow-none">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#E65C00] bg-[#FFFBEB] border border-amber-200 px-2 py-0.5 rounded-[2px]">{number}</span>
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="mt-6 text-base font-bold text-[#0B2545]">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">{text}</p>
    </div>
  );
}