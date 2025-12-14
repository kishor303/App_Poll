import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { pollAPI } from '../services/apiService';

const StudentAnswersView = () => {
  const { activePoll } = useSelector((state) => state.poll);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, correct, wrong, passed, failed

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
        setLoading(false);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 2000);
    return () => clearInterval(interval);
  }, [activePoll]);

  if (loading) {
    return (
      <div className="card">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!activePoll) {
    return (
      <div className="card">
        <p className="text-slate-500 text-center">No active poll to view answers</p>
      </div>
    );
  }

  if (!analytics || !analytics.studentAnswers || analytics.studentAnswers.length === 0) {
    return (
      <div className="card">
        <h2 className="text-5xl font-bold text-slate-900 mb-6">Student Answers</h2>
        <p className="text-slate-500 text-center">No answers yet</p>
      </div>
    );
  }

  const filteredAnswers = analytics.studentAnswers.filter(answer => {
    switch (filter) {
      case 'correct':
        return answer.isCorrect;
      case 'wrong':
        return !answer.isCorrect;
      case 'passed':
        return answer.passed;
      case 'failed':
        return !answer.passed;
      default:
        return true;
    }
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="card p-8 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-lg">
        <h2 className="text-5xl font-bold mb-6 text-white">Student Answers</h2>
        <div className="text-lg mb-4 leading-relaxed">
          <strong>Question:</strong> {activePoll.question}
        </div>
        {activePoll.correctAnswer !== undefined && (
          <div className="text-base p-2 px-4 bg-green-500/20 rounded-xl border-l-4 border-green-500">
            <strong>Correct Answer:</strong> {activePoll.options[activePoll.correctAnswer]}
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-100 flex gap-2 flex-wrap justify-center">
        <button
          className={`px-6 py-2 bg-white border-2 rounded-xl font-semibold cursor-pointer transition-all duration-200 text-sm ${
            filter === 'all' 
              ? 'bg-primary border-primary text-white' 
              : 'border-slate-300 text-slate-900 hover:border-primary hover:-translate-y-0.5 hover:shadow-sm'
          }`}
          onClick={() => setFilter('all')}
        >
          All ({analytics.studentAnswers.length})
        </button>
        <button
          className={`px-6 py-2 bg-white border-2 rounded-xl font-semibold cursor-pointer transition-all duration-200 text-sm ${
            filter === 'correct' 
              ? 'bg-primary border-primary text-white' 
              : 'border-slate-300 text-slate-900 hover:border-primary hover:-translate-y-0.5 hover:shadow-sm'
          }`}
          onClick={() => setFilter('correct')}
        >
          Correct ({analytics.correctAnswers})
        </button>
        <button
          className={`px-6 py-2 bg-white border-2 rounded-xl font-semibold cursor-pointer transition-all duration-200 text-sm ${
            filter === 'wrong' 
              ? 'bg-primary border-primary text-white' 
              : 'border-slate-300 text-slate-900 hover:border-primary hover:-translate-y-0.5 hover:shadow-sm'
          }`}
          onClick={() => setFilter('wrong')}
        >
          Wrong ({analytics.wrongAnswers})
        </button>
        <button
          className={`px-6 py-2 bg-white border-2 rounded-xl font-semibold cursor-pointer transition-all duration-200 text-sm ${
            filter === 'passed' 
              ? 'bg-primary border-primary text-white' 
              : 'border-slate-300 text-slate-900 hover:border-primary hover:-translate-y-0.5 hover:shadow-sm'
          }`}
          onClick={() => setFilter('passed')}
        >
          Passed ({analytics.passed})
        </button>
        <button
          className={`px-6 py-2 bg-white border-2 rounded-xl font-semibold cursor-pointer transition-all duration-200 text-sm ${
            filter === 'failed' 
              ? 'bg-primary border-primary text-white' 
              : 'border-slate-300 text-slate-900 hover:border-primary hover:-translate-y-0.5 hover:shadow-sm'
          }`}
          onClick={() => setFilter('failed')}
        >
          Failed ({analytics.failed})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnswers.map((answer, index) => (
          <div
            key={answer.studentId}
            className={`card p-6 border-l-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg animate-fade-in ${
              answer.isCorrect
                ? 'border-secondary bg-gradient-to-br from-green-50 to-white'
                : 'border-danger bg-gradient-to-br from-red-50 to-white'
            }`}
          >
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                {index + 1}
              </div>
              <div className="text-xl font-semibold text-slate-900 flex-1 min-w-[150px]">{answer.studentName}</div>
              <div className="flex gap-2 flex-wrap">
                {answer.isCorrect ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-secondary text-white">
                    ✓ Correct
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-danger text-white">
                    ✗ Wrong
                  </span>
                )}
                {answer.passed ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-green-500/20 text-secondary border border-secondary">
                    Passed
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-red-500/20 text-danger border border-danger">
                    Failed
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-200">
              <div className="text-base text-slate-900">
                <strong>Answer:</strong> {answer.optionText}
              </div>
              <div className="text-lg font-semibold text-primary">
                <strong>Score:</strong> {answer.score}%
              </div>
              <div className="text-xs text-slate-500">
                Submitted at: {new Date(answer.submittedAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAnswers.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-slate-500">No answers match the selected filter</p>
        </div>
      )}
    </div>
  );
};

export default StudentAnswersView;


