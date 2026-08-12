import React from 'react';
import { useApp } from '../context/useApp';
import { TrendingUp, Sparkles, Brain, CheckCircle, GraduationCap, Printer, Shield, Compass, BookOpen } from 'lucide-react';
import { GLOBAL_UNIVERSITIES } from '../data/universityData';

export const CareerResultsView = () => {
  const { currentTestResult, testResults, setCurrentView } = useApp();

  // Fallback to latest test result if current is null
  const result = currentTestResult || testResults[0];

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">No Aptitude Test Result Found</h2>
        <p className="text-slate-400 text-sm">Please take the aptitude test to generate your career blueprint.</p>
        <button 
          onClick={() => setCurrentView('test')}
          className="gradient-bg text-white font-bold px-6 py-3 rounded-xl"
        >
          Start Aptitude Test
        </button>
      </div>
    );
  }

  const { overallScore, cognitiveBreakdown, matchedCareers, counselorNotes, interestBreakdown, abilityBreakdown, assessmentQuality } = result;

  const getScoreBadge = (score) => {
    if (score >= 80) return { label: 'Very strong', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 65) return { label: 'Strong', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
    if (score >= 45) return { label: 'Moderate', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' };
    return { label: 'Developing', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      
      {/* Top Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-indigo-500/30 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
            <CheckCircle className="w-4 h-4" />
            <span>Balanced assessment completed</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Career Guidance Blueprint
          </h1>

          <p className="text-slate-300 text-sm max-w-xl">
            Candidate: <span className="font-bold text-white">{result.studentName}</span> • Evaluated on {result.dateTaken}
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="glass-card p-6 rounded-2xl border border-amber-500/30 text-center space-y-1 shrink-0 z-10">
          <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Overall profile index</div>
          <div className="text-5xl font-extrabold text-white gradient-text">{overallScore}/100</div>
          <div className="text-[10px] text-slate-400">Average across five measured domains</div>
        </div>

        {/* Action Buttons */}
        <div className="no-print flex items-center space-x-3 z-10">
          <button 
            onClick={handlePrint}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Print Score Summary"
          >
            <Printer className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setCurrentView('student_portal')}
            className="gradient-bg text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/25 hover:opacity-95 text-xs flex items-center space-x-2"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Go to Student Portal</span>
          </button>
        </div>
      </div>

      {/* Domain Score Breakdown */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Brain className="w-6 h-6 text-indigo-400" />
          <span>Balanced Domain Profile</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(cognitiveBreakdown).map(([domain, score]) => {
            const badge = getScoreBadge(score);
            return (
              <div key={domain} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 capitalize">{domain}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="text-2xl font-extrabold text-white">{score}%</div>

                {interestBreakdown?.[domain] !== undefined && abilityBreakdown?.[domain] !== undefined && (
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="rounded-lg bg-slate-900/70 p-2">
                      <span className="block text-slate-500">Interest</span>
                      <span className="font-bold text-sky-300">{interestBreakdown[domain]}%</span>
                    </div>
                    <div className="rounded-lg bg-slate-900/70 p-2">
                      <span className="block text-slate-500">Ability</span>
                      <span className="font-bold text-emerald-300">{abilityBreakdown[domain]}%</span>
                    </div>
                  </div>
                )}

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="gradient-bg h-full rounded-full transition-all duration-500"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {assessmentQuality && (
        <section className="grid gap-4 rounded-3xl border border-sky-500/20 bg-sky-950/20 p-6 sm:grid-cols-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Completion</div>
            <div className="mt-1 text-sm font-bold text-white">{assessmentQuality.answeredCount}/{assessmentQuality.questionCount} answered</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Response quality</div>
            <div className="mt-1 text-sm font-bold text-white">{assessmentQuality.responseQuality}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Scoring model</div>
            <div className="mt-1 text-sm font-bold text-white">{assessmentQuality.scoringModel}</div>
          </div>
        </section>
      )}

      {/* Top 3 Recommended Career Paths */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>Top Recommended Career Paths</span>
          </h2>
          <span className="text-xs text-slate-400">Weighted career-fit estimate</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matchedCareers && matchedCareers.slice(0, 3).map((career, idx) => (
            <div 
              key={career.id}
              className={`glass-card p-6 rounded-3xl border space-y-5 flex flex-col justify-between relative ${
                idx === 0 ? 'border-indigo-500/50 bg-indigo-950/20' : 'border-slate-800'
              }`}
            >
              {idx === 0 && (
                <div className="absolute -top-3 left-6 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  #1 Best Career Match
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between pt-2">
                  <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-extrabold text-amber-400">{career.matchScore}% Match</span>
                </div>

                <h3 className="text-xl font-bold text-white leading-snug">{career.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{career.description}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expected Salary:</span>
                    <span className="font-semibold text-emerald-400">{career.salaryRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Industry Growth:</span>
                    <span className="font-semibold text-sky-400">{career.growthRate}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400">Recommended Degrees:</div>
                  <div className="space-y-1 text-xs">
                    {career.recommendedDegrees.map((deg, dIdx) => (
                      <div key={dIdx} className="flex items-start space-x-1 text-slate-300">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{deg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Matching Global Universities */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <GraduationCap className="w-6 h-6 text-sky-400" />
          <span>Recommended Global University Match</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GLOBAL_UNIVERSITIES.slice(0, 4).map((uni) => (
            <div key={uni.id} className="glass-card p-6 rounded-2xl border border-slate-800 flex items-start space-x-4">
              <div className="text-4xl shrink-0">{uni.flag}</div>
              <div className="space-y-2 grow">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white">{uni.name}</h4>
                  <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                    {uni.worldRanking}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{uni.city}, {uni.country} • Tuition: {uni.tuitionPerYear}</p>
                
                <div className="flex flex-wrap gap-1 pt-1">
                  {uni.featuredPrograms.map((p, pIdx) => (
                    <span key={pIdx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Roadmap */}
      <section className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <Compass className="w-6 h-6 text-emerald-400" />
          <span>Your 5-Step International Student Action Roadmap</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
          
          <div className="glass-card p-4 rounded-xl text-center space-y-2 border-emerald-500/30 bg-emerald-950/20">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold mx-auto flex items-center justify-center text-xs">1</div>
            <div className="text-xs font-bold text-white">Aptitude Blueprint</div>
            <div className="text-[10px] text-emerald-400">Completed</div>
          </div>

          <div className="glass-card p-4 rounded-xl text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-bold mx-auto flex items-center justify-center text-xs">2</div>
            <div className="text-xs font-bold text-white">Language Prep</div>
            <div className="text-[10px] text-slate-400">IELTS / TOEFL 8.0</div>
          </div>

          <div className="glass-card p-4 rounded-xl text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-bold mx-auto flex items-center justify-center text-xs">3</div>
            <div className="text-xs font-bold text-white">University Selection</div>
            <div className="text-[10px] text-slate-400">Top 3 Shortlist</div>
          </div>

          <div className="glass-card p-4 rounded-xl text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-bold mx-auto flex items-center justify-center text-xs">4</div>
            <div className="text-xs font-bold text-white">ERP Document Vault</div>
            <div className="text-[10px] text-slate-400">SOP & Transcripts</div>
          </div>

          <div className="glass-card p-4 rounded-xl text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-bold mx-auto flex items-center justify-center text-xs">5</div>
            <div className="text-xs font-bold text-white">Visa Approval</div>
            <div className="text-[10px] text-slate-400">Pre-Departure</div>
          </div>

        </div>
      </section>

      {/* Counselor Note Section */}
      {counselorNotes && (
        <section className="glass-card p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/30 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Senior Counselor Evaluation & Notes</span>
          </div>
          <p className="text-sm text-slate-200 italic leading-relaxed">
            "{counselorNotes}"
          </p>
        </section>
      )}

    </div>
  );
};
