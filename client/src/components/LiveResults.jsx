import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const LiveResults = () => {
  const { activePoll } = useSelector((state) => state.poll);

  if (!activePoll || !activePoll.options) {
    return (
      <div className="card flex flex-col gap-6 animate-fade-in">
        <h2 className="text-3xl font-semibold text-slate-900">Live Results</h2>
        <p className="text-center py-8 text-slate-500">No poll active</p>
      </div>
    );
  }

  // Prepare data for chart
  const chartData = activePoll.options.map((option, index) => ({
    option: option,
    votes: activePoll.results?.[index] || 0,
    index: index
  }));

  const totalVotes = Object.values(activePoll.results || {}).reduce((sum, count) => sum + count, 0);

  const colors = [
    '#2563EB', // Blue
    '#22C55E', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899'  // Pink
  ];

  return (
    <div className="card flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-semibold text-slate-900">Live Results</h2>
        <div className="flex gap-6">
          <span className="text-sm text-slate-600">
            Total Votes: <strong className="text-primary text-lg">{totalVotes}</strong>
          </span>
        </div>
      </div>

      {activePoll.status === 'active' && (
        <div className="p-4 bg-slate-100 rounded-xl border-l-4 border-primary">
          <p className="text-lg font-medium text-slate-900">{activePoll.question}</p>
        </div>
      )}

      {totalVotes === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>Waiting for votes...</p>
        </div>
      ) : (
        <div className="w-full my-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="option" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
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
      )}

      <div className="flex flex-col gap-4">
        {chartData.map((item, index) => {
          const percentage = totalVotes > 0 ? ((item.votes / totalVotes) * 100).toFixed(1) : 0;
          return (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span 
                  className="w-4 h-4 rounded flex-shrink-0"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="font-medium text-slate-900 flex-1">{item.option}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>{item.votes} votes</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded overflow-hidden">
                <div
                  className="h-full transition-all duration-200 rounded"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: colors[index % colors.length]
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveResults;

