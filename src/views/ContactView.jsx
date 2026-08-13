import React, { useState } from 'react';
import { ArrowRight, Clock3, Mail, MapPin, MessageCircleMore, Phone, Send, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/useApp';

export const ContactView = ({ onNavigate }) => {
  const { addLead, showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: 'Study counseling',
    targetCountry: 'Not decided yet',
    preferredCourse: '',
    preferredIntake: '',
    preferredDate: '',
    preferredTime: '10:00',
    formKey: 'book-consultation',
    message: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      showToast('Please complete all required contact fields.');
      return;
    }
    await addLead(formData);
    setFormData({ name: '', email: '', phone: '', enquiryType: 'Study counseling', targetCountry: 'Not decided yet', preferredCourse: '', preferredIntake: '', preferredDate: '', preferredTime: '10:00', formKey: 'book-consultation', message: '' });
  };

  return (
    <div className="bg-white text-slate-900">
      <section className="hero-wash relative overflow-hidden px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="hero-grid absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1280px] text-center">
          <p className="eyebrow">Contact us</p>
          <h1 className="font-display mx-auto mt-5 max-w-4xl text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-[#062d55]">Let&apos;s talk about your next step.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">Send your enquiry and our team will direct it to the right counselor or trust representative.</p>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <div className="mx-auto grid max-w-[1280px] overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_90px_rgba(6,45,85,0.13)] ring-1 ring-slate-200 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="relative overflow-hidden bg-[#052b50] p-7 text-white sm:p-10 lg:p-12">
            <div className="absolute -bottom-24 -left-28 h-72 w-72 rounded-full border-[52px] border-white/[0.04]" aria-hidden="true" />
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sky-300">Contact information</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-[-0.035em]">We&apos;re here to help.</h2>
            <p className="mt-4 text-sm leading-7 text-sky-100/70">For urgent application deadlines, include the institution and deadline in your message.</p>

            <div className="relative mt-9 space-y-4">
              <a href="mailto:admissions@mothertheresa.edu" className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition hover:bg-white/[0.09]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-300"><Mail className="h-5 w-5" /></span>
                <span><strong className="block text-sm text-white">Email</strong><span className="mt-1 block text-xs text-sky-100/65">admissions@mothertheresa.edu</span></span>
              </a>
              <a href="tel:+97143889200" className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition hover:bg-white/[0.09]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-300"><Phone className="h-5 w-5" /></span>
                <span><strong className="block text-sm text-white">Phone</strong><span className="mt-1 block text-xs text-sky-100/65">+971 4 388 9200</span></span>
              </a>
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-300"><MapPin className="h-5 w-5" /></span>
                <span><strong className="block text-sm text-white">Office</strong><span className="mt-1 block text-xs leading-5 text-sky-100/65">Dubai, United Arab Emirates<br />Visits by appointment</span></span>
              </div>
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-300"><Clock3 className="h-5 w-5" /></span>
                <span><strong className="block text-sm text-white">Response hours</strong><span className="mt-1 block text-xs leading-5 text-sky-100/65">Monday&ndash;Saturday<br />9:00 AM&ndash;6:00 PM Gulf Standard Time</span></span>
              </div>
            </div>

            <div className="relative mt-8 flex items-start gap-3 rounded-2xl bg-sky-500/10 p-4 text-xs leading-6 text-sky-100/75">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
              Your enquiry is used only to respond and support your education-planning request.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-7 sm:p-10 lg:p-12">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-[#0868b5]"><MessageCircleMore className="h-5 w-5" /></span>
              <div>
                <h2 className="text-xl font-extrabold text-[#062d55]">Send an enquiry</h2>
                <p className="mt-1 text-xs text-slate-500">Required fields are marked by the browser.</p>
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="form-label sm:col-span-2">Full name
                <input type="text" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="Your full name" autoComplete="name" className="form-field" required />
              </label>
              <label className="form-label">Email address
                <input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="you@example.com" autoComplete="email" className="form-field" required />
              </label>
              <label className="form-label">Phone / WhatsApp
                <input type="tel" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} placeholder="+971 50 000 0000" autoComplete="tel" className="form-field" required />
              </label>
              <label className="form-label">Enquiry type
                <select value={formData.enquiryType} onChange={(event) => setFormData({ ...formData, enquiryType: event.target.value })} className="form-field">
                  <option>Study counseling</option>
                  <option>College application</option>
                  <option>Scholarship guidance</option>
                  <option>Language preparation</option>
                  <option>Visa and pre-departure</option>
                  <option>Institutional partnership</option>
                  <option>Board or governance</option>
                  <option>General enquiry</option>
                </select>
              </label>
              <label className="form-label">Preferred destination
                <select value={formData.targetCountry} onChange={(event) => setFormData({ ...formData, targetCountry: event.target.value })} className="form-field">
                  <option>Not decided yet</option>
                  <option>United Kingdom</option><option>Canada</option><option>Australia</option><option>United States</option><option>Germany</option><option>United Arab Emirates</option>
                </select>
              </label>
              <label className="form-label">Preferred course
                <input type="text" value={formData.preferredCourse} onChange={(event) => setFormData({ ...formData, preferredCourse: event.target.value })} placeholder="e.g. Computer Science" className="form-field" />
              </label>
              <label className="form-label">Preferred intake
                <input type="text" value={formData.preferredIntake} onChange={(event) => setFormData({ ...formData, preferredIntake: event.target.value })} placeholder="e.g. September 2027" className="form-field" />
              </label>
              <label className="form-label">Preferred consultation date
                <input type="date" min={new Date().toISOString().split('T')[0]} value={formData.preferredDate} onChange={(event) => setFormData({ ...formData, preferredDate: event.target.value })} className="form-field" />
              </label>
              <label className="form-label">Preferred time
                <select value={formData.preferredTime} onChange={(event) => setFormData({ ...formData, preferredTime: event.target.value })} className="form-field">
                  <option value="10:00">10:00 AM</option><option value="11:30">11:30 AM</option><option value="14:00">2:00 PM</option><option value="15:30">3:30 PM</option><option value="17:00">5:00 PM</option>
                </select>
              </label>
              <label className="form-label sm:col-span-2">How can we help?
                <textarea value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder="Tell us about your study plans, current qualification, preferred intake, or enquiry." className="form-field min-h-32 resize-y" required />
              </label>
            </div>

            <button type="submit" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0868b5] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#075797]">
              Send enquiry <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      <section className="bg-[#f4f9fc] px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.035em] text-[#062d55]">Want to research before speaking with us?</h2>
            <p className="mt-2 text-sm text-slate-600">Use the College Finder to compare destinations, programs, fees, and entry profiles.</p>
          </div>
          <button type="button" onClick={() => onNavigate('colleges')} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#062d55] px-6 py-3.5 text-sm font-bold text-white">Explore colleges <ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>
    </div>
  );
};
