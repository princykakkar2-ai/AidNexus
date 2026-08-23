import { useState } from "react";

export default function RegistryCard({
  image,
  title,
  category,
  votes,
  location,
  status
}) {

  const [loaded, setLoaded] = useState(false);

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm hover:border-slate-400 transition-all">

      <div className="h-40 w-full overflow-hidden relative bg-slate-100">

        {!loaded && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse" />
        )}

        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"
            }`}
        />

        <span className="absolute top-3 right-3 rounded bg-slate-900/90 text-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
          {status}
        </span>

      </div>

      <div className="p-5">

        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          📍 {location}
        </span>

        <h3 className="font-bold text-slate-900 text-base mt-1 line-clamp-1">
          {title}
        </h3>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">

          <span className="rounded bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {category}
          </span>

          <span className="text-xs font-bold text-slate-900">
            {votes} Endorsements
          </span>

        </div>

      </div>
    </div>
  );
}