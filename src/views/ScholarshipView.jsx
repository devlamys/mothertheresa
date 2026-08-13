import React, { useState } from 'react';
import { ArrowRight, BadgeCheck, CheckCircle2, FileCheck2, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/useApp';

const initialForm = {
  name: '', email: '', phone: '', nationality: '', currentQualification: '', currentScore: '', preferredCourse: '', targetCountry: 'Not decided yet', intake: '', fundingNeed: 'Partial scholarship', message: '',
};

export const ScholarshipView = ({ onNavigate }) => {
  const { addLead } = useApp();
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    await addLead({
      ...formData,
      enquiryType: 'Scholarship guidance',
      formKey: 'scholarship-eligibility',
      preferredIntake: formData.intake,
      message: `${formData.message || 'Scholarship eligibility review requested.'} Qualification: ${formData.currentQualification}; Score: ${formData.currentScore}; Funding need: ${formData.fundingNeed}; Nationality: ${formData.nationality}.`,
    });
    setFormData(initialForm);
    setSubmitting(false);
  };

  return (
    <div className="bg-[#f7fafc] text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#041f3d] via-[#063d78] to-[#0874c9] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-24">
        <div className="absolute -right-36 -top-36 h-96 w-96 rounded-full border-[68px] border-white/[0.05]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em]"><Sparkles className="h-4 w-4 text-sky-200" /> Funding guidance</span>
            <h1 className="font-display mt-6 max-w-4xl text-[clamp(3rem,6vw,5.2rem)] font-semibold leading-[1.02] tracking-[-0.05em]">Find scholarships that fit your profile.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-blue-50/75">Request an eligibility review covering university awards, merit funding, need-based opportunities, required evidence, and application deadlines.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[[BadgeCheck, 'Eligibility screening'], [FileCheck2, 'Document checklist'], [GraduationCap, 'Application guidance']].map(([Icon, label]) => <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"><Icon className="h-5 w-5 text-sky-200" /><strong className="text-sm">{label}</strong></div>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="h-fit rounded-[2rem] bg-[#062d55] p-7 text-white sm:p-9 lg:sticky lg:top-28">
            <ShieldCheck className="h-8 w-8 text-sky-300" />
            <h2 className="font-display mt-5 text-3xl font-semibold">How the review works</h2>
            <div className="mt-7 space-y-5">
              {['Share your academic and destination profile.', 'A counselor checks likely scholarship categories.', 'Receive a tailored document and deadline checklist.', 'Verify every award on the official institution page before applying.'].map((item, index) => <div key={item} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-400/15 text-[10px] font-black text-sky-200">{index + 1}</span><p className="text-xs leading-6 text-blue-50/75">{item}</p></div>)}
            </div>
            <div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-[11px] leading-6 text-amber-100">Scholarship availability, value, eligibility, and deadlines can change. Guidance is not a funding guarantee.</div>
          </aside>

          <form onSubmit={submit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(6,45,85,0.1)] sm:p-9">
            <p className="eyebrow">Scholarship eligibility form</p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#062d55]">Tell us about your study plan.</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="form-label sm:col-span-2">Full name<input className="form-field" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" /></label>
              <label className="form-label">Email<input className="form-field" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" /></label>
              <label className="form-label">Phone / WhatsApp<input className="form-field" type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+971 50 000 0000" /></label>
              <label className="form-label">Nationality<input className="form-field" required value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} placeholder="Your nationality" /></label>
              <label className="form-label">Current qualification<input className="form-field" required value={formData.currentQualification} onChange={(e) => setFormData({ ...formData, currentQualification: e.target.value })} placeholder="Grade 12, Bachelor’s…" /></label>
              <label className="form-label">Latest score / GPA<input className="form-field" required value={formData.currentScore} onChange={(e) => setFormData({ ...formData, currentScore: e.target.value })} placeholder="e.g. 88% or 3.6/4" /></label>
              <label className="form-label">Preferred course<input className="form-field" required value={formData.preferredCourse} onChange={(e) => setFormData({ ...formData, preferredCourse: e.target.value })} placeholder="e.g. MSc Data Science" /></label>
              <label className="form-label">Destination<select className="form-field" value={formData.targetCountry} onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}>{['Not decided yet', 'United Kingdom', 'Canada', 'Australia', 'United States', 'Germany', 'United Arab Emirates'].map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="form-label">Preferred intake<input className="form-field" value={formData.intake} onChange={(e) => setFormData({ ...formData, intake: e.target.value })} placeholder="e.g. September 2027" /></label>
              <label className="form-label">Funding need<select className="form-field" value={formData.fundingNeed} onChange={(e) => setFormData({ ...formData, fundingNeed: e.target.value })}><option>Partial scholarship</option><option>Full scholarship</option><option>Tuition waiver</option><option>Education loan guidance</option><option>Not sure</option></select></label>
              <label className="form-label sm:col-span-2">Additional information<textarea className="form-field min-h-28 resize-y" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Achievements, test scores, financial circumstances, or deadlines." /></label>
            </div>
            <button disabled={submitting} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0868b5] px-6 py-4 text-sm font-bold text-white disabled:opacity-60">{submitting ? 'Sending request…' : 'Request scholarship review'} <ArrowRight className="h-4 w-4" /></button>
            <p className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> No application fee · Counselor-reviewed enquiry</p>
          </form>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1280px] flex-col gap-5 rounded-3xl bg-[#eaf6fd] p-8 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-display text-3xl font-semibold text-[#062d55]">Still choosing a university?</h2><p className="mt-2 text-sm text-slate-600">Filter the College Finder to show institutions with scholarship opportunities.</p></div><button type="button" onClick={() => onNavigate('colleges')} className="inline-flex items-center gap-2 rounded-full bg-[#062d55] px-6 py-3.5 text-sm font-bold text-white">Explore colleges <ArrowRight className="h-4 w-4" /></button></div></section>
    </div>
  );
};
