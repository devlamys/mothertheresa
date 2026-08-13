import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Brain, Check, CircleDollarSign, FileCheck2, GraduationCap, MapPin, ShieldCheck, Star, UsersRound } from 'lucide-react';
import { COUNTRY_META } from '../utils/collegeUtils';
import { useApp } from '../context/useApp';

export const CollegeDetailView = ({ university, onBack, onStartTest, onOpenAuth, isShortlisted, onToggleShortlist }) => {
  const { activeUser, currentTestResult, setCurrentView } = useApp();
  const [activeSection, setActiveSection] = useState('overview');

  if (!university) {
    return (
      <div className="bg-white px-5 py-24 text-center text-slate-900">
        <h1 className="text-2xl font-extrabold text-[#062d55]">College not selected</h1>
        <button type="button" onClick={onBack} className="mt-5 rounded-full bg-[#0868b5] px-6 py-3 text-sm font-bold text-white">Return to College Finder</button>
      </div>
    );
  }

  const meta = COUNTRY_META[university.country] || { code: university.country.slice(0, 2).toUpperCase(), color: 'from-slate-500 to-slate-700' };
  const profileEligible = currentTestResult && currentTestResult.overallScore >= university.minAptitudeScore;

  const handleApplication = () => {
    if (activeUser) setCurrentView('student_portal');
    else onOpenAuth();
  };

  return (
    <div className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-[#052b50] px-5 py-12 text-white sm:px-8 lg:px-12 lg:py-16">
        <div className="absolute -right-32 -top-44 h-96 w-96 rounded-full border-[68px] border-white/[0.035]" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1280px]">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-xs font-bold text-sky-200 transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to College Finder</button>
          <div className="mt-9 grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <div className={`flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-gradient-to-br ${meta.color} text-xl font-black tracking-wider text-white shadow-xl`}>{meta.code}</div>
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-sky-100">{university.worldRanking}</span>
                {university.scholarshipsAvailable && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-3 py-1 text-[10px] font-bold text-emerald-200"><BadgeCheck className="h-3 w-3" /> Scholarships listed</span>}
              </div>
              <h1 className="font-display mt-4 text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.05em]">{university.name}</h1>
              <p className="mt-4 flex items-center gap-2 text-sm text-sky-100/70"><MapPin className="h-4 w-4" /> {university.city}, {university.country}</p>
            </div>
            <button type="button" onClick={() => onToggleShortlist(university.id)} className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-bold transition ${isShortlisted ? 'border-amber-300 bg-amber-400 text-slate-950' : 'border-white/20 bg-white/[0.06] text-white hover:bg-white/10'}`}>
              <Star className={`h-4 w-4 ${isShortlisted ? 'fill-current' : ''}`} /> {isShortlisted ? 'Shortlisted' : 'Add to shortlist'}
            </button>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1280px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [CircleDollarSign, 'Estimated tuition', university.tuitionPerYear],
            [UsersRound, 'Published acceptance', university.acceptanceRate],
            [Brain, 'Profile guideline', `${university.minAptitudeScore}+ aptitude index`],
            [ShieldCheck, 'Scholarship status', university.scholarshipsAvailable ? 'Opportunities listed' : 'Ask the institution'],
          ].map(([Icon, label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-5 w-5 text-[#0868b5]" />
              <span className="mt-4 block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{label}</span>
              <strong className="mt-1 block text-sm leading-6 text-[#062d55]">{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-5 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1280px] gap-2 overflow-x-auto py-3">{[['overview', 'Overview'], ['programs', `Programs (${university.featuredPrograms.length})`], ['admission', 'Admission & costs']].map(([value, label]) => <button key={value} type="button" onClick={() => setActiveSection(value)} className={`whitespace-nowrap rounded-full px-5 py-3 text-xs font-extrabold transition ${activeSection === value ? 'bg-[#062d55] text-white' : 'bg-slate-100 text-slate-600 hover:text-[#075ec5]'}`}>{label}</button>)}</div></section>

      <section className="px-5 pb-24 pt-8 sm:px-8 lg:px-12 lg:pb-32">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            {(activeSection === 'overview' || activeSection === 'programs') && <section>
              <p className="eyebrow">Featured study options</p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#062d55]">Programs currently highlighted</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {university.featuredPrograms.map((program) => (
                  <article key={program} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-[#f8fbfd] p-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0868b5] shadow-sm"><BookOpen className="h-4 w-4" /></span>
                    <div><h3 className="text-sm font-extrabold text-[#062d55]">{program}</h3><p className="mt-1 text-xs leading-5 text-slate-500">Confirm curriculum, duration, entry requirements, and current intake availability.</p></div>
                  </article>
                ))}
              </div>
            </section>}

            {(activeSection === 'overview' || activeSection === 'admission') && <section className="rounded-[1.75rem] border border-slate-200 p-6 sm:p-8">
              <p className="eyebrow">Selection checklist</p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#062d55]">Verify before you apply</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  'Academic entry requirements and prerequisite subjects',
                  'Full tuition, living costs, deposits, and refund rules',
                  'Degree recognition in your intended career location',
                  'Scholarship eligibility and application deadlines',
                  'Student visa and post-study work conditions',
                  'Accommodation, safety, support, and accessibility',
                ].map((item) => <div key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-600"><Check className="mt-1 h-4 w-4 shrink-0 text-emerald-500" /> {item}</div>)}
              </div>
            </section>}

            {activeSection === 'admission' && <section className="grid gap-4 sm:grid-cols-2"><article className="rounded-2xl bg-sky-50 p-6"><CircleDollarSign className="h-6 w-6 text-[#075ec5]" /><h3 className="mt-4 text-lg font-extrabold text-[#062d55]">Estimated annual tuition</h3><p className="mt-2 text-sm text-slate-600">{university.tuitionPerYear}</p><p className="mt-3 text-xs leading-5 text-slate-500">Ask for the complete cost of attendance, deposits, refund terms, insurance, and living expenses.</p></article><article className="rounded-2xl bg-emerald-50 p-6"><BadgeCheck className="h-6 w-6 text-emerald-600" /><h3 className="mt-4 text-lg font-extrabold text-[#062d55]">Scholarship guidance</h3><p className="mt-2 text-sm text-slate-600">{university.scholarshipsAvailable ? 'This sample listing flags scholarship opportunities.' : 'Ask the institution about current awards.'}</p><button type="button" onClick={() => setCurrentView('scholarships')} className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-[#075ec5]">Request eligibility review <ArrowRight className="h-4 w-4" /></button></article></section>}

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-xs leading-6 text-amber-900">
              <strong>Information notice:</strong> This page is a planning aid based on sample dataset values. Rankings, tuition, acceptance rates, programs, scholarships, and visa conditions can change. Always verify material information with the institution and relevant authorities before paying or applying.
            </div>
          </div>

          <aside className="h-fit rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_55px_rgba(6,45,85,0.1)] lg:sticky lg:top-28">
            <GraduationCap className="h-8 w-8 text-[#0868b5]" />
            <h2 className="mt-5 text-xl font-extrabold text-[#062d55]">How does this college fit you?</h2>
            {currentTestResult ? (
              <div className={`mt-5 rounded-2xl p-4 ${profileEligible ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>
                <div className="flex items-center gap-2 text-sm font-extrabold">{profileEligible ? <Check className="h-4 w-4" /> : <Brain className="h-4 w-4" />} {profileEligible ? 'Profile guideline met' : 'Counselor review recommended'}</div>
                <p className="mt-2 text-xs leading-5 opacity-80">Your current overall profile index is {currentTestResult.overallScore}/100; this listing uses a {university.minAptitudeScore}+ planning guideline.</p>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-sky-50 p-4 text-sky-900">
                <p className="text-xs leading-5">Complete the 50-question assessment to add an initial profile-fit signal to this page.</p>
                <button type="button" onClick={onStartTest} className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0868b5]">Start assessment <ArrowRight className="h-3.5 w-3.5" /></button>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button type="button" onClick={handleApplication} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0868b5] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20">{activeUser ? 'Continue in student portal' : 'Sign up to apply'} <ArrowRight className="h-4 w-4" /></button>
              <button type="button" onClick={() => onToggleShortlist(university.id)} className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3.5 text-sm font-bold text-[#062d55]"><Star className={`h-4 w-4 ${isShortlisted ? 'fill-amber-400 text-amber-400' : ''}`} /> {isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}</button>
            </div>

            <div className="mt-6 flex items-start gap-2 border-t border-slate-100 pt-5 text-[10px] leading-5 text-slate-500"><FileCheck2 className="mt-0.5 h-4 w-4 shrink-0" /> A counselor should verify your academic eligibility and current institution information before submission.</div>
          </aside>
        </div>
      </section>
    </div>
  );
};
