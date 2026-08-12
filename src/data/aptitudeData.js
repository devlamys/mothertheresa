export const APTITUDE_DOMAINS = ['analytical', 'technical', 'creative', 'business', 'social'];

export const TEST_MODULES = [
  { id: 'analytical', name: 'Analytical', icon: 'ChartNoAxesCombined' },
  { id: 'technical', name: 'Technical', icon: 'Code2' },
  { id: 'creative', name: 'Creative', icon: 'Palette' },
  { id: 'business', name: 'Business', icon: 'BriefcaseBusiness' },
  { id: 'social', name: 'Social', icon: 'Users' },
];

const agreementOptions = (reverse = false) => [
  { text: 'Strongly disagree', score: reverse ? 5 : 1 },
  { text: 'Disagree', score: reverse ? 4 : 2 },
  { text: 'Not sure', score: 3 },
  { text: 'Agree', score: reverse ? 2 : 4 },
  { text: 'Strongly agree', score: reverse ? 1 : 5 },
];

const selfReport = (id, domain, question, reverse = false) => ({
  id,
  moduleId: domain,
  domain,
  kind: 'self-report',
  reverse,
  question,
  options: agreementOptions(reverse),
});

const ability = (id, domain, question, options, correctIndex) => ({
  id,
  moduleId: domain,
  domain,
  kind: 'ability',
  question,
  options: options.map((text) => ({ text })),
  correctIndex,
});

export const APTITUDE_QUESTIONS = [
  // Analytical: six preference indicators and four applied reasoning items.
  selfReport(1, 'analytical', 'I enjoy breaking a complex problem into smaller, testable parts.'),
  selfReport(2, 'analytical', 'I look for evidence and patterns before reaching a conclusion.'),
  selfReport(3, 'analytical', 'I notice inconsistencies in numbers, arguments, or instructions.'),
  selfReport(4, 'analytical', 'Tasks that require careful comparison quickly make me lose interest.', true),
  selfReport(5, 'analytical', 'Logic puzzles and data-based questions hold my attention.'),
  selfReport(6, 'analytical', 'I usually trust my first impression more than checking the facts.', true),
  ability(7, 'analytical', 'What number comes next in the sequence: 3, 7, 15, 31, ___?', ['47', '55', '63', '64'], 2),
  ability(8, 'analytical', 'A course costs $80. Its price rises by 25% and is then discounted by 10%. What is the final price?', ['$88', '$90', '$92', '$100'], 1),
  ability(9, 'analytical', 'All mentors are educators. Some educators are researchers. Which conclusion must be true?', ['Some mentors are researchers', 'All researchers are mentors', 'All mentors are educators', 'No educators are mentors'], 2),
  ability(10, 'analytical', 'What is the mean of 12, 15, 18, 20, and 25?', ['17', '18', '19', '20'], 1),

  // Technical.
  selfReport(11, 'technical', 'I like understanding how digital tools and systems work behind the screen.'),
  selfReport(12, 'technical', 'Troubleshooting a device or software problem feels satisfying.'),
  selfReport(13, 'technical', 'I am comfortable learning unfamiliar software by testing its features.'),
  selfReport(14, 'technical', 'I prefer using technology without knowing anything about how it works.', true),
  selfReport(15, 'technical', 'I enjoy building, configuring, or automating practical solutions.'),
  selfReport(16, 'technical', 'Precise technical instructions make me lose patience quickly.', true),
  ability(17, 'technical', 'A program starts with x = 3 and repeats x = x + 2 four times. What is the final value of x?', ['9', '10', '11', '12'], 2),
  ability(18, 'technical', 'Which account-security choice is strongest?', ['One short password used everywhere', 'A long unique passphrase with multi-factor authentication', 'A birth date followed by 123', 'Saving the same password in a public note'], 1),
  ability(19, 'technical', 'Which spreadsheet formula correctly averages cells B2 through B11?', ['=TOTAL(B2:B11)', '=AVERAGE(B2:B11)', '=MEAN(B2-B11)', '=COUNT(B2:B11)'], 1),
  ability(20, 'technical', 'A bug appeared immediately after a software update. What is the best first diagnostic step?', ['Replace the entire system', 'Compare recent changes and reproduce the bug', 'Ignore it until another user reports it', 'Delete all user data'], 1),

  // Creative.
  selfReport(21, 'creative', 'I naturally generate several different ideas before choosing one.'),
  selfReport(22, 'creative', 'Visual presentation and storytelling matter to how I communicate.'),
  selfReport(23, 'creative', 'I often imagine ways to improve a confusing product or experience.'),
  selfReport(24, 'creative', 'I prefer using only familiar solutions even when they do not work well.', true),
  selfReport(25, 'creative', 'I enjoy creating designs, stories, media, or original concepts.'),
  selfReport(26, 'creative', 'Open-ended tasks with more than one possible answer make me uncomfortable.', true),
  ability(27, 'creative', 'Which layout creates the clearest visual hierarchy for an event poster?', ['All text in the same size', 'Large event title, smaller key details, then a clear call to action', 'Five competing headlines', 'Important information hidden in a corner'], 1),
  ability(28, 'creative', 'What is the strongest way to choose between two interface designs?', ['Choose the designer’s favourite', 'Test both with representative users against the same tasks', 'Use the design with more colours', 'Combine every element from both'], 1),
  ability(29, 'creative', 'During early brainstorming, which approach usually produces the widest range of useful ideas?', ['Judge every idea immediately', 'Generate many possibilities before evaluating them', 'Copy the first competitor found', 'Stop after the first workable idea'], 1),
  ability(30, 'creative', 'Which text choice is generally most readable and accessible?', ['Light grey text on white', 'Dark navy text on white with sufficient size and spacing', 'Red text on green', 'A long paragraph in all capital letters'], 1),

  // Business.
  selfReport(31, 'business', 'I enjoy setting goals, planning resources, and tracking progress.'),
  selfReport(32, 'business', 'I am curious about why customers choose one product or service over another.'),
  selfReport(33, 'business', 'Negotiating priorities and trade-offs is interesting to me.'),
  selfReport(34, 'business', 'I avoid taking responsibility for budgets or measurable outcomes.', true),
  selfReport(35, 'business', 'I often notice opportunities to create value or improve a process.'),
  selfReport(36, 'business', 'I prefer taking action without checking whether the result was successful.', true),
  ability(37, 'business', 'A business earns $120,000 in revenue and has $75,000 in total costs. What is its profit?', ['$35,000', '$45,000', '$55,000', '$195,000'], 1),
  ability(38, 'business', 'A campaign receives 4,000 visits and 200 applications. What is the conversion rate?', ['2%', '4%', '5%', '8%'], 2),
  ability(39, 'business', 'Before investing heavily in an unfamiliar market, what is the most sensible first move?', ['Commit the full budget immediately', 'Run a small pilot and measure demand', 'Copy another company without research', 'Ignore local regulations'], 1),
  ability(40, 'business', 'An initiative costs $10,000 and produces a net gain of $15,000. What is its ROI?', ['15%', '50%', '100%', '150%'], 1),

  // Social.
  selfReport(41, 'social', 'I feel energised when I help someone understand or solve a problem.'),
  selfReport(42, 'social', 'I listen carefully before offering advice.'),
  selfReport(43, 'social', 'I adapt how I communicate for people with different needs or backgrounds.'),
  selfReport(44, 'social', 'I prefer working without feedback or discussion from other people.', true),
  selfReport(45, 'social', 'I am comfortable helping a group resolve disagreement.'),
  selfReport(46, 'social', 'Considering perspectives from other cultures is difficult for me.', true),
  ability(47, 'social', 'Which response best demonstrates active listening?', ['Immediately explain your own experience', 'Paraphrase what you heard and ask whether you understood correctly', 'Change the topic to avoid emotion', 'Give advice before the person finishes'], 1),
  ability(48, 'social', 'Two teammates disagree strongly. What is the best first step toward resolution?', ['Publicly decide who is wrong', 'Hold a calm discussion focused on shared goals and specific concerns', 'Remove both people from the project', 'Ignore the conflict'], 1),
  ability(49, 'social', 'An international teammate’s message seems abrupt. What is the most constructive response?', ['Assume disrespect', 'Ask for clarification and check for communication-style differences', 'Forward it to everyone', 'Stop communicating'], 1),
  ability(50, 'social', 'Which feedback is most useful?', ['You are bad at presentations', 'Everything was fine', 'The opening was clear; add evidence to the second point and slow down at the conclusion', 'Do it differently next time'], 2),
];

export const ASSESSMENT_VERSION = 'balanced-50-v1';
