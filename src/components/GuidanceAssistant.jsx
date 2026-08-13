import React, { useState } from 'react';
import { Bot, GraduationCap, Languages, MessageCircleMore, Search, Sparkles, X } from 'lucide-react';

export const GuidanceAssistant = ({ onNavigate, onStartTest }) => {
  const [open, setOpen] = useState(false);
  const options = [
    [Search, 'Find a college', () => onNavigate('colleges')],
    [GraduationCap, 'Check scholarships', () => onNavigate('scholarships')],
    [Languages, 'Language preparation', () => onNavigate('language_academy')],
    [Sparkles, 'Career assessment', onStartTest],
    [MessageCircleMore, 'Talk to a counselor', () => onNavigate('contact')],
  ];

  const choose = (action) => { action(); setOpen(false); };

  return (
    <div className="fixed bottom-5 left-5 z-[65] no-print sm:bottom-6 sm:left-6">
      {open && <div className="mb-3 w-[min(340px,calc(100vw-2.5rem))] overflow-hidden rounded-[1.5rem] border border-blue-100 bg-white shadow-[0_24px_75px_rgba(6,45,85,0.24)]"><div className="bg-gradient-to-r from-[#062d55] to-[#075ec5] p-5 text-white"><div className="flex items-start justify-between gap-4"><div><span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-sky-200"><Bot className="h-4 w-4" /> Guidance shortcuts</span><h2 className="mt-2 text-lg font-extrabold">What would you like to do?</h2></div><button type="button" onClick={() => setOpen(false)} aria-label="Close guidance assistant" className="rounded-full bg-white/10 p-2"><X className="h-4 w-4" /></button></div></div><div className="grid gap-2 p-3">{options.map(([Icon, label, action]) => <button key={label} type="button" onClick={() => choose(action)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold text-slate-600 transition hover:bg-blue-50 hover:text-[#075ec5]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-[#075ec5]"><Icon className="h-4 w-4" /></span>{label}</button>)}</div><p className="border-t border-slate-100 px-4 py-3 text-[9px] leading-4 text-slate-400">Quick navigation only. A counselor confirms eligibility, costs, deadlines, and visa information.</p></div>}
      <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-full bg-[#075ec5] px-5 py-3.5 text-xs font-extrabold text-white shadow-[0_14px_35px_rgba(7,94,197,0.32)] transition hover:-translate-y-0.5" aria-expanded={open} aria-label="Open guidance assistant"><MessageCircleMore className="h-5 w-5" /> Ask our guide</button>
    </div>
  );
};
