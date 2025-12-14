import { useSelector } from 'react-redux';

const PollTimer = () => {
  const { timer, activePoll } = useSelector((state) => state.poll);

  if (!activePoll || activePoll.status !== 'active') {
    return null;
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = activePoll ? (timer / activePoll.timer) * 100 : 0;
  const isWarning = timer <= 10;
  const isCritical = timer <= 5;

  return (
    <div className={`card text-center animate-fade-in ${
      isCritical 
        ? 'border-2 border-danger bg-red-50' 
        : isWarning 
        ? 'border-2 border-accent' 
        : ''
    }`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-600">Time Remaining</h3>
      </div>
      <div className="mb-4">
        <span className={`text-5xl font-bold font-mono block transition-colors duration-200 ${
          isCritical ? 'text-danger animate-pulse' : 'text-primary'
        }`}>
          {formatTime(timer)}
        </span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 rounded-full ${
            isCritical 
              ? 'bg-danger' 
              : 'bg-gradient-to-r from-primary to-secondary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default PollTimer;


