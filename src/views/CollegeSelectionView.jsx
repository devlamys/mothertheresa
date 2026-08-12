import React, { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Brain, Check, ChevronRight, GraduationCap, MapPin, Search, SlidersHorizontal, Star } from 'lucide-react';
import { GLOBAL_UNIVERSITIES } from '../data/universityData';
import { COUNTRY_META, PROGRAM_AREAS, universityMatchesArea } from '../utils/collegeUtils';
import { useApp } from '../context/useApp';

const countries = ['All', ...new Set(GLOBAL_UNIVERSITIES.map((university) => university.country))];

export const CollegeSelectionView = ({ onViewCollege, onStartTest, shortlistedIds, onToggleShortlist }) => {
  const { currentTestResult } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [scholarshipsOnly, setScholarshipsOnly] = useState(false);
  const [profileMatchOnly, setProfileMatchOnly] = useState(false);

  const filteredUniversities = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return GLOBAL_UNIVERSITIES.filter((university) => {
      const matchesSearch = !normalizedSearch || [university.name, university.city, university.country, ...university.featuredPrograms].some((value) => value.toLowerCase().includes(normalizedSearch));
      const matchesCountry = selectedCountry === 'All' || university.country === selectedCountry;
      const matchesArea = universityMatchesArea(university, selectedArea);
      const matchesScholarship = !scholarshipsOnly || university.scholarshipsAvailable;
      const matchesProfile = !profileMatchOnly || (currentTestResult && currentTestResult.overallScore >= university.minAptitudeScore);
      return matchesSearch && matchesCountry && matchesArea && matchesScholarship && matchesProfile;
    });
  }, [currentTestResult, profileMatchOnly, scholarshipsOnly, searchTerm, selectedArea, selectedCountry]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCountry('All');
    setSelectedArea('All');
    setScholarshipsOnly(false);
    setProfileMatchOnly(false);
  };

  return (
    <div className="bg-[#f7fafc] text-slate-900">
      <section className="relative overflow-hidden bg-[#052b50] px-5 py-16 text-white sm:px-8 lg:px-12 lg:py-20">
        <div className="absolute -right-28 -top-44 h-96 w-96 rounded-full border-[68px] border-white/[0.035]" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1280px]">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sky-300">College Finder</p>
          <div className="mt-4 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-display text-[clamp(2.7rem,6vw,4.8rem)] font-semibold leading-[1.02] tracking-[-0.05em]">Research. Compare. Shortlist.</h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-sky-100/70 sm:text-base">Explore current sample institutions by destination and program area, then review the entry profile before discussing your shortlist with a counselor.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <div><strong className="block text-sm">{shortlistedIds.length} shortlisted</strong><span className="text-[10px] text-sky-100/60">Saved for this session</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-1 max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_55px_rgba(6,45,85,0.1)] sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.3fr_0.8fr_0.9fr]">
            <label className="relative block">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search university, city, or program" className="form-field pl-11" />
            </label>
            <label>
              <span className="sr-only">Country</span>
              <select value={selectedCountry} onChange={(event) => setSelectedCountry(event.target.value)} className="form-field">
                {countries.map((country) => <option key={country}>{country}</option>)}
              </select>
            </label>
            <label>
              <span className="sr-only">Program area</span>
              <select value={selectedArea} onChange={(event) => setSelectedArea(event.target.value)} className="form-field">
                {Object.keys(PROGRAM_AREAS).map((area) => <option key={area}>{area}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-[11px] font-bold text-slate-600">
              <input type="checkbox" checked={scholarshipsOnly} onChange={(event) => setScholarshipsOnly(event.target.checked)} className="accent-sky-600" /> Scholarships available
            </label>
            <label className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-bold ${currentTestResult ? 'cursor-pointer bg-sky-50 text-sky-700' : 'cursor-not-allowed bg-slate-100 text-slate-400'}`}>
              <input type="checkbox" disabled={!currentTestResult} checked={profileMatchOnly} onChange={(event) => setProfileMatchOnly(event.target.checked)} className="accent-sky-600" /> Fits my aptitude profile
            </label>
            {!currentTestResult && <button type="button" onClick={onStartTest} className="text-[11px] font-extrabold text-[#0868b5]">Take assessment to unlock profile matching</button>}
            <button type="button" onClick={resetFilters} className="ml-auto text-[11px] font-bold text-slate-500 transition hover:text-slate-800">Reset filters</button>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Selection results</p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-[-0.035em] text-[#062d55]">{filteredUniversities.length} {filteredUniversities.length === 1 ? 'institution' : 'institutions'} found</h2>
            </div>
            <p className="max-w-md text-xs leading-5 text-slate-500">Rankings, fees, and admissions information should be reconfirmed with the institution before applying.</p>
          </div>

          {filteredUniversities.length ? (
            <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredUniversities.map((university) => {
                const meta = COUNTRY_META[university.country] || { code: university.country.slice(0, 2).toUpperCase(), color: 'from-slate-500 to-slate-700' };
                const isShortlisted = shortlistedIds.includes(university.id);
                const profileEligible = currentTestResult && currentTestResult.overallScore >= university.minAptitudeScore;
                return (
                  <article key={university.id} className="flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(6,45,85,0.07)] transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(6,45,85,0.12)]">
                    <div className="flex items-center justify-between border-b border-slate-100 p-5">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.color} text-xs font-black tracking-wider text-white`}>{meta.code}</div>
                      <button type="button" onClick={() => onToggleShortlist(university.id)} className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${isShortlisted ? 'border-amber-300 bg-amber-50 text-amber-500' : 'border-slate-200 text-slate-400 hover:border-amber-300 hover:text-amber-500'}`} aria-label={`${isShortlisted ? 'Remove' : 'Add'} ${university.name} ${isShortlisted ? 'from' : 'to'} shortlist`}>
                        <Star className={`h-4 w-4 ${isShortlisted ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <div className="flex grow flex-col p-5">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-blue-700">{university.worldRanking}</span>
                        {profileEligible && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-emerald-700"><Check className="h-3 w-3" /> Profile fit</span>}
                      </div>
                      <h3 className="mt-4 text-xl font-extrabold leading-snug text-[#062d55]">{university.name}</h3>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" /> {university.city}, {university.country}</p>

                      <div className="mt-5 space-y-2 border-t border-slate-100 pt-5">
                        {university.featuredPrograms.slice(0, 3).map((program) => (
                          <div key={program} className="flex items-start gap-2 text-xs font-semibold leading-5 text-slate-600"><BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" /> {program}</div>
                        ))}
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3 text-[10px]">
                        <div><span className="block text-slate-400">Estimated tuition</span><strong className="mt-1 block text-slate-700">{university.tuitionPerYear}</strong></div>
                        <div><span className="block text-slate-400">Profile guideline</span><strong className="mt-1 block text-slate-700">{university.minAptitudeScore}+ index</strong></div>
                      </div>

                      <button type="button" onClick={() => onViewCollege(university)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#062d55] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#0a416f]">View college details <ChevronRight className="h-4 w-4" /></button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-9 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-300" />
              <h3 className="mt-4 text-lg font-extrabold text-[#062d55]">No institutions match these filters</h3>
              <p className="mt-2 text-sm text-slate-500">Try another destination or program area.</p>
              <button type="button" onClick={resetFilters} className="mt-5 rounded-full bg-[#0868b5] px-5 py-3 text-xs font-bold text-white">Clear filters</button>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1280px] gap-8 rounded-[2rem] bg-[#eaf6fd] p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0868b5] shadow-sm"><GraduationCap className="h-6 w-6" /></span>
            <div><h2 className="font-display text-3xl font-semibold tracking-[-0.035em] text-[#062d55]">A shortlist is a starting point &mdash; not the final decision.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">A counselor can help verify entry requirements, total cost, recognition, scholarships, and whether a program fits your academic background.</p></div>
          </div>
          <button type="button" onClick={onStartTest} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0868b5] px-6 py-3.5 text-sm font-bold text-white"><Brain className="h-4 w-4" /> Build my profile <ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>
    </div>
  );
};
