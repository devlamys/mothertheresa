import React, { useState } from 'react';
import { useApp } from '../context/useApp';
import { Brain, Calendar, FileText, GraduationCap, Plus, Upload } from 'lucide-react';
import { GLOBAL_UNIVERSITIES } from '../data/universityData';

export const StudentPortalView = () => {
  const { 
    activeUser, applications, documents, appointments, testResults, 
    addApplication, uploadDocument, bookAppointment, setCurrentView
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modals
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);

  // New App form state
  const [newApp, setNewApp] = useState({
    universityId: GLOBAL_UNIVERSITIES[0].id,
    program: 'B.Sc. in Computer Science & AI',
    intake: 'Fall 2027'
  });

  // Upload doc form state
  const [docForm, setDocForm] = useState({
    name: '',
    type: 'Transcript'
  });

  // Booking form state
  const [bookForm, setBookForm] = useState({
    date: '2026-08-20',
    time: '14:00 GST',
    mode: 'Zoom Video Call',
    topic: 'University Shortlist & SOP Review'
  });

  const handleCreateApp = (e) => {
    e.preventDefault();
    const uni = GLOBAL_UNIVERSITIES.find(u => u.id === newApp.universityId);
    addApplication({
      universityId: uni.id,
      universityName: uni.name,
      country: uni.country,
      program: newApp.program,
      intake: newApp.intake
    });
    setShowAddAppModal(false);
  };

  const handleUploadDoc = (e) => {
    e.preventDefault();
    if (!docForm.name) return;
    uploadDocument(docForm.name, docForm.type);
    setDocForm({ name: '', type: 'Transcript' });
    setShowUploadModal(false);
  };

  const handleBookSession = (e) => {
    e.preventDefault();
    bookAppointment(bookForm);
    setShowBookModal(false);
  };

  const latestTest = testResults[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Student Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 gradient-bg/10">
        <div className="flex items-center space-x-4">
          <img 
            src={activeUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
            alt="Student Avatar" 
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500 shadow-xl"
          />
          <div>
            <div className="inline-flex items-center space-x-2 text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20 mb-1">
              <span>Student ID: {activeUser?.id || 'STD-101'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {activeUser?.name || 'Aarav Sharma'}!
            </h1>
            <p className="text-xs text-slate-400">
              Target Destination: <span className="text-slate-200 font-semibold">{activeUser?.targetCountry || 'Canada'} 🇨🇦</span> • {activeUser?.preferredMajor || 'Computer Science'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowBookModal(true)}
            className="gradient-bg text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:opacity-95 text-xs flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Counselor Call</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'dashboard', label: 'Overview', icon: GraduationCap },
          { id: 'applications', label: `Applications (${applications.length})`, icon: FileText },
          { id: 'documents', label: `Document Vault (${documents.length})`, icon: Upload },
          { id: 'aptitude', label: 'Aptitude History', icon: Brain },
          { id: 'appointments', label: `Counseling (${appointments.length})`, icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive ? 'gradient-bg text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-slate-400 text-xs font-medium">Applications Filed</div>
              <div className="text-3xl font-extrabold text-white">{applications.length}</div>
              <div className="text-[10px] text-indigo-400 font-semibold">
                {applications.filter(a => a.status === 'Under Review').length} Under Review
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-slate-400 text-xs font-medium">Aptitude Score</div>
              <div className="text-3xl font-extrabold text-amber-400">
                {latestTest ? `${latestTest.overallScore}/100` : 'N/A'}
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold">
                Match: {latestTest ? latestTest.topCareerMatch : 'Take Test'}
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-slate-400 text-xs font-medium">Verified Documents</div>
              <div className="text-3xl font-extrabold text-white">{documents.length} Files</div>
              <div className="text-[10px] text-emerald-400 font-semibold">100% Vault Encrypted</div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-slate-400 text-xs font-medium">Counselor Sessions</div>
              <div className="text-3xl font-extrabold text-sky-400">{appointments.length} Booked</div>
              <div className="text-[10px] text-slate-400">Next: Dr. Sarah Jenkins</div>
            </div>

          </div>

          {/* Applications Quick Overview & Aptitude Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Active University Applications</h3>
                <button 
                  onClick={() => setShowAddAppModal(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Application</span>
                </button>
              </div>

              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-base font-bold text-white">{app.universityName}</h4>
                        <div className="text-xs text-slate-400">{app.program} • Intake: {app.intake}</div>
                      </div>
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                        {app.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Draft</span>
                        <span>Submitted</span>
                        <span>Under Review</span>
                        <span>Offer Letter</span>
                        <span>Visa</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="gradient-bg h-full transition-all duration-300 rounded-full"
                          style={{
                            width: app.status === 'Draft' ? '20%' :
                                   app.status === 'Submitted' ? '40%' :
                                   app.status === 'Under Review' ? '65%' :
                                   app.status === 'Offer Letter Issued' ? '85%' : '100%'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Widget: Counselor Call & Test Summary */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="glass-card p-6 rounded-2xl border border-indigo-500/30 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Aptitude Profile</h4>
                    <div className="text-xs text-indigo-400">Latest score: {latestTest?.overallScore}/100</div>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Recommended Path: <span className="font-semibold text-white">{latestTest?.topCareerMatch}</span>
                </p>
                <button 
                  onClick={() => setCurrentView('results')}
                  className="w-full py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors"
                >
                  View Full Career Blueprint
                </button>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Upcoming Counseling</span>
                </h4>
                {appointments.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    <div className="font-semibold text-white">{appointments[0].topic}</div>
                    <div className="text-slate-400">Date: {appointments[0].date} at {appointments[0].time}</div>
                    <div className="text-emerald-400 font-semibold">{appointments[0].mode}</div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No upcoming sessions booked.</p>
                )}
                <button 
                  onClick={() => setShowBookModal(true)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
                >
                  Schedule 1-on-1 Session
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB 2: APPLICATIONS TRACKER */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">University Application Tracker</h2>
              <p className="text-xs text-slate-400">Manage admissions, offer letters, and fee receipts.</p>
            </div>
            <button 
              onClick={() => setShowAddAppModal(true)}
              className="gradient-bg text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Application</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {applications.map((app) => (
              <div key={app.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{app.universityName}</h3>
                    <div className="text-xs text-slate-400">{app.country} • {app.program} • {app.intake}</div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-slate-400">Fee: {app.applicationFee}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      {app.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DOCUMENT VAULT */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Secure Student Document Vault</h2>
              <p className="text-xs text-slate-400">Store official transcripts, SOP, Passport copies, and scorecards.</p>
            </div>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="gradient-bg text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {doc.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white truncate">{doc.name}</h4>
                  <div className="text-[11px] text-slate-400">{doc.type} • {doc.size}</div>
                </div>
                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                  Uploaded on {doc.uploadDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: APTITUDE HISTORY */}
      {activeTab === 'aptitude' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Aptitude & Psychometric History</h2>
              <p className="text-xs text-slate-400">Review previous cognitive assessment scores and counselor remarks.</p>
            </div>
            <button 
              onClick={() => setCurrentView('test')}
              className="gradient-bg text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-1.5"
            >
              <Brain className="w-4 h-4" />
              <span>Retake Test</span>
            </button>
          </div>

          <div className="space-y-4">
            {testResults.map((res) => (
              <div key={res.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Test Completed on {res.dateTaken}</h3>
                    <div className="text-xs text-indigo-400">Top Match: {res.topCareerMatch}</div>
                  </div>
                  <div className="text-2xl font-extrabold text-amber-400">{res.overallScore}/100</div>
                </div>
                
                <p className="text-xs text-slate-300 italic bg-slate-900/60 p-3 rounded-xl">
                  Counselor Remark: "{res.counselorNotes}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: COUNSELING APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">1-on-1 Counseling Sessions</h2>
              <p className="text-xs text-slate-400">Scheduled video calls with Senior Admissions Counselor Dr. Sarah Jenkins.</p>
            </div>
            <button 
              onClick={() => setShowBookModal(true)}
              className="gradient-bg text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Session</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map((apt) => (
              <div key={apt.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {apt.status}
                  </span>
                  <span className="text-xs text-slate-400">{apt.mode}</span>
                </div>
                <h4 className="text-base font-bold text-white">{apt.topic}</h4>
                <div className="text-xs text-slate-400">
                  Date: <span className="text-white font-semibold">{apt.date}</span> at <span className="text-white font-semibold">{apt.time}</span>
                </div>
                <div className="text-xs text-indigo-400 pt-2 border-t border-slate-800">
                  Counselor: {apt.counselorName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD APPLICATION */}
      {showAddAppModal && (
        <div className="fixed inset-0 z-50 glass-panel flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card p-8 rounded-3xl border border-slate-700 max-w-md w-full space-y-6">
            <h3 className="text-xl font-bold text-white">Create University Application</h3>
            
            <form onSubmit={handleCreateApp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target University</label>
                <select 
                  value={newApp.universityId}
                  onChange={(e) => setNewApp({...newApp, universityId: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs"
                >
                  {GLOBAL_UNIVERSITIES.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.country})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Program</label>
                <input 
                  type="text" 
                  value={newApp.program}
                  onChange={(e) => setNewApp({...newApp, program: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Intake Semester</label>
                <select 
                  value={newApp.intake}
                  onChange={(e) => setNewApp({...newApp, intake: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs"
                >
                  <option value="Fall 2027">Fall 2027</option>
                  <option value="Spring 2027">Spring 2027</option>
                  <option value="Fall 2028">Fall 2028</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowAddAppModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="gradient-bg text-white font-bold text-xs px-5 py-2.5 rounded-xl"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: UPLOAD DOCUMENT */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 glass-panel flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card p-8 rounded-3xl border border-slate-700 max-w-md w-full space-y-6">
            <h3 className="text-xl font-bold text-white">Upload Document to Vault</h3>
            
            <form onSubmit={handleUploadDoc} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Passport_Copy_Aarav.pdf"
                  value={docForm.name}
                  onChange={(e) => setDocForm({...docForm, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Document Category</label>
                <select 
                  value={docForm.type}
                  onChange={(e) => setDocForm({...docForm, type: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs"
                >
                  <option value="Transcript">Academic Transcript</option>
                  <option value="Language Exam">IELTS / TOEFL Scorecard</option>
                  <option value="SOP">Statement of Purpose (SOP)</option>
                  <option value="LOR">Letter of Recommendation (LOR)</option>
                  <option value="Passport">Passport / ID Document</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="gradient-bg text-white font-bold text-xs px-5 py-2.5 rounded-xl"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: BOOK APPOINTMENT */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 glass-panel flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card p-8 rounded-3xl border border-slate-700 max-w-md w-full space-y-6">
            <h3 className="text-xl font-bold text-white">Book 1-on-1 Counselor Call</h3>
            
            <form onSubmit={handleBookSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Session Topic</label>
                <input 
                  type="text" 
                  value={bookForm.topic}
                  onChange={(e) => setBookForm({...bookForm, topic: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Date</label>
                  <input 
                    type="date" 
                    value={bookForm.date}
                    onChange={(e) => setBookForm({...bookForm, date: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time Slot</label>
                  <select 
                    value={bookForm.time}
                    onChange={(e) => setBookForm({...bookForm, time: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                  >
                    <option value="10:00 GST">10:00 GST</option>
                    <option value="14:00 GST">14:00 GST</option>
                    <option value="16:30 GST">16:30 GST</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Mode</label>
                <select 
                  value={bookForm.mode}
                  onChange={(e) => setBookForm({...bookForm, mode: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs"
                >
                  <option value="Zoom Video Call">Zoom Video Call</option>
                  <option value="Dubai Office Meeting">Dubai Office Meeting (In-Person)</option>
                  <option value="Phone Consultation">Phone Consultation</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="gradient-bg text-white font-bold text-xs px-5 py-2.5 rounded-xl"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
