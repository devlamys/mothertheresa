export const INITIAL_DEMO_STATE = {
  activeUser: null, // null for guest, or user object
  userRole: 'guest', // 'guest', 'student', 'counselor'

  // Preloaded demo student profile
  studentProfile: {
    id: 'std_101',
    name: 'Aarav Sharma',
    email: 'student@mothertheresa.edu',
    phone: '+971 50 892 4112',
    targetCountry: 'Canada',
    preferredMajor: 'Computer Science & AI',
    budgetYear: '$35,000 - $50,000',
    educationLevel: 'High School Senior (Grade 12)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },

  // Preloaded demo counselor profile
  counselorProfile: {
    id: 'cns_501',
    name: 'Dr. Sarah Jenkins',
    email: 'counselor@mothertheresa.edu',
    title: 'Senior Global Admissions Director',
    branch: 'Dubai Main Branch',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },

  // Sample Aptitude Test Results
  testResults: [
    {
      id: 'res_901',
      studentId: 'std_101',
      studentName: 'Aarav Sharma',
      dateTaken: '2026-08-05',
      overallScore: 88,
      cognitiveBreakdown: {
        analytical: 92,
        technical: 88,
        business: 75,
        creative: 70,
        social: 65
      },
      topCareerMatch: 'Data Science & Artificial Intelligence Specialist',
      recommendedDegree: 'B.Sc. in Computer Science & AI',
      matchedUniversity: 'University of Toronto',
      counselorReviewStatus: 'Reviewed',
      counselorNotes: 'Exceptional analytical & technical aptitude. Strongly recommend pushing for top Tier-1 AI programs in Canada & USA.'
    }
  ],

  // Student University Applications
  applications: [
    {
      id: 'app_1',
      studentId: 'std_101',
      studentName: 'Aarav Sharma',
      universityId: 'toronto_ca',
      universityName: 'University of Toronto',
      country: 'Canada',
      program: 'B.Sc. in Computer Science & AI',
      intake: 'Fall 2027',
      status: 'Under Review', // 'Draft', 'Submitted', 'Under Review', 'Offer Letter Issued', 'Visa Approved'
      applicationFee: '$180 (Paid)',
      submissionDate: '2026-07-20',
      documentsVerified: true
    },
    {
      id: 'app_2',
      studentId: 'std_101',
      studentName: 'Aarav Sharma',
      universityId: 'mit_usa',
      universityName: 'Massachusetts Institute of Technology (MIT)',
      country: 'USA',
      program: 'B.Sc. in Data Science',
      intake: 'Fall 2027',
      status: 'Submitted',
      applicationFee: '$250 (Paid)',
      submissionDate: '2026-08-01',
      documentsVerified: false
    }
  ],

  // Document Vault
  documents: [
    { id: 'doc_1', name: 'High_School_Transcript_Grade11_12.pdf', type: 'Transcript', size: '2.4 MB', uploadDate: '2026-07-15', status: 'Verified' },
    { id: 'doc_2', name: 'IELTS_Academic_Scorecard_8.0.pdf', type: 'Language Exam', size: '1.1 MB', uploadDate: '2026-07-18', status: 'Verified' },
    { id: 'doc_3', name: 'Statement_of_Purpose_AI_Toronto.docx', type: 'SOP', size: '850 KB', uploadDate: '2026-07-22', status: 'Under Review' }
  ],

  // Scheduled Counseling Appointments
  appointments: [
    {
      id: 'apt_1',
      studentName: 'Aarav Sharma',
      counselorName: 'Dr. Sarah Jenkins',
      date: '2026-08-15',
      time: '14:00 GST',
      mode: 'Zoom Video Call',
      topic: 'Canada Student Visa Strategy & SOP Final Polish',
      status: 'Confirmed'
    }
  ],

  // Incoming Leads for ERP
  leads: [
    { id: 'lead_1', name: 'Fatima Al-Maktoum', email: 'fatima.m@gmail.com', phone: '+971 52 443 1198', targetCountry: 'United Kingdom', major: 'International Business', score: 84, date: '2026-08-10', status: 'New Inquiry' },
    { id: 'lead_2', name: 'Rohan Gupta', email: 'rohan.g@yahoo.com', phone: '+91 98765 43210', targetCountry: 'Germany', major: 'Biomedical Tech', score: 79, date: '2026-08-09', status: 'Counselor Assigned' },
    { id: 'lead_3', name: 'Emily Chen', email: 'emily.chen@outlook.com', phone: '+1 416 555 0192', targetCountry: 'USA', major: 'UI/UX Design', score: 91, date: '2026-08-08', status: 'Offer Received' }
  ]
};
