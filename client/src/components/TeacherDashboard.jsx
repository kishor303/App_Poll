import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import socketService from '../services/socketService';
import { setUserRole, setCanStartPoll, setActivePoll } from '../store/pollSlice';
import TeacherNavbar from './TeacherNavbar';
import PollForm from './PollForm';
import LiveResults from './LiveResults';
import PollTimer from './PollTimer';
import StudentList from './StudentList';
import ChatPopup from './ChatPopup';
import PastPolls from './PastPolls';
import AnalyticsDashboard from './AnalyticsDashboard';
import StudentAnswersView from './StudentAnswersView';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activePoll, students, canStartPoll } = useSelector((state) => state.poll);
  const [showPastPolls, setShowPastPolls] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Set user role
    dispatch(setUserRole('teacher'));

    // Connect socket
    socketService.connect();
    socketService.joinRoom('Teacher', 'teacher');

    // Cleanup on unmount
    return () => {
      // Don't disconnect socket here as it might be used elsewhere
    };
  }, [dispatch]);

  useEffect(() => {
    // Check if poll can be started
    if (activePoll && activePoll.status === 'created') {
      // Can start if no active poll or all students answered
      const hasActivePoll = activePoll && activePoll.status === 'active';
      const allAnswered = students.length > 0 && 
        Object.values(activePoll.results || {}).reduce((a, b) => a + b, 0) >= students.length;
      
      dispatch(setCanStartPoll(!hasActivePoll || allAnswered));
    }
  }, [activePoll, students, dispatch]);

  const handleEndPoll = () => {
    if (activePoll && activePoll.status === 'active') {
      socketService.endPoll();
    }
  };

  const renderCurrentView = () => {
    if (showPastPolls) {
      return <PastPolls onClose={() => setShowPastPolls(false)} />;
    }

    switch (currentView) {
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'answers':
        return <StudentAnswersView />;
      case 'dashboard':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 items-start">
            {/* Left Column - Poll Form */}
            <div className="flex flex-col gap-6">
              <PollForm />
              {activePoll && activePoll.status === 'active' && (
                <div className="mt-2">
                  <button
                    className="btn btn-danger w-full py-3 text-lg font-semibold"
                    onClick={handleEndPoll}
                  >
                    End Poll
                  </button>
                </div>
              )}
            </div>

            {/* Center Column - Live Results */}
            <div className="flex flex-col gap-6">
              <LiveResults />
            </div>

            {/* Right Column - Timer & Students */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              <PollTimer />
              <StudentList />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TeacherNavbar onViewChange={setCurrentView} currentView={currentView} />
      
      <header className="bg-white shadow-sm px-4 md:px-8 py-4 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex justify-end items-center gap-4 flex-wrap">
          <button
            className="btn btn-outline"
            onClick={() => setShowPastPolls(!showPastPolls)}
          >
            {showPastPolls ? 'Hide' : 'Show'} Past Polls
          </button>
          <ChatPopup />
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default TeacherDashboard;

