import React, { useState } from 'react';
import { Brain, BriefcaseBusiness, CalendarDays, GraduationCap, LogOut, Menu, Settings, X } from 'lucide-react';
import { useApp } from '../context/useApp';

const navItems = [
  { label: 'Home', type: 'section', target: 'home' },
  { label: 'About Us', type: 'view', target: 'about' },
  { label: 'Destinations', type: 'section', target: 'destinations' },
  { label: 'Services', type: 'section', target: 'services' },
  { label: 'Universities', type: 'view', target: 'colleges' },
  { label: 'Success Stories', type: 'section', target: 'stories' },
  { label: 'Resources', type: 'assessment', target: 'test' },
  { label: 'Contact', type: 'view', target: 'contact' },
];

export const Navbar = ({ onOpenAuth, onStartTest, onNavigate }) => {
  const { currentView, setCurrentView, userRole, activeUser, logout, loginAsRole } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goToLandingSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (currentView !== 'landing') onNavigate('landing');
    window.setTimeout(() => document.querySelector(`#${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), currentView === 'landing' ? 20 : 100);
  };

  const handleNav = (item) => {
    setMobileMenuOpen(false);
    if (item.type === 'section') goToLandingSection(item.target);
    if (item.type === 'view') onNavigate(item.target);
    if (item.type === 'assessment') onStartTest();
  };

  const isActive = (item) => {
    if (item.target === 'home') return currentView === 'landing';
    if (item.target === 'colleges') return ['colleges', 'college_detail'].includes(currentView);
    return item.type === 'view' && currentView === item.target;
  };

  const openActivePortal = () => {
    setMobileMenuOpen(false);
    if (userRole === 'student') setCurrentView('student_portal');
    if (userRole === 'counselor') setCurrentView('counselor_portal');
  };

  const openStaffErp = () => {
    setMobileMenuOpen(false);
    if (userRole === 'counselor') setCurrentView('counselor_portal');
    else loginAsRole('counselor');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_5px_25px_rgba(6,45,85,0.06)] backdrop-blur-xl no-print">
      <div className="mx-auto flex h-[82px] max-w-[1600px] items-center justify-between gap-5 px-4 sm:px-7 lg:px-10 xl:px-12">
        <button type="button" onClick={() => goToLandingSection('home')} className="brand-logo-frame w-[205px] shrink-0 sm:w-[220px]" aria-label="Mother Teresa Educational Global Trust home">
          <img src={`${import.meta.env.BASE_URL}brand/mother-teresa-logo.jpg`} alt="Mother Teresa Educational Global Trust" />
        </button>

        <nav className="hidden items-center rounded-full border border-slate-200 bg-white px-2 shadow-[0_8px_24px_rgba(6,45,85,0.06)] min-[1180px]:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNav(item)}
              aria-current={isActive(item) ? 'page' : undefined}
              className={`relative whitespace-nowrap px-2.5 py-3.5 text-[9.5px] font-extrabold transition 2xl:px-3.5 ${isActive(item) ? 'text-[#075ec5]' : 'text-slate-600 hover:text-[#075ec5]'}`}
            >
              {item.label}
              {isActive(item) && <span className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-[#075ec5]" />}
            </button>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 min-[1180px]:flex">
          <button type="button" onClick={() => onNavigate('cms')} className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${currentView === 'cms' ? 'border-blue-200 bg-blue-50 text-[#075ec5]' : 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-[#075ec5]'}`} aria-label="Open landing page CMS" title="Landing page CMS"><Settings className="h-4 w-4" /></button>
          <button type="button" onClick={openStaffErp} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:text-[#075ec5]" aria-label="Open Staff ERP" title="Staff ERP"><BriefcaseBusiness className="h-4 w-4" /></button>
          {activeUser ? (
            <>
              <button type="button" onClick={openActivePortal} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-[#075ec5]" aria-label={`Open ${userRole === 'counselor' ? 'counselor ERP' : 'student portal'}`} title={userRole === 'counselor' ? 'Counselor ERP' : 'Student portal'}><GraduationCap className="h-4 w-4" /></button>
              <button type="button" onClick={logout} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Sign out" title="Sign out"><LogOut className="h-4 w-4" /></button>
            </>
          ) : (
            <button type="button" onClick={onOpenAuth} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-[#075ec5]" aria-label="Student login" title="Student login"><GraduationCap className="h-4 w-4" /></button>
          )}
          <button type="button" onClick={() => onNavigate('contact')} className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-[#075ec5] px-4 py-3.5 text-[10px] font-extrabold text-white shadow-[0_10px_24px_rgba(7,94,197,0.25)] transition hover:bg-[#064eaa]"><CalendarDays className="h-4 w-4" /> Book Free Consultation</button>
        </div>

        <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-[#063764] min-[1180px]:hidden" aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileMenuOpen}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-5 shadow-xl min-[1180px]:hidden">
          <nav className="mx-auto max-w-3xl" aria-label="Mobile navigation">
            <div className="grid sm:grid-cols-2">
              {navItems.map((item) => (
                <button key={item.label} type="button" onClick={() => handleNav(item)} aria-current={isActive(item) ? 'page' : undefined} className={`border-b border-slate-100 px-3 py-3 text-left text-sm font-bold ${isActive(item) ? 'text-[#075ec5]' : 'text-slate-700'}`}>{item.label}</button>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => { onNavigate('cms'); setMobileMenuOpen(false); }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 px-5 py-3 text-sm font-bold text-[#075ec5]"><Settings className="h-4 w-4" /> Content Manager</button>
              <button type="button" onClick={openStaffErp} className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 px-5 py-3 text-sm font-bold text-[#075ec5]"><BriefcaseBusiness className="h-4 w-4" /> Staff ERP</button>
              {activeUser ? (
                <button type="button" onClick={openActivePortal} className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 px-5 py-3 text-sm font-bold text-[#075ec5]"><GraduationCap className="h-4 w-4" /> Open {userRole === 'counselor' ? 'counselor ERP' : 'student portal'}</button>
              ) : (
                <button type="button" onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }} className="rounded-xl border border-blue-200 px-5 py-3 text-sm font-bold text-[#075ec5]">Student login</button>
              )}
              <button type="button" onClick={() => { onStartTest(); setMobileMenuOpen(false); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#062d55] px-5 py-3 text-sm font-bold text-white"><Brain className="h-4 w-4" /> Aptitude test</button>
              <button type="button" onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#075ec5] px-5 py-3 text-sm font-bold text-white"><CalendarDays className="h-4 w-4" /> Free consultation</button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
