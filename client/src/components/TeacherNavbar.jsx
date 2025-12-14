import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { pollAPI } from '../services/apiService';

const TeacherNavbar = ({ onViewChange, currentView }) => {
  const { activePoll, students } = useSelector((state) => state.poll);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (activePoll && activePoll.id) {
        setLoading(true);
        try {
          const response = await pollAPI.getPollAnalytics(activePoll.id);
          if (response.success) {
            setAnalytics(response.analytics);
          }
        } catch (error) {
          console.error('Error fetching analytics:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setAnalytics(null);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval);
  }, [activePoll]);

  const totalStudents = students.length;
  const answeredCount = analytics?.totalAnswers || 0;
  const correctCount = analytics?.correctAnswers || 0;
  const wrongCount = analytics?.wrongAnswers || 0;
  const passedCount = analytics?.passed || 0;
  const failedCount = analytics?.failed || 0;

  return (
    <nav className="bg-gradient-to-r from-primary to-primary-dark shadow-lg sticky top-0 z-50 border-b-4 border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center gap-6 flex-wrap">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">📊 Live Polling</h1>
        </div>

        <div className="flex gap-6 items-center flex-wrap">
          <div className="flex flex-col items-center gap-1 px-4 py-2 bg-white/15 rounded-xl backdrop-blur-sm min-w-[80px] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20">
            <span className="text-xs font-medium text-white/90 uppercase tracking-wide">Students</span>
            <span className="text-2xl font-bold text-white font-mono">{totalStudents}</span>
          </div>

          {activePoll && activePoll.status === 'active' && (
            <div className="flex flex-col items-center gap-1 px-4 py-2 bg-white/15 rounded-xl backdrop-blur-sm min-w-[80px] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20">
              <span className="text-xs font-medium text-white/90 uppercase tracking-wide">Answered</span>
              <span className="text-xl font-bold text-white font-mono">{answeredCount}/{totalStudents}</span>
            </div>
          )}

          {activePoll && activePoll.status === 'completed' && analytics && (
            <>
              <div className="flex flex-col items-center gap-1 px-4 py-2 bg-green-500/30 rounded-xl backdrop-blur-sm border-2 border-green-500/50 min-w-[80px] transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-500/40">
                <span className="text-xs font-medium text-white/90 uppercase tracking-wide">✓ Correct</span>
                <span className="text-xl font-bold text-white font-mono">{correctCount}</span>
              </div>
              <div className="flex flex-col items-center gap-1 px-4 py-2 bg-red-500/30 rounded-xl backdrop-blur-sm border-2 border-red-500/50 min-w-[80px] transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500/40">
                <span className="text-xs font-medium text-white/90 uppercase tracking-wide">✗ Wrong</span>
                <span className="text-xl font-bold text-white font-mono">{wrongCount}</span>
              </div>
              <div className="flex flex-col items-center gap-1 px-4 py-2 bg-green-500/25 rounded-xl backdrop-blur-sm border-2 border-green-500/40 min-w-[80px] transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-500/35">
                <span className="text-xs font-medium text-white/90 uppercase tracking-wide">Passed</span>
                <span className="text-xl font-bold text-white font-mono">{passedCount}</span>
              </div>
              <div className="flex flex-col items-center gap-1 px-4 py-2 bg-red-500/25 rounded-xl backdrop-blur-sm border-2 border-red-500/40 min-w-[80px] transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500/35">
                <span className="text-xs font-medium text-white/90 uppercase tracking-wide">Failed</span>
                <span className="text-xl font-bold text-white font-mono">{failedCount}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 bg-white/10 p-1 rounded-xl backdrop-blur-sm">
          <button
            className={`px-6 py-2 bg-transparent border-none text-white/80 text-sm font-semibold rounded-lg cursor-pointer transition-all duration-200 uppercase tracking-wide ${
              currentView === 'dashboard' 
                ? 'text-primary shadow-md' 
                : 'hover:bg-black hover:text-white'
            }`}
            onClick={() => onViewChange('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`px-6 py-2 bg-transparent border-none text-white/80 text-sm font-semibold rounded-lg cursor-pointer transition-all duration-200 uppercase tracking-wide ${
              currentView === 'analytics' 
                ? ' text-primary shadow-md' 
                : 'hover:bg-black hover:text-white'
            }`}
            onClick={() => onViewChange('analytics')}
          >
            Analytics
          </button>
          <button
            className={`px-6 py-2 bg-transparent border-none text-white/80 text-sm font-semibold rounded-lg cursor-pointer transition-all duration-200 uppercase tracking-wide ${
              currentView === 'answers' 
                ? ' text-primary shadow-md' 
                : 'hover:bg-black hover:text-white'
            }`}
            onClick={() => onViewChange('answers')}
          >
            Student Answers
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TeacherNavbar;


