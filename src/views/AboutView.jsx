import React from 'react';
import { ArrowRight, BookOpenCheck, CheckCircle2, Compass, Eye, GraduationCap, HeartHandshake, ShieldCheck, Target } from 'lucide-react';
import { TRUST_VALUES } from '../data/siteData';

export const AboutView = ({ onNavigate, onStartTest }) => (
  <div className="bg-white text-slate-900">
    <section className="hero-wash relative overflow-hidden px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="hero-grid absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="eyebrow">About the trust</p>
          <h1 className="font-display mt-5 text-[clamp(2.8rem,6vw,5.2rem)] font-semibold leading-[1.01] tracking-[-0.05em] text-[#062d55]">
            Education guidance built around the student.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Mother Teresa Educational Global Trust helps students and families make clearer decisions about careers, courses, colleges, applications, and international study.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onStartTest} className="inline-flex items-center gap-2 rounded-full bg-[#0868b5] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#075797]">
              Discover your pathway <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => onNavigate('contact')} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3.5 text-sm font-bold text-[#063764] transition hover:border-blue-400 hover:text-[#0868b5]">
              Speak with our team
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] border-[6px] border-white bg-slate-100 shadow-[0_28px_75px_rgba(6,45,85,0.18)]">
            <img src={`${import.meta.env.BASE_URL}brand/admissions-counseling.webp`} alt="A counselor discussing education options with a student and parent" className="h-[440px] w-full object-cover sm:h-[520px]" />
          </div>
          <div className="absolute -bottom-6 left-5 right-5 rounded-2xl bg-[#062d55] p-5 text-white shadow-xl sm:left-auto sm:right-8 sm:max-w-xs">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-sky-300">Our motto</p>
            <p className="mt-2 font-display text-xl font-semibold">“Best education is our motto.”</p>
          </div>
        </div>
      </div>
    </section>

    <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Why we exist</p>
          <h2 className="section-heading mx-auto mt-4">A trusted bridge between ambition and opportunity.</h2>
          <p className="mt-6 text-base leading-8 text-slate-600">
            Education choices can shape a lifetime. Our role is to bring structure, context, and human judgment to those decisions—without making unrealistic promises.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            { icon: Target, label: 'Our mission', text: 'Help every student identify an appropriate pathway and move through it with confidence, preparation, and support.' },
            { icon: Eye, label: 'Our vision', text: 'A world where students can access clear, ethical, and globally informed education guidance regardless of background.' },
            { icon: Compass, label: 'Our approach', text: 'Combine structured discovery, college research, transparent counseling, and a connected student application portal.' },
          ].map(({ icon: Icon, label, text }) => (
            <article key={label} className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_16px_40px_rgba(6,45,85,0.06)]">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-[#0868b5]"><Icon className="h-6 w-6" /></span>
              <h3 className="mt-6 text-xl font-extrabold text-[#062d55]">{label}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-[#f4f9fc] px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="eyebrow">Our principles</p>
          <h2 className="section-heading mt-4">How we earn student trust.</h2>
          <p className="mt-6 max-w-lg text-base leading-8 text-slate-600">
            Our work is guided by principles that protect students and keep every recommendation focused on fit—not pressure.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {TRUST_VALUES.map((value, index) => (
            <article key={value.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                <span className="text-xs font-extrabold text-slate-300">0{index + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-extrabold text-[#062d55]">{value.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{value.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[1280px] rounded-[2rem] bg-[#052b50] p-7 text-white sm:p-10 lg:p-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sky-300">A complete student journey</p>
            <h2 className="font-display mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">More than an application service.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [BookOpenCheck, 'Career and course discovery'],
              [GraduationCap, 'College research and selection'],
              [ShieldCheck, 'Application and visa guidance'],
              [HeartHandshake, 'Student welfare and transition support'],
            ].map(([Icon, text]) => (
              <div key={text} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm font-bold">
                <Icon className="h-5 w-5 shrink-0 text-sky-300" /> {text}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-8">
          <button type="button" onClick={() => onNavigate('board')} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#062d55]">Meet our Board <ArrowRight className="h-4 w-4" /></button>
          <button type="button" onClick={() => onNavigate('colleges')} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white">Explore colleges <ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
    </section>
  </div>
);
