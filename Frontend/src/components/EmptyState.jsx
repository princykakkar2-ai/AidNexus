import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({ iconType = "default", title, description, actionText, actionLink }) {
  const renderIllustration = () => {
    switch (iconType) {
      case "project":
        return (
          <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 48H52M16 48V28C16 26.8954 16.8954 26 18 26H28C29.1046 26 30 26.8954 30 28V48M34 48V20C34 18.8954 34.8954 18 36 18H46C47.1046 18 48 18.8954 48 20V48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M32 10C29.2386 10 27 12.2386 27 15C27 16.72 27.88 18.24 29.2 19.12C29.7 19.46 30 20.02 30 20.62V22H34V20.62C34 20.02 34.3 19.46 34.8 19.12C36.12 18.24 37 16.72 37 15C37 12.2386 34.7614 10 32 10Z" stroke="#E65C00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="23" cy="36" r="3" stroke="currentColor" strokeWidth="2.5"/>
            <path d="M17 44C17 40.5 19.5 39.5 23 39.5C26.5 39.5 29 40.5 29 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        );
      case "grievance":
        return (
          <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="8" width="36" height="48" rx="3" stroke="currentColor" strokeWidth="2.5"/>
            <line x1="22" y1="20" x2="42" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="22" y1="30" x2="42" y2="30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="22" y1="40" x2="34" y2="40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="44" cy="44" r="5" fill="#E65C00"/>
          </svg>
        );
      case "search":
        return (
          <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="28" cy="28" r="14" stroke="currentColor" strokeWidth="2.5"/>
            <line x1="38" y1="38" x2="52" y2="52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="22" y1="22" x2="34" y2="34" stroke="#E65C00" strokeWidth="2" strokeDasharray="3 3"/>
          </svg>
        );
      default:
        return (
          <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="8" y="8" width="48" height="48" rx="2" strokeDasharray="3 3"/>
            <path d="M16 16h32M16 32h32M16 48h24" strokeLinecap="round"/>
          </svg>
        );
    }
  };

  return (
    <div className="text-center py-12 px-6 text-slate-500 bg-white rounded-lg border border-dashed border-slate-200 shadow-sm max-w-lg mx-auto my-6 animate-fadeIn">
      <div className="flex justify-center mb-4 text-slate-400">
        {renderIllustration()}
      </div>
      <h3 className="text-sm font-black text-[#0B2545] uppercase tracking-wider">{title}</h3>
      <p className="text-[10px] text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed uppercase font-semibold">{description}</p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="mt-6 inline-flex rounded bg-[#E65C00] px-5 py-2 text-xs font-bold text-white hover:bg-[#C24E00] uppercase tracking-wider transition-colors shadow-sm"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
