export const CAREER_PROFILES = [
  {
    id: 'data_science_ai',
    title: 'Data Science & Artificial Intelligence Specialist',
    primaryDomain: 'technical',
    secondaryDomain: 'analytical',
    description: 'Design machine learning models, analyze complex big data, and engineer AI algorithms driving modern technology.',
    matchFormula: (scores) => Math.round((scores.technical * 0.55 + scores.analytical * 0.35 + scores.business * 0.10)),
    salaryRange: '$85,000 - $165,000 / year',
    growthRate: '+32% (Very High Demand)',
    keySkills: ['Python & PyTorch', 'Statistical Modeling', 'Machine Learning', 'Big Data Engineering', 'SQL & Cloud Architecture'],
    recommendedDegrees: [
      'B.Sc. in Computer Science & AI',
      'B.Sc. in Data Analytics & Machine Learning',
      'M.Sc. in Applied Data Science & Computational Intelligence'
    ],
    targetCountries: ['USA', 'Canada', 'Germany', 'United Kingdom', 'Australia'],
    icon: 'Cpu',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'ux_product_design',
    title: 'UI/UX & Product Design Specialist',
    primaryDomain: 'creative',
    secondaryDomain: 'social',
    description: 'Craft intuitive visual interfaces, conduct user research, and shape human-centered digital product experiences.',
    matchFormula: (scores) => Math.round((scores.creative * 0.50 + scores.social * 0.30 + scores.technical * 0.20)),
    salaryRange: '$75,000 - $140,000 / year',
    growthRate: '+24% (High Demand)',
    keySkills: ['Figma & Prototyping', 'User Research & Personas', 'Design Systems', 'Interaction Architecture', 'Usability Testing'],
    recommendedDegrees: [
      'B.Des. in Digital Product & Interaction Design',
      'B.Sc. in Human-Computer Interaction (HCI)',
      'B.A. in Media Arts & UX Design'
    ],
    targetCountries: ['USA', 'United Kingdom', 'Canada', 'Australia', 'UAE'],
    icon: 'Layout',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'int_business_fintech',
    title: 'International Business & FinTech Strategist',
    primaryDomain: 'business',
    secondaryDomain: 'analytical',
    description: 'Navigate global financial markets, lead cross-border corporate strategy, and build tech-enabled financial solutions.',
    matchFormula: (scores) => Math.round((scores.business * 0.55 + scores.analytical * 0.30 + scores.social * 0.15)),
    salaryRange: '$90,000 - $175,000 / year',
    growthRate: '+21% (Steady Expansion)',
    keySkills: ['Financial Modeling', 'Global Market Analysis', 'Venture Capital', 'Strategic Management', 'FinTech Solutions'],
    recommendedDegrees: [
      'B.B.A. in International Finance & Banking',
      'B.Sc. in Economics & Financial Technology',
      'Global MBA / M.Sc. in International Business'
    ],
    targetCountries: ['United Kingdom', 'USA', 'UAE', 'Singapore', 'Germany'],
    icon: 'TrendingUp',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'biomedical_health_tech',
    title: 'Biomedical Engineering & Healthcare Tech',
    primaryDomain: 'analytical',
    secondaryDomain: 'technical',
    description: 'Pioneer advanced medical technologies, genetic diagnostics, and biotech systems to revolutionize healthcare.',
    matchFormula: (scores) => Math.round((scores.analytical * 0.45 + scores.technical * 0.35 + scores.social * 0.20)),
    salaryRange: '$80,000 - $150,000 / year',
    growthRate: '+28% (Rapid Growth)',
    keySkills: ['Biomedical Imaging', 'Genomic Data Analysis', 'Medical Device Prototyping', 'Biotech Compliance', 'Clinical Research'],
    recommendedDegrees: [
      'B.Sc. in Biomedical Engineering',
      'B.Sc. in Biotechnology & Bioinformatics',
      'M.Sc. in Health Data Technology'
    ],
    targetCountries: ['USA', 'Germany', 'Canada', 'United Kingdom', 'Australia'],
    icon: 'Activity',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'global_counseling_edtech',
    title: 'EdTech Innovator & International Counselor',
    primaryDomain: 'social',
    secondaryDomain: 'business',
    description: 'Empower students worldwide through education tech solutions, career advisory, and global university partnerships.',
    matchFormula: (scores) => Math.round((scores.social * 0.50 + scores.business * 0.30 + scores.creative * 0.20)),
    salaryRange: '$65,000 - $125,000 / year',
    growthRate: '+19% (High Impact)',
    keySkills: ['Career Advisory', 'EdTech Platform Strategy', 'Cross-Cultural Leadership', 'Public Speaking', 'Psychometric Analysis'],
    recommendedDegrees: [
      'B.A. in Educational Psychology & Counseling',
      'B.Sc. in Organizational Leadership',
      'M.Ed. in International Higher Education Management'
    ],
    targetCountries: ['USA', 'United Kingdom', 'Canada', 'UAE', 'Australia'],
    icon: 'Award',
    color: 'from-amber-500 to-orange-600'
  }
];
