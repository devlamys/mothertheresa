import { APTITUDE_DOMAINS, APTITUDE_QUESTIONS, ASSESSMENT_VERSION } from '../data/aptitudeData.js';

const round = (value) => Math.round(value);

export const scoreAptitudeAssessment = (answers) => {
  const answeredCount = APTITUDE_QUESTIONS.filter((question) => answers[question.id] !== undefined).length;

  if (answeredCount !== APTITUDE_QUESTIONS.length) {
    throw new Error(`All ${APTITUDE_QUESTIONS.length} questions must be answered before scoring.`);
  }

  const cognitiveScores = {};
  const interestBreakdown = {};
  const abilityBreakdown = {};

  APTITUDE_DOMAINS.forEach((domain) => {
    const selfReportItems = APTITUDE_QUESTIONS.filter((question) => question.domain === domain && question.kind === 'self-report');
    const abilityItems = APTITUDE_QUESTIONS.filter((question) => question.domain === domain && question.kind === 'ability');

    const selfReportPoints = selfReportItems.reduce((total, question) => {
      const selectedOption = question.options[answers[question.id]];
      return total + selectedOption.score;
    }, 0);

    const minimumInterestPoints = selfReportItems.length;
    const maximumInterestPoints = selfReportItems.length * 5;
    const interestScore = round(((selfReportPoints - minimumInterestPoints) / (maximumInterestPoints - minimumInterestPoints)) * 100);

    const correctAnswers = abilityItems.reduce(
      (total, question) => total + (answers[question.id] === question.correctIndex ? 1 : 0),
      0,
    );
    const abilityScore = round((correctAnswers / abilityItems.length) * 100);

    interestBreakdown[domain] = interestScore;
    abilityBreakdown[domain] = abilityScore;
    cognitiveScores[domain] = round(interestScore * 0.55 + abilityScore * 0.45);
  });

  const selfReportSelections = APTITUDE_QUESTIONS
    .filter((question) => question.kind === 'self-report')
    .map((question) => answers[question.id]);
  const responseCounts = selfReportSelections.reduce((counts, optionIndex) => {
    counts[optionIndex] = (counts[optionIndex] || 0) + 1;
    return counts;
  }, {});
  const dominantResponseShare = Math.max(...Object.values(responseCounts)) / selfReportSelections.length;
  const responseQuality = dominantResponseShare > 0.7 ? 'Moderate - review with a counselor' : 'High';
  const overallScore = round(
    APTITUDE_DOMAINS.reduce((total, domain) => total + cognitiveScores[domain], 0) / APTITUDE_DOMAINS.length,
  );

  return {
    cognitiveScores,
    interestBreakdown,
    abilityBreakdown,
    overallScore,
    assessmentQuality: {
      version: ASSESSMENT_VERSION,
      answeredCount,
      questionCount: APTITUDE_QUESTIONS.length,
      completionRate: 100,
      responseQuality,
      scoringModel: '55% self-reported interest and 45% applied ability',
    },
  };
};
