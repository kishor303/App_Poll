import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { pollAPI } from '../services/apiService';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsDashboard = () => {
  const { activePoll } = useSelector((state) => state.poll);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <p className="text-slate-500 text-center">No active poll to analyze</p>
      </div>
    );
  }

  if (!analytics || analytics.totalAnswers === 0) {
    return (
      <div className="card">
        <h2 className="text-5xl font-bold text-slate-900 mb-6">Poll Analytics</h2>
        <p className="text-slate-500 text-center">Waiting for student answers...</p>
      </div>
    );
  }

  const pieData = [
    { name: 'Correct', value: analytics.correctAnswers, color: '#22C55E' },
    { name: 'Wrong', value: analytics.wrongAnswers, color: '#EF4444' }
  ];

  const passFailData = [
    { name: 'Passed', value: analytics.passed, color: '#22C55E' },
    { name: 'Failed', value: analytics.failed, color: '#EF4444' }
  ];

  const accuracyRate = analytics.totalAnswers > 0
    ? ((analytics.correctAnswers / analytics.totalAnswers) * 100).toFixed(1)
    : 0;

  const passRate = analytics.totalAnswers > 0
    ? ((analytics.passed / analytics.totalAnswers) * 100).toFixed(1)
    : 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="card p-8 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-lg">
        <h2 className="text-5xl font-bold mb-6 text-white">Poll Analytics</h2>
        <div className="text-lg mb-4 leading-relaxed">
          <strong>Question:</strong> {activePoll.question}
        </div>
        {activePoll.correctAnswer !== undefined && (
          <div className="text-base p-2 px-4 bg-green-500/20 rounded-xl border-l-4 border-green-500 mb-2">
            <strong>Correct Answer:</strong> {activePoll.options[activePoll.correctAnswer]}
          </div>
        )}
        {activePoll.baseMark !== undefined && (
          <div className="text-base p-2 px-4 bg-amber-500/20 rounded-xl border-l-4 border-amber-500">
            <strong>Base Mark:</strong> {activePoll.baseMark}%
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Summary Cards */}
        <div className="card p-6 flex items-center gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border-l-4 border-primary bg-gradient-to-br from-blue-50 to-white">
          <div className="text-5xl leading-none">📊</div>
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Total Answers</h3>
            <p className="text-5xl font-bold text-slate-900 m-0 font-mono">{analytics.totalAnswers}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border-l-4 border-secondary bg-gradient-to-br from-green-50 to-white">
          <div className="text-5xl leading-none">✓</div>
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Correct</h3>
            <p className="text-5xl font-bold text-slate-900 m-0 font-mono">{analytics.correctAnswers}</p>
            <p className="text-sm font-semibold text-slate-600 mt-1">{accuracyRate}%</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border-l-4 border-danger bg-gradient-to-br from-red-50 to-white">
          <div className="text-5xl leading-none">✗</div>
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Wrong</h3>
            <p className="text-5xl font-bold text-slate-900 m-0 font-mono">{analytics.wrongAnswers}</p>
            <p className="text-sm font-semibold text-slate-600 mt-1">
              {analytics.totalAnswers > 0 ? ((analytics.wrongAnswers / analytics.totalAnswers) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border-l-4 border-secondary bg-gradient-to-br from-green-100 to-white">
          <div className="text-5xl leading-none">🎯</div>
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Passed</h3>
            <p className="text-5xl font-bold text-slate-900 m-0 font-mono">{analytics.passed}</p>
            <p className="text-sm font-semibold text-slate-600 mt-1">{passRate}%</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border-l-4 border-danger bg-gradient-to-br from-red-100 to-white">
          <div className="text-5xl leading-none">⚠️</div>
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Failed</h3>
            <p className="text-5xl font-bold text-slate-900 m-0 font-mono">{analytics.failed}</p>
            <p className="text-sm font-semibold text-slate-600 mt-1">
              {analytics.totalAnswers > 0 ? ((analytics.failed / analytics.totalAnswers) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="card p-8 col-span-1 md:col-span-2">
          <h3 className="text-xl font-semibold text-slate-900 mb-6 text-center">Correct vs Wrong</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-8 col-span-1 md:col-span-2">
          <h3 className="text-xl font-semibold text-slate-900 mb-6 text-center">Pass vs Fail</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={passFailData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {passFailData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;


