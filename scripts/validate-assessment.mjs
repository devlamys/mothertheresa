import { APTITUDE_DOMAINS, APTITUDE_QUESTIONS } from '../src/data/aptitudeData.js';
import { scoreAptitudeAssessment } from '../src/utils/aptitudeScoring.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

assert(APTITUDE_QUESTIONS.length === 50, 'The assessment must contain exactly 50 questions.');
assert(new Set(APTITUDE_QUESTIONS.map((question) => question.id)).size === 50, 'Question IDs must be unique.');

APTITUDE_DOMAINS.forEach((domain) => {
  const domainItems = APTITUDE_QUESTIONS.filter((question) => question.domain === domain);
  assert(domainItems.length === 10, `${domain} must contain exactly 10 questions.`);
  assert(domainItems.filter((question) => question.kind === 'self-report').length === 6, `${domain} must contain six self-report items.`);
  assert(domainItems.filter((question) => question.kind === 'ability').length === 4, `${domain} must contain four ability items.`);
});

APTITUDE_QUESTIONS.filter((question) => question.kind === 'ability').forEach((question) => {
  assert(Number.isInteger(question.correctIndex), `Question ${question.id} needs a correct answer.`);
  assert(question.correctIndex >= 0 && question.correctIndex < question.options.length, `Question ${question.id} has an invalid correct answer.`);
});

const completeAnswers = Object.fromEntries(
  APTITUDE_QUESTIONS.map((question) => [question.id, question.kind === 'ability' ? question.correctIndex : 2]),
);
const result = scoreAptitudeAssessment(completeAnswers);
assert(result.assessmentQuality.answeredCount === 50, 'A complete response set must score all 50 answers.');
assert(Object.values(result.cognitiveScores).every((score) => score >= 0 && score <= 100), 'Every domain score must stay between 0 and 100.');

let incompleteRejected = false;
try {
  scoreAptitudeAssessment({});
} catch {
  incompleteRejected = true;
}
assert(incompleteRejected, 'Incomplete assessments must be rejected.');

console.log('Assessment validation passed: 50 unique questions, 10 per domain, valid answer keys, deterministic scoring, and incomplete-response rejection.');
