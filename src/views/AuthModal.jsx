import React, { useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../context/useApp';
import { loginStaff } from '../services/erpApi';

const inputClass = 'h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-sm font-semibold text-[#123b60] outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100';

export const AuthModal = ({ onClose, initialMode = 'login', onAuthenticated, purpose = 'portal' }) => {
  const { loginAsRole, registerStudent, showToast } = useApp();
  const [accountType, setAccountType] = useState('student');
  const [authMode, setAuthMode] = useState(initialMode);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    targetCountry: 'United Kingdom', educationLevel: 'Grade 12 / High school',
  });

  const isAssessmentSignup = purpose === 'assessment';
  const isStaff = accountType === 'staff';

  const finishAuthentication = (targetView) => {
    onAuthenticated?.(targetView);
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    if (formData.password.length < 8) {
      setFormError('Please use a password with at least 8 characters.');
      return;
    }

    setSubmitting(true);
    try {
      if (isStaff) {
        await loginStaff(formData.email, formData.password);
        loginAsRole('counselor');
        finishAuthentication('counselor_portal');
        return;
      }

      if (authMode === 'register') {
        if (!formData.name.trim() || !formData.phone.trim()) throw new Error('Please complete your name and phone number.');
        if (formData.password !== formData.confirmPassword) throw new Error('The passwords do not match.');
        if (!acceptedTerms) throw new Error('Please confirm the assessment consent and privacy notice.');
        registerStudent(formData);
      } else {
        loginAsRole('student');
      }
      finishAuthentication(isAssessmentSignup ? 'test' : 'student_portal');
    } catch (error) {
      setFormError(error.message || 'We could not sign you in. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (mode) => {
    setAuthMode(mode);
    setFormError('');
    setFormData((current) => ({ ...current, password: '', confirmPassword: '' }));
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-[#03182d]/75 p-3 backdrop-blur-xl sm:p-6" role="dialog" aria-modal="true" aria-label="Account access">
      <div className="relative grid max-h-[96vh] w-full max-w-[1060px] overflow-y-auto rounded-[2rem] border border-white/70 bg-white shadow-[0_35px_110px_rgba(2,20,40,0.35)] lg:grid-cols-[0.88fr_1.12fr]">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-[#062d55]" aria-label="Close login">
          <X className="h-5 w-5" />
        </button>

        <aside className="relative hidden min-h-[700px] overflow-hidden bg-[#062d55] lg:block">
          <img src={`${import.meta.env.BASE_URL}brand/study-abroad-hero.webp`} alt="" className="absolute inset-0 h-full w-full object-cover object-[68%_center]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#031b34] via-[#063764]/70 to-[#075ec5]/25" />
          <div className="relative flex h-full flex-col justify-between p-9 text-white">
            <button type="button" onClick={onClose} className="brand-logo-frame w-[220px] rounded-xl bg-white px-2 py-1 shadow-xl" aria-label="Return to website">
              <img src={`${import.meta.env.BASE_URL}brand/mother-teresa-logo.jpg`} alt="Mother Teresa Educational Global Trust" />
            </button>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] backdrop-blur-md"><Sparkles className="h-3.5 w-3.5 text-sky-200" /> Your global journey</span>
              <h2 className="font-display mt-5 text-4xl font-semibold leading-tight">One account.<br />Every important step.</h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-blue-50/75">Plan, apply, track documents, meet your counselor, and review your aptitude results in one secure workspace.</p>
              <div className="mt-7 grid gap-3">
                {['Personalized student dashboard', 'Application and document tracking', 'Guidance from trusted counselors'].map((item) => <div key={item} className="flex items-center gap-3 text-xs font-bold text-white/90"><CheckCircle2 className="h-4 w-4 text-sky-300" /> {item}</div>)}
              </div>
            </div>
          </div>
        </aside>

        <section className="p-5 pt-16 sm:p-9 sm:pt-16 lg:p-12">
          <div className="mx-auto max-w-xl">
            {!isAssessmentSignup && (
              <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1.5">
                <button type="button" onClick={() => { setAccountType('student'); setFormError(''); }} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-extrabold transition ${!isStaff ? 'bg-white text-[#075ec5] shadow-sm' : 'text-slate-500 hover:text-[#075ec5]'}`}><GraduationCap className="h-4 w-4" /> Student</button>
                <button type="button" onClick={() => { setAccountType('staff'); setAuthMode('login'); setFormError(''); }} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-extrabold transition ${isStaff ? 'bg-white text-[#075ec5] shadow-sm' : 'text-slate-500 hover:text-[#075ec5]'}`}><BriefcaseBusiness className="h-4 w-4" /> Staff ERP</button>
              </div>
            )}

            <div className="mt-8">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0874c9]">{isStaff ? 'Secure staff access' : isAssessmentSignup ? 'Assessment access' : 'Student account'}</span>
              <h1 className="font-display mt-2 text-3xl font-semibold tracking-[-0.035em] text-[#062d55] sm:text-4xl">
                {isStaff ? 'Welcome to the ERP.' : authMode === 'login' ? 'Welcome back.' : 'Create your profile.'}
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">{isStaff ? 'Sign in with your authorized staff credentials.' : isAssessmentSignup ? 'Create an account so your 50-question result can be saved.' : 'Access your study plan, applications, documents, and appointments.'}</p>
            </div>

            {!isStaff && (
              <div className="mt-7 flex gap-6 border-b border-slate-200">
                <button type="button" onClick={() => switchMode('login')} className={`border-b-2 pb-3 text-xs font-extrabold transition ${authMode === 'login' ? 'border-[#075ec5] text-[#075ec5]' : 'border-transparent text-slate-400'}`}>Sign in</button>
                <button type="button" onClick={() => switchMode('register')} className={`border-b-2 pb-3 text-xs font-extrabold transition ${authMode === 'register' ? 'border-[#075ec5] text-[#075ec5]' : 'border-transparent text-slate-400'}`}>Create account</button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {!isStaff && authMode === 'register' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="auth-label sm:col-span-2">Full name<span className="relative mt-2 block"><User className="auth-field-icon" /><input type="text" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="Your full name" autoComplete="name" className={inputClass} required /></span></label>
                  <label className="auth-label">Phone / WhatsApp<span className="relative mt-2 block"><Phone className="auth-field-icon" /><input type="tel" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} placeholder="+971 50 000 0000" autoComplete="tel" className={inputClass} required /></span></label>
                  <label className="auth-label">Preferred destination<span className="relative mt-2 block"><MapPin className="auth-field-icon" /><select value={formData.targetCountry} onChange={(event) => setFormData({ ...formData, targetCountry: event.target.value })} className={inputClass}>{['United Kingdom', 'Canada', 'Australia', 'United States', 'Germany', 'United Arab Emirates', 'Not decided yet'].map((country) => <option key={country}>{country}</option>)}</select></span></label>
                </div>
              )}

              <label className="auth-label">Email address<span className="relative mt-2 block"><Mail className="auth-field-icon" /><input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder={isStaff ? 'name@mothertheresa.edu' : 'student@example.com'} autoComplete="username" className={inputClass} required /></span></label>

              <div className={`grid gap-4 ${!isStaff && authMode === 'register' ? 'sm:grid-cols-2' : ''}`}>
                <label className="auth-label">Password<span className="relative mt-2 block"><Lock className="auth-field-icon" /><input type={showPassword ? 'text' : 'password'} minLength={8} value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} placeholder="Minimum 8 characters" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} className={`${inputClass} pr-11`} required /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#075ec5]" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span></label>
                {!isStaff && authMode === 'register' && <label className="auth-label">Confirm password<span className="relative mt-2 block"><Lock className="auth-field-icon" /><input type={showPassword ? 'text' : 'password'} minLength={8} value={formData.confirmPassword} onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })} placeholder="Repeat password" autoComplete="new-password" className={inputClass} required /></span></label>}
              </div>

              {!isStaff && authMode === 'register' && <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-[10px] leading-5 text-slate-600"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1 h-4 w-4 accent-[#075ec5]" /><span>I consent to my responses being used for a saved career-guidance profile. This guidance is not an admission guarantee.</span></label>}

              {formError && <div className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs leading-5 text-rose-700"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /> {formError}</div>}

              <button type="submit" disabled={submitting} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#075ec5] to-[#064a9d] text-xs font-extrabold text-white shadow-[0_14px_30px_rgba(7,94,197,0.24)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">
                {submitting ? 'Signing in…' : isStaff ? 'Sign in to Staff ERP' : authMode === 'login' ? 'Sign in to student portal' : isAssessmentSignup ? 'Create account & start assessment' : 'Create student account'} <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {!isStaff && authMode === 'login' && <button type="button" onClick={() => { loginAsRole('student'); showToast('Demo student workspace opened.'); finishAuthentication('student_portal'); }} className="mt-4 w-full rounded-xl border border-slate-200 py-3 text-xs font-extrabold text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#075ec5]">Explore with demo student</button>}
            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-semibold text-slate-400"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Secure access · Privacy-first guidance</div>
          </div>
        </section>
      </div>
    </div>
  );
};
