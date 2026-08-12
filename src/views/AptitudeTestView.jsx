import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/useApp';
import { APTITUDE_QUESTIONS, TEST_MODULES } from '../data/aptitudeData';
import { AlertCircle, Brain, CheckCircle2, ChevronLeft, ChevronRight, Clock, LockKeyhole, Sparkles, UserRoundCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AptitudeTestView = ({ onRequireSignup }) => {
  const { submitAptitudeTest, activeUser, userRole, showToast } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(2700);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const currentQuestion = APTITUDE_QUESTIONS[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / APTITUDE_QUESTIONS.length) * 100);
  const unansweredCount = APTITUDE_QUESTIONS.length - answeredCount;
  const activeModule = currentQuestion?.moduleId;

  const moduleProgress = useMemo(() => TEST_MODULES.reduce((progress, module) => {
    const questions = APTITUDE_QUESTIONS.filter((question) => question.moduleId === module.id);
    progress[module.id] = {
      answered: questions.filter((question) => answers[question.id] !== undefined).length,
      total: questions.length,
    };
    return progress;
  }, {}), [answers]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!activeUser || userRole !== 'student') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="glass-panel rounded-3xl border border-sky-500/30 p-8 text-center shadow-2xl sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
            <LockKeyhole className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-white">Student profile required</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
            Create or sign in to your student account before beginning. This protects your responses and saves the complete 50-question result to your portal.
          </p>
          <button type="button" onClick={onRequireSignup} className="gradient-bg mt-7 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20">
            <UserRoundCheck className="h-5 w-5" />
            Create account to continue
          </button>
        </div>
      </div>
    );
  }

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(Math.min(APTITUDE_QUESTIONS.length - 1, Math.max(0, index)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (optionIndex) => {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: optionIndex }));
  };

  const handleFinishTest = () => {
    const firstUnansweredIndex = APTITUDE_QUESTIONS.findIndex((question) => answers[question.id] === undefined);
    if (firstUnansweredIndex !== -1) {
      showToast(`Please answer all 50 questions. ${unansweredCount} still ${unansweredCount === 1 ? 'remains' : 'remain'}.`);
      goToQuestion(firstUnansweredIndex);
      return;
    }

    const submitted = submitAptitudeTest(answers);
    if (submitted) {
      confetti({ particleCount: 110, spread: 72, origin: { y: 0.62 } });
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7 px-4 py-8">
      <div className="glass-panel flex flex-col justify-between gap-5 rounded-3xl border border-slate-800 p-5 sm:p-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
            <Brain className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white sm:text-xl">Career & Aptitude Assessment</h1>
            <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
              Registered candidate: <span className="font-semibold text-sky-300">{activeUser.name}</span> · Question {currentQuestionIndex + 1} of {APTITUDE_QUESTIONS.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-sm font-bold ${timeLeft === 0 ? 'border-rose-500/30 bg-rose-950/40 text-rose-300' : 'border-slate-700 bg-slate-900/90 text-amber-400'}`}>
            <Clock className="h-4 w-4" />
            <span>{timeLeft === 0 ? 'Time elapsed' : formatTime(timeLeft)}</span>
          </div>
          <div className="min-w-28 grow sm:w-40 sm:grow-0">
            <div className="mb-1 flex justify-between text-[10px] text-slate-400">
              <span>{answeredCount}/50 answered</span>
              <span className="font-bold text-sky-400">{progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="gradient-bg h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
        {TEST_MODULES.map((module) => {
          const progress = moduleProgress[module.id];
          const isCurrent = activeModule === module.id;
          const isComplete = progress.answered === progress.total;
          return (
            <button
              key={module.id}
              type="button"
              onClick={() => goToQuestion(APTITUDE_QUESTIONS.findIndex((question) => question.moduleId === module.id))}
              className={`flex items-center justify-between rounded-2xl border p-3 text-left transition ${isCurrent ? 'border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}
            >
              <div>
                <div className={`text-xs font-bold ${isCurrent ? 'text-white' : 'text-slate-300'}`}>{module.name}</div>
                <div className="mt-1 text-[10px] text-slate-500">{progress.answered}/{progress.total}</div>
              </div>
              {isComplete ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <span className={`h-2 w-2 rounded-full ${isCurrent ? 'bg-sky-400' : 'bg-slate-700'}`} />}
            </button>
          );
        })}
      </div>

      <div className="glass-panel relative space-y-7 rounded-3xl border border-slate-700/80 p-6 shadow-2xl sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-300">
            <span>{TEST_MODULES.find((module) => module.id === activeModule)?.name}</span>
            <span className="text-slate-600">•</span>
            <span>{currentQuestion.kind === 'ability' ? 'Applied reasoning' : 'Personal preference'}</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">Choose the single best response</span>
        </div>

        <h2 className="text-xl font-bold leading-relaxed text-white sm:text-2xl">{currentQuestion.question}</h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, optionIndex) => {
            const isSelected = answers[currentQuestion.id] === optionIndex;
            return (
              <button
                key={option.text}
                type="button"
                onClick={() => handleSelectOption(optionIndex)}
                className={`group flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition sm:p-5 ${isSelected ? 'border-sky-500 bg-sky-600/20 text-white shadow-lg shadow-sky-500/10' : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${isSelected ? 'gradient-bg text-white' : 'bg-slate-800 text-slate-400 group-hover:text-white'}`}>
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  <span className="text-sm font-medium leading-6">{option.text}</span>
                </div>
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-sky-400 bg-sky-500' : 'border-slate-600'}`}>
                  {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
              </button>
            );
          })}
        </div>

        {timeLeft === 0 && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-950/20 p-3 text-xs leading-5 text-amber-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            The suggested time has elapsed. Complete every remaining item carefully; the assessment will not submit incomplete responses.
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-slate-800/80 pt-6">
          <button type="button" onClick={() => goToQuestion(currentQuestionIndex - 1)} disabled={currentQuestionIndex === 0} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-35 sm:px-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <span className="hidden text-[11px] font-medium text-slate-500 md:block">
            {unansweredCount === 0 ? 'All responses complete — ready to score' : `${unansweredCount} unanswered`}
          </span>

          {currentQuestionIndex === APTITUDE_QUESTIONS.length - 1 ? (
            <button type="button" onClick={handleFinishTest} className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold text-white shadow-lg transition sm:px-7 ${unansweredCount === 0 ? 'gradient-bg shadow-sky-500/25 hover:scale-[1.01]' : 'bg-slate-700 hover:bg-slate-600'}`}>
              <Sparkles className="h-4 w-4 text-amber-300" />
              Score all 50 responses
            </button>
          ) : (
            <button type="button" onClick={() => goToQuestion(currentQuestionIndex + 1)} className="gradient-bg inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-500/20 transition hover:opacity-95 sm:px-6">
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl text-center text-[10px] leading-5 text-slate-500">
        This structured assessment supports education and career counseling. Results are based on completed responses and should be interpreted with a qualified counselor; they are not a clinical diagnosis or admission guarantee.
      </div>
    </div>
  );
};
