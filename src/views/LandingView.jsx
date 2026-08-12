import React from 'react';
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  GraduationCap,
  Headphones,
  Home,
  Mail,
  MessageCircleMore,
  PlaneTakeoff,
  Quote,
  ShieldCheck,
  Star,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { useApp } from '../context/useApp';

const iconLibrary = {
  users: UsersRound,
  university: Building2,
  globe: Globe2,
  shield: ShieldCheck,
  user: UserRound,
  clipboard: ClipboardCheck,
  headphones: Headphones,
  passport: BookOpenCheck,
  document: FileCheck2,
  graduation: GraduationCap,
  home: Home,
  plane: PlaneTakeoff,
  message: MessageCircleMore,
  mail: Mail,
};

const resolveImage = (source) => {
  if (!source) return '';
  if (/^(https?:|data:|blob:)/.test(source)) return source;
  return `${import.meta.env.BASE_URL}${source.replace(/^\/+/, '')}`;
};

export const LandingView = ({ onStartTest, onNavigate }) => {
  const { landingContent } = useApp();
  const { hero, stats, introduction, features, destinations, services, process, stories, callToAction } = landingContent;

  return (
    <div className="reference-landing bg-white text-slate-900">
      <section id="home" className="relative scroll-mt-24 overflow-hidden border-b border-blue-50 bg-white">
        <div className="absolute inset-0 hidden md:block" aria-hidden="true">
          <img src={resolveImage(hero.image)} alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/20" />
        </div>

        <div className="relative mx-auto grid min-h-[590px] max-w-[1500px] items-center px-5 py-12 sm:px-8 md:grid-cols-[0.53fr_0.47fr] lg:min-h-[650px] lg:px-12 xl:px-20">
          <div className="relative z-10 max-w-[670px] py-8">
            <div className="inline-flex items-center rounded-full bg-[#edf5ff] px-4 py-2 text-[11px] font-extrabold text-[#0861c2] shadow-sm ring-1 ring-blue-100">
              {hero.eyebrow}
            </div>
            <h1 className="font-display mt-6 text-[clamp(3rem,5.9vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-[#092d59]">
              <span className="block">{hero.titleLineOne}</span>
              <span className="mt-1 block">{hero.titleLineTwo} <span className="text-[#0961c7]">{hero.highlightedText}</span></span>
            </h1>
            <p className="mt-7 max-w-[590px] text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">{hero.description}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => onNavigate('contact')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#075ec5] px-6 py-4 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(7,94,197,0.26)] transition hover:-translate-y-0.5 hover:bg-[#064eaa]">
                <CalendarDays className="h-4 w-4" /> {hero.primaryCta}
              </button>
              <button type="button" onClick={() => document.querySelector('#destinations')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center gap-3 rounded-xl border border-[#2471ca] bg-white/90 px-6 py-4 text-sm font-extrabold text-[#0757ad] transition hover:bg-blue-50">
                {hero.secondaryCta} <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex -space-x-2">
                {['MT', 'ED', 'GT'].map((initials, index) => <span key={initials} className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-[9px] font-extrabold text-white ${['bg-[#062d55]', 'bg-[#0874c9]', 'bg-amber-500'][index]}`}>{initials}</span>)}
              </div>
              <p className="max-w-[320px] text-[11px] font-semibold leading-5 text-slate-600">{hero.trustLine}</p>
              <button type="button" onClick={onStartTest} className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#0861c2]">Take the aptitude test <ArrowRight className="h-3.5 w-3.5" /></button>
            </div>
          </div>

          <div className="relative mt-4 md:hidden">
            <img src={resolveImage(hero.image)} alt="International students preparing for study abroad" className="h-[340px] w-full rounded-[1.5rem] object-cover object-[70%_center] shadow-xl" />
          </div>

          <div className="pointer-events-none absolute bottom-10 right-[4%] hidden rounded-2xl border border-blue-100 bg-white/92 p-4 shadow-xl backdrop-blur md:flex md:items-center md:gap-3 xl:right-[5%]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf4ff] text-[#075ec5]"><Headphones className="h-5 w-5" /></span>
            <div><strong className="block text-xs text-[#062d55]">Expert support</strong><span className="text-[10px] text-slate-500">Every step of the journey</span></div>
          </div>
          <div className="pointer-events-none absolute bottom-11 left-[52%] hidden rounded-2xl border border-blue-100 bg-white/92 p-4 shadow-xl backdrop-blur lg:flex lg:items-center lg:gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf4ff] text-[#075ec5]"><ShieldCheck className="h-5 w-5" /></span>
            <div><strong className="block text-xs text-[#062d55]">Your journey</strong><span className="text-[10px] text-slate-500">Our commitment</span></div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-1 max-w-[1420px] px-5 sm:px-8 lg:px-12">
        <div className="grid overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(6,45,85,0.1)] sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = iconLibrary[stat.icon] || Star;
            return (
              <article key={`${stat.label}-${index}`} className={`flex items-center gap-4 px-6 py-6 ${index ? 'border-t border-slate-100 sm:border-l sm:border-t-0 sm:[&:nth-child(3)]:border-l-0 sm:[&:nth-child(3)]:border-t lg:[&:nth-child(3)]:border-l lg:[&:nth-child(3)]:border-t-0' : ''}`}>
                <Icon className="h-8 w-8 shrink-0 text-[#075ec5]" strokeWidth={2.2} />
                <div><strong className="font-display block text-2xl font-bold text-[#075ec5]">{stat.value}</strong><span className="mt-1 block text-[10px] font-bold text-slate-500">{stat.label}</span></div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="why-us" className="scroll-mt-28 px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1420px] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <p className="landing-eyebrow">{introduction.eyebrow}</p>
            <h2 className="font-display mt-4 text-[clamp(2.3rem,4vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-[#092d59]">{introduction.title}</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">{introduction.description}</p>
            <button type="button" onClick={() => onNavigate('about')} className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#2071ce] px-5 py-3 text-xs font-extrabold text-[#075ec5]">Learn more about us <ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = iconLibrary[feature.icon] || CheckCircle2;
              return (
                <article key={`${feature.title}-${index}`} className="landing-card min-h-[230px] rounded-2xl border border-slate-200 bg-white p-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff6ff] text-[#075ec5]"><Icon className="h-6 w-6" /></span>
                  <h3 className="mt-5 text-sm font-extrabold text-[#0757ad]">{feature.title}</h3>
                  <p className="mt-3 text-xs leading-6 text-slate-600">{feature.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="destinations" className="scroll-mt-28 bg-[#fbfdff] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1420px]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="landing-eyebrow">Popular study destinations</p><h2 className="sr-only">Popular study destinations</h2></div>
            <button type="button" onClick={() => onNavigate('colleges')} className="inline-flex w-fit items-center gap-2 rounded-full bg-[#edf5ff] px-5 py-3 text-xs font-extrabold text-[#075ec5]">View all destinations <ArrowRight className="h-4 w-4" /></button>
          </div>

          <div className="mt-6 flex snap-x gap-4 overflow-x-auto pb-4 xl:grid xl:grid-cols-6 xl:overflow-visible">
            {destinations.map((destination, index) => (
              <button key={`${destination.code}-${index}`} type="button" onClick={() => onNavigate('colleges')} className="landing-card group min-w-[230px] snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white text-left xl:min-w-0">
                <div className="relative h-40 overflow-hidden">
                  <img src={resolveImage(destination.image)} alt={`${destination.name} study destination`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#062d55]/55 to-transparent" />
                  <span className="absolute bottom-3 left-3 flex h-10 min-w-10 items-center justify-center rounded-full border-2 border-white bg-[#075ec5] px-2 text-[10px] font-black tracking-wider text-white shadow-lg">{destination.code}</span>
                </div>
                <div className="p-4"><h3 className="text-sm font-extrabold text-[#0757ad]">{destination.name}</h3><p className="mt-2 text-[10px] leading-5 text-slate-500">{destination.note}</p></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-28 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1420px]">
          <p className="landing-eyebrow text-center">Our services</p>
          <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
            {services.map((service, index) => {
              const Icon = iconLibrary[service.icon] || CheckCircle2;
              return (
                <article key={`${service.title}-${index}`} className="landing-card flex min-h-[135px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 text-center">
                  <Icon className="h-8 w-8 text-[#075ec5]" />
                  <h3 className="mt-4 text-[11px] font-extrabold leading-4 text-[#0757ad]">{service.title}</h3>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="process" className="scroll-mt-28 bg-[#fbfdff] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1420px]">
          <p className="landing-eyebrow text-center">Our process — simple, smooth & stress-free</p>
          <div className="relative mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div className="absolute left-[7%] right-[7%] top-6 hidden border-t-2 border-dotted border-[#3d7ed0] xl:block" aria-hidden="true" />
            {process.map((step, index) => {
              const Icon = iconLibrary[step.icon] || CheckCircle2;
              return (
                <article key={`${step.title}-${index}`} className="relative rounded-2xl border border-slate-200 bg-white px-4 pb-5 pt-10 text-center shadow-[0_12px_30px_rgba(6,45,85,0.045)]">
                  <span className="absolute -top-4 left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-[6px] border-white bg-[#075ec5] text-xs font-extrabold text-white shadow">{index + 1}</span>
                  <Icon className="mx-auto h-8 w-8 text-[#075ec5]" />
                  <h3 className="mt-4 text-xs font-extrabold text-[#0757ad]">{step.title}</h3>
                  <p className="mt-2 text-[10px] leading-5 text-slate-500">{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="stories" className="scroll-mt-28 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1420px]">
          <div className="flex flex-col items-center text-center">
            <p className="landing-eyebrow">Success stories</p>
            <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-500">Illustrative feedback themes are shown until approved student stories and consented photographs are published through the CMS.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stories.map((story, index) => (
              <article key={`${story.name}-${index}`} className="landing-card relative rounded-2xl border border-slate-200 bg-white p-5">
                <Quote className="absolute right-5 top-5 h-7 w-7 text-blue-100" />
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#075ec5] to-[#062d55] text-xs font-black text-white">{String(index + 1).padStart(2, '0')}</div>
                <p className="mt-5 text-xs leading-6 text-slate-600">“{story.quote}”</p>
                <div className="mt-5 border-t border-slate-100 pt-4"><h3 className="text-xs font-extrabold text-[#0757ad]">{story.name}</h3><p className="mt-1 text-[10px] font-semibold text-slate-500">{story.program}</p><p className="mt-1 text-[9px] leading-4 text-slate-400">{story.institution}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 lg:px-12 lg:pb-20">
        <div className="relative mx-auto flex max-w-[1420px] flex-col items-start gap-7 overflow-hidden rounded-[1.5rem] bg-gradient-to-r from-[#073b7a] via-[#075ec5] to-[#062d55] px-7 py-9 text-white shadow-[0_22px_50px_rgba(6,45,85,0.22)] sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14">
          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border-[42px] border-white/[0.06]" aria-hidden="true" />
          <PlaneTakeoff className="absolute right-24 top-4 hidden h-24 w-24 -rotate-12 text-white/[0.06] lg:block" />
          <div className="relative flex items-start gap-5">
            <span className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:flex"><PlaneTakeoff className="h-8 w-8 text-sky-200" /></span>
            <div><h2 className="font-display text-2xl font-semibold sm:text-3xl">{callToAction.title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-blue-50/75">{callToAction.description}</p></div>
          </div>
          <button type="button" onClick={() => onNavigate('contact')} className="relative inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-extrabold text-[#0757ad] shadow-xl"><CalendarDays className="h-4 w-4" /> {callToAction.button}</button>
        </div>
      </section>
    </div>
  );
};
