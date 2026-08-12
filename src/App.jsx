import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/useApp';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingView } from './views/LandingView';
import { AptitudeTestView } from './views/AptitudeTestView';
import { CareerResultsView } from './views/CareerResultsView';
import { StudentPortalView } from './views/StudentPortalView';
import { CounselorPortalView } from './views/CounselorPortalView';
import { AuthModal } from './views/AuthModal';
import { AboutView } from './views/AboutView';
import { BoardView } from './views/BoardView';
import { ContactView } from './views/ContactView';
import { CollegeSelectionView } from './views/CollegeSelectionView';
import { CollegeDetailView } from './views/CollegeDetailView';
import { CmsView } from './views/CmsView';
import { CheckCircle2 } from 'lucide-react';

const AppContent = () => {
  const { currentView, setCurrentView, toastMessage, activeUser, userRole, showToast } = useApp();
  const [authRequest, setAuthRequest] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [shortlistedIds, setShortlistedIds] = useState([]);

  const publicViews = ['landing', 'about', 'board', 'contact', 'colleges', 'college_detail', 'cms'];
  const footerViews = ['landing', 'about', 'board', 'contact', 'colleges', 'college_detail'];

  const navigateTo = (view) => {
    setCurrentView(view);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 20);
  };

  const viewCollege = (university) => {
    setSelectedCollege(university);
    navigateTo('college_detail');
  };

  const toggleShortlist = (universityId) => {
    const isSaved = shortlistedIds.includes(universityId);
    setShortlistedIds(isSaved
      ? shortlistedIds.filter((id) => id !== universityId)
      : [...shortlistedIds, universityId]);
    showToast(isSaved ? 'College removed from your shortlist.' : 'College added to your shortlist.');
  };

  const openStudentPortalAuth = () => {
    setAuthRequest({ mode: 'login', purpose: 'portal', nextView: 'student_portal' });
  };

  const startAptitudeTest = () => {
    if (activeUser && userRole === 'student') {
      setCurrentView('test');
      return;
    }
    setAuthRequest({ mode: 'register', purpose: 'assessment', nextView: 'test' });
  };

  return (
    <div className={`min-h-screen flex flex-col selection:bg-sky-200 selection:text-[#062d55] ${publicViews.includes(currentView) ? 'bg-white text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[70] flex max-w-sm items-center gap-3 rounded-2xl border border-sky-400/40 bg-[#062d55]/95 px-5 py-3.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl sm:bottom-6 sm:right-6">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      {currentView !== 'counselor_portal' && <Navbar onOpenAuth={openStudentPortalAuth} onStartTest={startAptitudeTest} onNavigate={navigateTo} />}

      {/* Dynamic View Routing */}
      <main className="grow">
        {currentView === 'landing' && <LandingView onStartTest={startAptitudeTest} onNavigate={navigateTo} />}
        {currentView === 'about' && <AboutView onNavigate={navigateTo} onStartTest={startAptitudeTest} />}
        {currentView === 'board' && <BoardView onNavigate={navigateTo} />}
        {currentView === 'contact' && <ContactView onNavigate={navigateTo} />}
        {currentView === 'colleges' && (
          <CollegeSelectionView
            onViewCollege={viewCollege}
            onStartTest={startAptitudeTest}
            shortlistedIds={shortlistedIds}
            onToggleShortlist={toggleShortlist}
          />
        )}
        {currentView === 'college_detail' && (
          <CollegeDetailView
            university={selectedCollege}
            onBack={() => navigateTo('colleges')}
            onStartTest={startAptitudeTest}
            onOpenAuth={openStudentPortalAuth}
            isShortlisted={selectedCollege ? shortlistedIds.includes(selectedCollege.id) : false}
            onToggleShortlist={toggleShortlist}
          />
        )}
        {currentView === 'cms' && <CmsView onNavigate={navigateTo} />}
        {currentView === 'test' && <AptitudeTestView onRequireSignup={startAptitudeTest} />}
        {currentView === 'results' && <CareerResultsView />}
        {currentView === 'student_portal' && <StudentPortalView />}
        {currentView === 'counselor_portal' && <CounselorPortalView onNavigate={navigateTo} />}
      </main>

      {/* Footer */}
      {footerViews.includes(currentView) && <Footer onStartTest={startAptitudeTest} onNavigate={navigateTo} />}

      {/* Auth Modal */}
      {authRequest && (
        <AuthModal
          initialMode={authRequest.mode}
          purpose={authRequest.purpose}
          onClose={() => setAuthRequest(null)}
          onAuthenticated={() => setCurrentView(authRequest.nextView)}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
