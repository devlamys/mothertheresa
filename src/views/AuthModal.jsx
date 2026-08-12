import React, { useState } from 'react';
import { useApp } from '../context/useApp';
import { GraduationCap, Lock, Mail, MapPin, Phone, User, X } from 'lucide-react';

export const AuthModal = ({ onClose, initialMode = 'login', onAuthenticated, purpose = 'portal' }) => {
  const { loginAsRole, registerStudent, showToast } = useApp();
  const [authMode, setAuthMode] = useState(initialMode);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    targetCountry: 'United Kingdom',
  });

  const finishAuthentication = () => {
    onAuthenticated?.();
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.password.length < 8) {
      showToast('Please use a password with at least 8 characters.');
      return;
    }

    if (authMode === 'register') {
      if (!formData.name.trim() || !formData.phone.trim()) {
        showToast('Please complete your name and phone number.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        showToast('The passwords do not match.');
        return;
      }
      if (!acceptedTerms) {
        showToast('Please confirm the assessment consent and privacy notice.');
        return;
      }
      registerStudent(formData);
    } else {
      loginAsRole('student');
    }

    finishAuthentication();
  };

  const switchMode = (mode) => {
    setAuthMode(mode);
    setFormData((current) => ({ ...current, password: '', confirmPassword: '' }));
  };

  const isAssessmentSignup = purpose === 'assessment';

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
      <div className="glass-card relative max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-700 p-6 shadow-2xl sm:p-8">
        <button type="button" onClick={onClose} className="absolute right-5 top-5 rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white" aria-label="Close sign up">
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="gradient-bg mx-auto flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg shadow-sky-500/25">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">
            {authMode === 'login' ? 'Student sign in' : isAssessmentSignup ? 'Create your assessment profile' : 'Create student profile'}
          </h2>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            {isAssessmentSignup
              ? 'A student profile is required so your 50-question result can be saved and reviewed.'
              : 'Access your applications, documents, appointments, and results.'}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-900/70 p-1">
          <button type="button" onClick={() => switchMode('register')} className={`rounded-lg px-3 py-2.5 text-xs font-bold transition ${authMode === 'register' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
            Create account
          </button>
          <button type="button" onClick={() => switchMode('login')} className={`rounded-lg px-3 py-2.5 text-xs font-bold transition ${authMode === 'login' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
            Sign in
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {authMode === 'register' && (
            <>
              <label className="block text-xs font-semibold text-slate-300">
                Full name
                <span className="relative mt-1.5 block">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <input type="text" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="Your full name" autoComplete="name" className="glass-input w-full rounded-xl py-3 pl-9 pr-4 text-xs" required />
                </span>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Phone / WhatsApp
                  <span className="relative mt-1.5 block">
                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                    <input type="tel" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} placeholder="+971 50 000 0000" autoComplete="tel" className="glass-input w-full rounded-xl py-3 pl-9 pr-4 text-xs" required />
                  </span>
                </label>
                <label className="block text-xs font-semibold text-slate-300">
                  Preferred destination
                  <span className="relative mt-1.5 block">
                    <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                    <select value={formData.targetCountry} onChange={(event) => setFormData({ ...formData, targetCountry: event.target.value })} className="glass-input w-full rounded-xl py-3 pl-9 pr-3 text-xs">
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>United States</option>
                      <option>Germany</option>
                      <option>United Arab Emirates</option>
                      <option>Not decided yet</option>
                    </select>
                  </span>
                </label>
              </div>
            </>
          )}

          <label className="block text-xs font-semibold text-slate-300">
            Email address
            <span className="relative mt-1.5 block">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
              <input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="student@example.com" autoComplete="email" className="glass-input w-full rounded-xl py-3 pl-9 pr-4 text-xs" required />
            </span>
          </label>

          <div className={`grid gap-4 ${authMode === 'register' ? 'sm:grid-cols-2' : ''}`}>
            <label className="block text-xs font-semibold text-slate-300">
              Password
              <span className="relative mt-1.5 block">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                <input type="password" minLength={8} value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} placeholder="Minimum 8 characters" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} className="glass-input w-full rounded-xl py-3 pl-9 pr-4 text-xs" required />
              </span>
            </label>
            {authMode === 'register' && (
              <label className="block text-xs font-semibold text-slate-300">
                Confirm password
                <span className="relative mt-1.5 block">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <input type="password" minLength={8} value={formData.confirmPassword} onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })} placeholder="Repeat password" autoComplete="new-password" className="glass-input w-full rounded-xl py-3 pl-9 pr-4 text-xs" required />
                </span>
              </label>
            )}
          </div>

          {authMode === 'register' && (
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/45 p-3 text-[11px] leading-5 text-slate-400">
              <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-600 accent-sky-500" />
              <span>I consent to my responses being used to generate and save a career-guidance profile. I understand this is guidance, not a clinical diagnosis or admission guarantee.</span>
            </label>
          )}

          <button type="submit" className="gradient-bg w-full rounded-xl py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-sky-500/20 transition hover:opacity-95">
            {authMode === 'login' ? (isAssessmentSignup ? 'Sign in & start assessment' : 'Sign in to student portal') : (isAssessmentSignup ? 'Create account & start assessment' : 'Create student account')}
          </button>
        </form>

        {authMode === 'login' && (
          <button type="button" onClick={() => { loginAsRole('student'); finishAuthentication(); }} className="mt-4 w-full text-center text-[11px] font-semibold text-sky-400 transition hover:text-sky-300">
            Use registered demo student
          </button>
        )}
      </div>
    </div>
  );
};
