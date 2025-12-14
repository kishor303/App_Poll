import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketService from '../services/socketService';

const PollForm = () => {
  const dispatch = useDispatch();
  const { activePoll, canStartPoll } = useSelector((state) => state.poll);
  
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timer, setTimer] = useState(60);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [baseMark, setBaseMark] = useState(50);
  const [errors, setErrors] = useState({});

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!question.trim()) {
      newErrors.question = 'Question is required';
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    }

    options.forEach((opt, index) => {
      if (!opt.trim() && options.filter(o => o.trim()).length >= 2) {
        // Empty option is allowed if we have at least 2 filled options
      } else if (opt.trim()) {
        // Validate non-empty option
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreatePoll = () => {
    if (!validateForm()) {
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    
    // Validate correct answer if set
    if (correctAnswer !== null && (correctAnswer < 0 || correctAnswer >= validOptions.length)) {
      setErrors({ ...errors, correctAnswer: 'Invalid correct answer selection' });
      return;
    }
    
    socketService.createPoll({
      question: question.trim(),
      options: validOptions,
      correctAnswer: correctAnswer !== null ? correctAnswer : undefined,
      baseMark: parseInt(baseMark),
      timer: parseInt(timer)
    });

    // Reset form
    setQuestion('');
    setOptions(['', '']);
    setTimer(60);
    setCorrectAnswer(null);
    setBaseMark(50);
    setErrors({});
  };

  const handleStartPoll = () => {
    socketService.startPoll();
  };

  return (
    <div className="card flex flex-col gap-6">
      <h2 className="text-3xl font-semibold text-slate-900 mb-2">Create Poll</h2>

      {activePoll && activePoll.status === 'created' && (
        <div className="p-6 bg-slate-100 rounded-xl text-center">
          <p className="mb-4 text-slate-600">
            Poll created: <strong>{activePoll.question}</strong>
          </p>
          {canStartPoll && (
            <button
              className="btn btn-primary w-full py-3 text-lg font-semibold"
              onClick={handleStartPoll}
            >
              Start Poll
            </button>
          )}
          {!canStartPoll && (
            <p className="text-sm mt-2 text-slate-500">
              Waiting for previous poll to complete...
            </p>
          )}
        </div>
      )}

      {(!activePoll || activePoll.status !== 'created') && (
        <>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-slate-600 text-sm" htmlFor="question">
              Question
            </label>
            <input
              id="question"
              type="text"
              className={`input ${errors.question ? 'border-danger' : ''}`}
              placeholder="Enter your poll question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            {errors.question && (
              <span className="text-danger text-sm">{errors.question}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-slate-600 text-sm">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                {options.length > 2 && (
                  <button
                    className="btn btn-danger w-10 h-10 p-0 text-xl leading-none min-w-[40px]"
                    onClick={() => handleRemoveOption(index)}
                    aria-label="Remove option"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {options.length < 6 && (
              <button
                className="btn btn-outline w-full mt-2"
                onClick={handleAddOption}
              >
                + Add Option
              </button>
            )}
            {errors.options && (
              <span className="text-danger text-sm">{errors.options}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-slate-600 text-sm" htmlFor="correct-answer">
              Correct Answer (Optional)
            </label>
            <select
              id="correct-answer"
              className="input"
              value={correctAnswer !== null ? correctAnswer : ''}
              onChange={(e) => setCorrectAnswer(e.target.value === '' ? null : parseInt(e.target.value))}
            >
              <option value="">No correct answer (just polling)</option>
              {options.map((opt, index) => (
                opt.trim() && (
                  <option key={index} value={index}>
                    Option {index + 1}: {opt.trim()}
                  </option>
                )
              ))}
            </select>
            <small className="text-xs text-slate-500 mt-1 block">
              Select which option is the correct answer for analytics
            </small>
          </div>

          {correctAnswer !== null && (
            <div className="flex flex-col gap-2">
              <label className="font-medium text-slate-600 text-sm" htmlFor="base-mark">
                Base Mark for Pass/Fail (%)
              </label>
              <input
                id="base-mark"
                type="number"
                className="input"
                min="0"
                max="100"
                value={baseMark}
                onChange={(e) => setBaseMark(e.target.value)}
              />
              <small className="text-xs text-slate-500 mt-1 block">
                Students scoring at or above this percentage will pass
              </small>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="font-medium text-slate-600 text-sm" htmlFor="timer">
              Timer (seconds)
            </label>
            <input
              id="timer"
              type="number"
              className="input"
              min="10"
              max="300"
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary w-full py-3 text-lg font-semibold"
            onClick={handleCreatePoll}
            disabled={!question.trim() || options.filter(o => o.trim()).length < 2}
          >
            Create Poll
          </button>
        </>
      )}
    </div>
  );
};

export default PollForm;

