export const COUNTRY_META = {
  USA: { code: 'US', color: 'from-indigo-500 to-blue-700' },
  'United Kingdom': { code: 'UK', color: 'from-sky-500 to-blue-700' },
  Canada: { code: 'CA', color: 'from-red-500 to-rose-700' },
  Australia: { code: 'AU', color: 'from-amber-400 to-orange-600' },
  Germany: { code: 'DE', color: 'from-slate-500 to-slate-800' },
  UAE: { code: 'AE', color: 'from-emerald-500 to-teal-700' },
};

export const PROGRAM_AREAS = {
  All: [],
  'Computing & AI': ['computer', 'artificial', 'data', 'robotics', 'digital'],
  'Business & Economics': ['business', 'commerce', 'finance', 'economics', 'management'],
  'Design & Media': ['design', 'media', 'arts', 'ux'],
  'Engineering & Science': ['engineering', 'biomedical', 'biotechnology', 'science'],
  'Humanities & Social': ['humanities', 'social', 'philosophy', 'psychology'],
};

export const universityMatchesArea = (university, area) => {
  if (area === 'All') return true;
  const keywords = PROGRAM_AREAS[area] || [];
  return university.featuredPrograms.some((program) =>
    keywords.some((keyword) => program.toLowerCase().includes(keyword)),
  );
};
