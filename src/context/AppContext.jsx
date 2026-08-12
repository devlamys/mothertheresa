import React, { useState, useEffect } from 'react';
import { INITIAL_DEMO_STATE } from '../data/initialState';
import { CAREER_PROFILES } from '../data/careerData';
import { GLOBAL_UNIVERSITIES } from '../data/universityData';
import { scoreAptitudeAssessment } from '../utils/aptitudeScoring';
import { DEFAULT_LANDING_CONTENT } from '../data/landingContent';
import { getPublicHomepage, publishHomepage, submitWebsiteLead } from '../services/erpApi';
import { AppContext } from './appContextInstance';

const normalizeLandingContent = (content = {}) => ({
  ...DEFAULT_LANDING_CONTENT,
  ...content,
  services: DEFAULT_LANDING_CONTENT.services.map((fallback, index) => ({
    ...fallback,
    ...(content.services?.[index] || {}),
  })),
});

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('mothertheresa_erp_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse state:', e);
      }
    }
    return INITIAL_DEMO_STATE;
  });

  const [currentView, setCurrentView] = useState('landing');
  const [currentTestResult, setCurrentTestResult] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState(null);
  const [landingContent, setLandingContent] = useState(() => {
    const saved = localStorage.getItem('mothertheresa_landing_content');
    if (saved) {
      try {
        return normalizeLandingContent(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse landing content:', error);
      }
    }
    return normalizeLandingContent();
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('mothertheresa_erp_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem('mothertheresa_landing_content', JSON.stringify(landingContent));
  }, [landingContent]);

  useEffect(() => {
    let active = true;
    getPublicHomepage()
      .then((result) => {
        if (active && result?.content) setLandingContent(normalizeLandingContent(result.content));
      })
      .catch((error) => console.warn('Using local CMS content because the API is unavailable:', error.message));
    return () => { active = false; };
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Switch role / login handler
  const loginAsRole = (role) => {
    if (role === 'student') {
      setState(prev => ({
        ...prev,
        userRole: 'student',
        activeUser: prev.studentProfile
      }));
      setCurrentView('student_portal');
      showToast('Logged in as Demo Student: Aarav Sharma');
    } else if (role === 'counselor') {
      setState(prev => ({
        ...prev,
        userRole: 'counselor',
        activeUser: prev.counselorProfile
      }));
      setCurrentView('counselor_portal');
      showToast('Logged in as Senior Counselor: Dr. Sarah Jenkins');
    } else {
      setState(prev => ({
        ...prev,
        userRole: 'guest',
        activeUser: null
      }));
      setCurrentView('landing');
      showToast('Logged out to Guest Mode');
    }
  };

  const logout = () => {
    loginAsRole('guest');
  };

  const registerStudent = (profileData) => {
    const studentProfile = {
      id: `std_${Date.now()}`,
      name: profileData.name.trim(),
      email: profileData.email.trim().toLowerCase(),
      phone: profileData.phone.trim(),
      targetCountry: profileData.targetCountry,
      preferredMajor: 'To be identified through aptitude assessment',
      educationLevel: profileData.educationLevel || 'Not specified',
      avatar: null,
    };

    setState((prev) => ({
      ...prev,
      studentProfile,
      activeUser: studentProfile,
      userRole: 'student',
    }));
    showToast(`Welcome, ${studentProfile.name}. Your student profile is ready.`);
    return studentProfile;
  };

  // Aptitude Test Submission
  const submitAptitudeTest = (answers) => {
    if (!state.activeUser || state.userRole !== 'student') {
      showToast('Please create a student account before taking the assessment.');
      return false;
    }

    const assessment = scoreAptitudeAssessment(answers);
    const { cognitiveScores, overallScore } = assessment;

    // Calculate match percentages for each career profile
    const matchedCareers = CAREER_PROFILES.map(c => {
      const matchScore = c.matchFormula(cognitiveScores);
      return { ...c, matchScore };
    }).sort((a, b) => b.matchScore - a.matchScore);

    const topCareer = matchedCareers[0];

    // Find best matching global university
    const domainKeywords = {
      analytical: ['data', 'engineering', 'biomedical', 'economics'],
      technical: ['computer', 'artificial', 'robotics', 'technology'],
      creative: ['design', 'media', 'arts'],
      business: ['business', 'commerce', 'finance', 'economics'],
      social: ['humanities', 'social', 'education', 'psychology'],
    };
    const relevantKeywords = domainKeywords[topCareer.primaryDomain] || [];
    const topUni = GLOBAL_UNIVERSITIES.find((university) =>
      university.featuredPrograms.some((program) =>
        relevantKeywords.some((keyword) => program.toLowerCase().includes(keyword)),
      ),
    ) || GLOBAL_UNIVERSITIES[0];

    const newResult = {
      id: 'res_' + Date.now(),
      studentId: state.activeUser.id,
      studentName: state.activeUser.name,
      dateTaken: new Date().toISOString().split('T')[0],
      overallScore,
      cognitiveBreakdown: cognitiveScores,
      interestBreakdown: assessment.interestBreakdown,
      abilityBreakdown: assessment.abilityBreakdown,
      assessmentQuality: assessment.assessmentQuality,
      matchedCareers,
      topCareerMatch: topCareer.title,
      recommendedDegree: topCareer.recommendedDegrees[0],
      matchedUniversity: topUni.name,
      counselorReviewStatus: 'Pending Review',
      counselorNotes: 'Aptitude test completed recently. Awaiting initial counselor orientation call.'
    };

    setCurrentTestResult(newResult);
    setState(prev => ({
      ...prev,
      testResults: [newResult, ...prev.testResults]
    }));

    setCurrentView('results');
    showToast('All 50 responses were scored. Your career-fit blueprint is ready.');
    return true;
  };

  // Student Actions
  const addApplication = (appData) => {
    const newApp = {
      id: 'app_' + Date.now(),
      studentId: state.activeUser ? state.activeUser.id : 'std_101',
      studentName: state.activeUser ? state.activeUser.name : 'Aarav Sharma',
      status: 'Draft',
      applicationFee: '$150 (Pending)',
      submissionDate: new Date().toISOString().split('T')[0],
      documentsVerified: false,
      ...appData
    };

    setState(prev => ({
      ...prev,
      applications: [newApp, ...prev.applications]
    }));
    showToast(`Application created for ${appData.universityName}!`);
  };

  const updateApplicationStatus = (appId, newStatus) => {
    setState(prev => ({
      ...prev,
      applications: prev.applications.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      )
    }));
    showToast(`Application status updated to ${newStatus}`);
  };

  const uploadDocument = (docName, docType, size = '1.8 MB') => {
    const newDoc = {
      id: 'doc_' + Date.now(),
      name: docName,
      type: docType,
      size,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Under Review'
    };

    setState(prev => ({
      ...prev,
      documents: [newDoc, ...prev.documents]
    }));
    showToast(`Document "${docName}" uploaded to secure vault!`);
  };

  const bookAppointment = (appointmentData) => {
    const newApt = {
      id: 'apt_' + Date.now(),
      studentName: state.activeUser ? state.activeUser.name : appointmentData.studentName || 'Student',
      counselorName: 'Dr. Sarah Jenkins',
      status: 'Confirmed',
      ...appointmentData
    };

    setState(prev => ({
      ...prev,
      appointments: [newApt, ...prev.appointments]
    }));
    showToast(`Counseling Session scheduled for ${appointmentData.date} at ${appointmentData.time}!`);
  };

  const addLead = async (leadData) => {
    const newLead = {
      id: 'lead_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'New Inquiry',
      score: leadData.score || 80,
      ...leadData
    };

    try {
      const result = await submitWebsiteLead(leadData);
      if (result.duplicate) {
        showToast('We found your existing enquiry. A counselor can continue the same record without creating a duplicate.');
        return result;
      }
      setState(prev => ({ ...prev, leads: [newLead, ...prev.leads] }));
      showToast('Inquiry received and added to the CRM. An admissions counselor will reach out within 24 hours.');
      return result;
    } catch (error) {
      setState(prev => ({ ...prev, leads: [newLead, ...prev.leads] }));
      showToast('Inquiry saved on this device. The CRM connection should be checked before staff follow-up.');
      return { created: true, offline: true, error: error.message };
    }
  };

  const updateCounselorNote = (resultId, note) => {
    setState(prev => ({
      ...prev,
      testResults: prev.testResults.map(res => 
        res.id === resultId ? { ...res, counselorNotes: note, counselorReviewStatus: 'Reviewed' } : res
      )
    }));
    showToast('Counselor evaluation saved!');
  };

  const saveLandingContent = (content) => {
    setLandingContent(content);
    publishHomepage(content)
      .then(() => showToast('Landing page content published to the centralized CMS.'))
      .catch(() => showToast('Landing content saved locally. The CMS API connection needs attention.'));
  };

  const resetLandingContent = () => {
    const defaults = structuredClone(DEFAULT_LANDING_CONTENT);
    setLandingContent(defaults);
    publishHomepage(defaults)
      .then(() => showToast('Approved default content restored in the centralized CMS.'))
      .catch(() => showToast('Approved defaults restored locally.'));
  };

  return (
    <AppContext.Provider value={{
      ...state,
      currentView,
      setCurrentView,
      currentTestResult,
      setCurrentTestResult,
      activeTab,
      setActiveTab,
      toastMessage,
      loginAsRole,
      registerStudent,
      logout,
      submitAptitudeTest,
      addApplication,
      updateApplicationStatus,
      uploadDocument,
      bookAppointment,
      addLead,
      updateCounselorNote,
      showToast,
      landingContent,
      saveLandingContent,
      resetLandingContent
    }}>
      {children}
    </AppContext.Provider>
  );
};
