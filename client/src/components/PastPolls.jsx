import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { pollAPI } from '../services/apiService';
import { setPastPolls } from '../store/pollSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PastPolls = ({ onClose }) => {
  const dispatch = useDispatch();
  const { pastPolls } = useSelector((state) => state.poll);

  useEffect(() => {
    const fetchPastPolls = async () => {
      try {
        const response = await pollAPI.getPastPolls();
        if (response.success) {
          dispatch(setPastPolls(response.polls));
        }
      } catch (error) {
        console.error('Error fetching past polls:', error);
      }
    };

    fetchPastPolls();
  }, [dispatch]);

  const colors = [
    '#2563EB', // Blue
    '#22C55E', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899'  // Pink
  ];

  if (pastPolls.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-5xl font-bold text-slate-900 m-0">Past Polls</h2>
          {onClose && (
            <button className="btn btn-outline" onClick={onClose}>
              Close
            </button>
          )}
        </div>
        <div className="card text-center py-12">
          <p className="text-slate-500">No past polls available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-5xl font-bold text-slate-900 m-0">Past Polls</h2>
        {onClose && (
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        )}
      </div>

      <div className="flex flex-col gap-8">
        {pastPolls.map((poll) => {
          const chartData = poll.options.map((option, index) => ({
            option: option,
            votes: poll.results?.[index] || 0,
            index: index
          }));

          const totalVotes = Object.values(poll.results || {}).reduce((sum, count) => sum + count, 0);

          return (
            <div key={poll.id} className="card flex flex-col gap-6 animate-fade-in">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <h3 className="text-xl font-semibold text-slate-900 flex-1 m-0">{poll.question}</h3>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm text-slate-500">
                    {new Date(poll.completedAt || poll.createdAt).toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {totalVotes} votes
                  </span>
                </div>
              </div>

              {totalVotes > 0 ? (
                <>
                  <div className="w-full">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="option" 
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip 
                          formatter={(value) => [`${value} votes`, 'Votes']}
                          contentStyle={{ borderRadius: '12px' }}
                        />
                        <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex flex-col gap-4">
                    {chartData.map((item, index) => {
                      const percentage = totalVotes > 0 
                        ? ((item.votes / totalVotes) * 100).toFixed(1) 
                        : 0;
                      return (
                        <div key={index} className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-3 h-3 rounded-sm flex-shrink-0"
                              style={{ backgroundColor: colors[index % colors.length] }}
                            />
                            <span className="font-medium text-slate-900 flex-1">{item.option}</span>
                          </div>
                          <div className="flex justify-between text-sm text-slate-600 ml-5">
                            <span>{item.votes} votes</span>
                            <span>{percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>No votes received</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PastPolls;

