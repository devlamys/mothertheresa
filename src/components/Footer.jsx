import React, { useState } from 'react';
import { ArrowUpRight, Mail, MapPin, Phone, Send, Settings, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/useApp';

export const Footer = ({ onStartTest, onNavigate }) => {
  const { showToast } = useApp();
  const [email, setEmail] = useState('');

  const subscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    showToast('Thank you. Newsletter interest has been recorded on this demo.');
    setEmail('');
  };

  return (
    <footer className="bg-gradient-to-br from-[#052e63] via-[#063d7e] to-[#031f44] text-sm text-blue-50/70 no-print">
      <div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-10 border-b border-white/15 pb-10 md:grid-cols-2 xl:grid-cols-[1.25fr_0.7fr_0.8fr_0.95fr_1.1fr]">
          <div className="max-w-sm">
            <div className="brand-logo-frame w-[275px] max-w-full rounded-lg bg-white px-2">
              <img src={`${import.meta.env.BASE_URL}brand/mother-teresa-logo.jpg`} alt="Mother Teresa Educational Global Trust" />
            </div>
            <p className="mt-5 text-xs leading-6 text-blue-50/65">Empowering students to pursue global education through thoughtful guidance, ethical support, and clear next steps.</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[10px] font-bold text-white"><ShieldCheck className="h-4 w-4 text-sky-300" /> Student-first guidance</div>
          </div>

          <div>
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">Quick links</h3>
            <div className="mt-4 flex flex-col items-start gap-2.5 text-[11px] font-semibold">
              <button type="button" onClick={() => onNavigate('landing')} className="hover:text-white">Home</button>
              <button type="button" onClick={() => onNavigate('about')} className="hover:text-white">About Us</button>
              <button type="button" onClick={() => onNavigate('colleges')} className="hover:text-white">Destinations</button>
              <button type="button" onClick={() => onNavigate('board')} className="hover:text-white">Board of Trustees</button>
              <button type="button" onClick={() => onNavigate('contact')} className="hover:text-white">Contact</button>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">Our services</h3>
            <div className="mt-4 flex flex-col items-start gap-2.5 text-[11px] font-semibold">
              <span>Career Counseling</span>
              <span>University Admission</span>
              <span>Visa Assistance</span>
              <span>SOP / LOR Support</span>
              <span>Scholarship Guidance</span>
              <button type="button" onClick={onStartTest} className="font-extrabold text-sky-200 hover:text-white">Aptitude assessment</button>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">Contact us</h3>
            <div className="mt-4 space-y-3 text-[11px] font-semibold">
              <a href="tel:+97143889200" className="flex items-start gap-2.5 hover:text-white"><Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-300" /> +971 4 388 9200</a>
              <a href="mailto:admissions@mothertheresa.edu" className="flex items-start gap-2.5 hover:text-white"><Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-300" /> admissions@mothertheresa.edu</a>
              <div className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-300" /> Dubai, United Arab Emirates</div>
              <button type="button" onClick={() => onNavigate('contact')} className="inline-flex items-center gap-1.5 pt-1 font-extrabold text-white">Book counseling <ArrowUpRight className="h-3.5 w-3.5" /></button>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">Newsletter</h3>
            <p className="mt-4 text-[11px] leading-5 text-blue-50/65">Subscribe for updates on universities, scholarships, visa guidance, and events.</p>
            <form onSubmit={subscribe} className="mt-4 flex overflow-hidden rounded-xl bg-white p-1">
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" className="min-w-0 grow bg-transparent px-3 text-[11px] font-semibold text-slate-800 outline-none" aria-label="Newsletter email" required />
              <button type="submit" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#075ec5] text-white" aria-label="Subscribe"><Send className="h-4 w-4" /></button>
            </form>
            <button type="button" onClick={() => onNavigate('cms')} className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[10px] font-extrabold text-white hover:bg-white/10"><Settings className="h-3.5 w-3.5" /> Open Content Manager</button>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-[10px] text-blue-100/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Mother Teresa Educational Global Trust. All rights reserved.</p>
          <div className="flex gap-5"><span>Privacy Policy</span><span>Terms & Conditions</span></div>
        </div>
      </div>
    </footer>
  );
};
