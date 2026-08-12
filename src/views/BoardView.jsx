import React from 'react';
import { ArrowRight, BadgeCheck, BookOpenCheck, Landmark, Scale, ShieldCheck, UsersRound } from 'lucide-react';
import { BOARD_ROLES } from '../data/siteData';

const colors = [
  'from-sky-500 to-blue-700',
  'from-indigo-500 to-blue-700',
  'from-amber-400 to-orange-600',
  'from-emerald-500 to-teal-700',
];

export const BoardView = ({ onNavigate }) => (
  <div className="bg-white text-slate-900">
    <section className="relative overflow-hidden bg-[#052b50] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28">
      <div className="absolute -right-28 -top-40 h-96 w-96 rounded-full border-[70px] border-white/[0.035]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sky-300">Governance</p>
          <h1 className="font-display mt-5 text-[clamp(2.8rem,6vw,5.2rem)] font-semibold leading-[1.02] tracking-[-0.05em]">Board of Trustees</h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-sky-100/75 sm:text-lg">
            The Board protects the trust&apos;s educational purpose, provides responsible oversight, and keeps student welfare at the centre of institutional decisions.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            [Landmark, 'Responsible governance'],
            [Scale, 'Ethical oversight'],
            [BookOpenCheck, 'Academic quality'],
            [ShieldCheck, 'Student safeguarding'],
          ].map(([Icon, label]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
              <Icon className="h-6 w-6 text-sky-300" />
              <p className="mt-4 text-sm font-bold leading-6">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="eyebrow">Board roles</p>
            <h2 className="section-heading mt-4">Leadership with clear responsibilities.</h2>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
            <strong>Profile publication notice:</strong> Personal names, biographies, and photographs will be added only after formal verification and approval. The roles below accurately describe the intended governance structure without inventing individual identities.
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {BOARD_ROLES.map((member, index) => (
            <article key={member.id} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(6,45,85,0.07)]">
              <div className="grid sm:grid-cols-[150px_1fr]">
                <div className={`flex min-h-40 items-center justify-center bg-gradient-to-br ${colors[index]} p-6 text-white`}>
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-white/15 font-display text-2xl font-semibold backdrop-blur-sm">{member.initials}</div>
                    <div className="mt-3 text-[9px] font-extrabold uppercase tracking-[0.18em] text-white/70">Official role</div>
                  </div>
                </div>
                <div className="p-6 sm:p-7">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0874c9]">{member.focus}</p>
                  <h3 className="mt-2 text-xl font-extrabold text-[#062d55]">{member.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{member.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {member.responsibilities.map((responsibility) => (
                      <span key={responsibility} className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-600">{responsibility}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-[#f4f9fc] px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-3">
        <div>
          <p className="eyebrow">Board commitments</p>
          <h2 className="font-display mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#062d55]">What the Board is accountable for.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {[
            ['Mission integrity', "Keep programs and partnerships aligned with the trust's educational purpose."],
            ['Student protection', 'Maintain safeguarding, privacy, complaints, and ethical counseling expectations.'],
            ['Academic oversight', 'Review assessment methods, pathway guidance, and institutional information quality.'],
            ['Transparent decisions', 'Document material decisions, manage conflicts, and monitor service outcomes.'],
          ].map(([title, text]) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <BadgeCheck className="h-5 w-5 text-emerald-500" />
              <h3 className="mt-4 font-extrabold text-[#062d55]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 rounded-[2rem] bg-[#eaf6fd] p-8 sm:p-10 lg:flex-row lg:items-center">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0868b5] shadow-sm"><UsersRound className="h-6 w-6" /></span>
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[#062d55]">Need to contact the trust?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Use the contact page for student services, partnerships, governance correspondence, or general enquiries.</p>
          </div>
        </div>
        <button type="button" onClick={() => onNavigate('contact')} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0868b5] px-6 py-3.5 text-sm font-bold text-white">Contact us <ArrowRight className="h-4 w-4" /></button>
      </div>
    </section>
  </div>
);
