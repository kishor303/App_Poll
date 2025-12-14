// import { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import socketService from '../services/socketService';
// import {
//   setUserRole,
//   setStudentName,
//   setHasAnswered,
//   setActivePoll
// } from '../store/pollSlice';
// import PollTimer from './PollTimer';
// import LiveResults from './LiveResults';
// import ChatPopup from './ChatPopup';

// const StudentView = () => {
//   const dispatch = useDispatch();
//   const { activePoll, studentName, hasAnswered, timer } = useSelector((state) => state.poll);
//   const [nameInput, setNameInput] = useState('');
//   const [nameSet, setNameSet] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     // Check if name is already stored
//     const storedName = localStorage.getItem('studentName');
//     if (storedName) {
//       dispatch(setStudentName(storedName));
//       setNameInput(storedName);
//       setNameSet(true);
//       handleJoinRoom(storedName);
//     }
//   }, [dispatch]);

//   const handleJoinRoom = (name) => {
//     dispatch(setUserRole('student'));
//     socketService.connect();
//     socketService.joinRoom(name, 'student');
//   };

//   const handleNameSubmit = (e) => {
//     e.preventDefault();
    
//     if (!nameInput.trim()) {
//       setError('Please enter your name');
//       return;
//     }

//     const trimmedName = nameInput.trim();
//     dispatch(setStudentName(trimmedName));
//     localStorage.setItem('studentName', trimmedName);
//     setNameSet(true);
//     handleJoinRoom(trimmedName);
//     setError('');
//   };

//   const handleOptionSelect = (optionIndex) => {
//     if (hasAnswered || !activePoll || activePoll.status !== 'active') {
//       return;
//     }

//     setSelectedOption(optionIndex);
//   };

//   const handleSubmitAnswer = () => {
//     if (selectedOption === null || hasAnswered) {
//       return;
//     }

//     if (!activePoll || activePoll.status !== 'active') {
//       alert('Poll is not active');
//       return;
//     }

//     if (timer <= 0) {
//       alert('Time has expired');
//       return;
//     }

//     socketService.submitAnswer(selectedOption);
//     dispatch(setHasAnswered(true));
//   };

//   // Listen for answer submission confirmation
//   useEffect(() => {
//     const socket = socketService.getSocket();
//     if (socket) {
//       const handleAnswerSubmitted = () => {
//         dispatch(setHasAnswered(true));
//       };

//       socket.on('answer-submitted', handleAnswerSubmitted);

//       return () => {
//         socket.off('answer-submitted', handleAnswerSubmitted);
//       };
//     }
//   }, [dispatch]);

//   // Reset answered state when new poll starts
//   useEffect(() => {
//     if (activePoll && activePoll.status === 'active') {
//       dispatch(setHasAnswered(false));
//       setSelectedOption(null);
//     }
//   }, [activePoll?.id, dispatch]);

//   if (!nameSet) {
//     return (
//       <div className="flex items-center justify-center min-h-screen p-4 md:p-8">
//         <div className="w-full max-w-md text-center card">
//           <h1 className="mb-2 text-3xl font-semibold text-slate-900">Welcome to Live Polling</h1>
//           <p className="mb-6 text-slate-600">
//             Please enter your name to join
//           </p>
//           <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
//             <input
//               type="text"
//               className={`input text-lg p-4 ${error ? 'border-danger' : ''}`}
//               placeholder="Enter your name"
//               value={nameInput}
//               onChange={(e) => {
//                 setNameInput(e.target.value);
//                 setError('');
//               }}
//               autoFocus
//             />
//             {error && <span className="text-sm text-left text-danger">{error}</span>}
//             <button type="submit" className="p-4 text-lg font-semibold btn btn-primary">
//               Join
//             </button>
//           </form>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-slate-50">
//       <header className="px-4 py-4 bg-white border-b shadow-sm md:px-8 md:py-6 border-slate-200">
//         <div className="flex flex-wrap items-center justify-between max-w-6xl gap-6 mx-auto">
//           <h1 className="m-0 text-3xl font-bold md:text-5xl text-slate-900">Student View</h1>
//           <div className="flex items-center gap-4">
//             <span className="px-6 py-2 font-medium text-white rounded-full bg-primary">{studentName}</span>
//             <ChatPopup />
//           </div>
//         </div>
//       </header>

//       <main className="flex flex-col flex-1 w-full max-w-6xl gap-4 p-4 mx-auto md:p-8 md:gap-8">
//         {!activePoll || activePoll.status !== 'active' ? (
//           <div className="py-12 text-center card">
//             <h2 className="mb-4 text-3xl font-semibold text-slate-900">Waiting for Poll</h2>
//             <p className="text-lg text-slate-500">
//               The teacher hasn't started a poll yet. Please wait...
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="flex flex-col gap-6">
//               <div className="text-center card">
//                 <PollTimer />
//                 <h2 className="mt-6 text-3xl font-semibold leading-relaxed text-slate-900">{activePoll.question}</h2>
//               </div>

//               {!hasAnswered ? (
//                 <div className="flex flex-col gap-6 card">
//                   <h3 className="text-lg font-semibold text-center text-slate-900">Select your answer:</h3>
//                   <div className="grid grid-cols-1 gap-4">
//                     {activePoll.options.map((option, index) => (
//                       <button
//                         key={index}
//                         className={`btn p-6 text-lg text-left justify-start whitespace-normal break-words min-h-[60px] ${
//                           selectedOption === index
//                             ? 'bg-primary text-white border-primary'
//                             : 'btn-outline'
//                         }`}
//                         onClick={() => handleOptionSelect(index)}
//                         disabled={timer <= 0}
//                       >
//                         {option}
//                       </button>
//                     ))}
//                   </div>
//                   <button
//                     className="w-full py-4 text-lg font-semibold btn btn-primary"
//                     onClick={handleSubmitAnswer}
//                     disabled={selectedOption === null || timer <= 0}
//                   >
//                     Submit Answer
//                   </button>
//                   {timer <= 0 && (
//                     <p className="py-2 font-medium text-center text-danger">
//                       Time's up! Answers are no longer accepted.
//                     </p>
//                   )}
//                 </div>
//               ) : (
//                 <div className="py-12 text-center text-white card bg-gradient-to-br from-secondary to-secondary-dark">
//                   <div className="mb-4 text-6xl leading-none">✓</div>
//                   <h3 className="mb-4 text-3xl font-semibold text-white">Answer Submitted!</h3>
//                   <p className="mb-2 text-lg text-white">
//                     You selected: <strong>{activePoll.options[selectedOption]}</strong>
//                   </p>
//                   <p className="text-sm text-white/90">
//                     View the live results below
//                   </p>
//                 </div>
//               )}
//             </div>

//             {hasAnswered && (
//               <div className="animate-fade-in">
//                 <LiveResults />
//               </div>
//             )}
//           </>
//         )}
//       </main>
//     </div>
//   );
// };

// export default StudentView;


import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socketService from '../services/socketService';
import {
  setUserRole,
  setStudentName,
  setHasAnswered,
  setActivePoll
} from '../store/pollSlice';
import PollTimer from './PollTimer';
import LiveResults from './LiveResults';
import ChatPopup from './ChatPopup';

const StudentView = () => {
  const dispatch = useDispatch();
  const { activePoll, studentName, hasAnswered, timer } = useSelector(
    (state) => state.poll
  );

  const [nameInput, setNameInput] = useState('');
  const [nameSet, setNameSet] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState('');

  // ✅ NEW STATES
  const [pollEnded, setPollEnded] = useState(false);
  const [finalResults, setFinalResults] = useState(null);

  // Auto-join if name exists
  useEffect(() => {
    const storedName = localStorage.getItem('studentName');
    if (storedName) {
      dispatch(setStudentName(storedName));
      setNameInput(storedName);
      setNameSet(true);
      handleJoinRoom(storedName);
    }
  }, [dispatch]);

  const handleJoinRoom = (name) => {
    dispatch(setUserRole('student'));
    socketService.connect();
    socketService.joinRoom(name, 'student');
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setError('Please enter your name');
      return;
    }

    const trimmedName = nameInput.trim();
    dispatch(setStudentName(trimmedName));
    localStorage.setItem('studentName', trimmedName);
    setNameSet(true);
    handleJoinRoom(trimmedName);
    setError('');
  };

  const handleOptionSelect = (optionIndex) => {
    if (
      hasAnswered ||
      pollEnded ||
      !activePoll ||
      activePoll.status !== 'active'
    ) {
      return;
    }
    setSelectedOption(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (
      selectedOption === null ||
      hasAnswered ||
      pollEnded ||
      !activePoll ||
      activePoll.status !== 'active' ||
      timer <= 0
    ) {
      return;
    }

    socketService.submitAnswer(selectedOption);
    dispatch(setHasAnswered(true));
  };

  // Listen for answer confirmation
  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    const handleAnswerSubmitted = () => {
      dispatch(setHasAnswered(true));
    };

    socket.on('answer-submitted', handleAnswerSubmitted);
    return () => socket.off('answer-submitted', handleAnswerSubmitted);
  }, [dispatch]);

  // ✅ LISTEN FOR POLL ENDED (MAIN FEATURE)
  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    const handlePollEnded = ({ poll, results }) => {
      setPollEnded(true);
      setFinalResults(results || poll?.results || {});
      dispatch(setActivePoll(poll));
    };

    socket.on('poll-ended', handlePollEnded);
    return () => socket.off('poll-ended', handlePollEnded);
  }, [dispatch]);

  // Reset when new poll starts
  useEffect(() => {
    if (activePoll && activePoll.status === 'active') {
      dispatch(setHasAnswered(false));
      setSelectedOption(null);
      setPollEnded(false);
      setFinalResults(null);
    }
  }, [activePoll?.id, dispatch]);

  // Name screen
  if (!nameSet) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md text-center card">
          <h1 className="mb-4 text-3xl font-semibold">Welcome to Live Polling</h1>
          <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
            <input
              className="p-4 input"
              placeholder="Enter your name"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                setError('');
              }}
            />
            {error && <span className="text-danger">{error}</span>}
            <button className="p-4 btn btn-primary">Join</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <h1 className="text-3xl font-bold">Student View</h1>
        <div className="flex items-center gap-4">
          <span className="px-4 py-2 text-white rounded-full bg-primary">
            {studentName}
          </span>
          <ChatPopup />
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl p-6 mx-auto">
        {!activePoll ? (
          <div className="py-12 text-center card">
            <h2 className="text-2xl font-semibold">Waiting for Poll</h2>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center card">
              <PollTimer />
              <h2 className="mt-4 text-2xl font-semibold">
                {activePoll.question}
              </h2>
            </div>

            {!pollEnded && !hasAnswered && (
              <div className="flex flex-col gap-4 card">
                {activePoll.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`btn ${
                      selectedOption === idx ? 'btn-primary' : 'btn-outline'
                    }`}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={timer <= 0}
                  >
                    {opt}
                  </button>
                ))}

                <button
                  className="mt-4 btn btn-primary"
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null || timer <= 0 || pollEnded}
                >
                  Submit Answer
                </button>
              </div>
            )}

            {hasAnswered && !pollEnded && (
              <div className="py-10 text-center card">
                <h3 className="text-2xl font-semibold text-success">
                  Answer Submitted!
                </h3>
              </div>
            )}

            {/* ✅ FINAL RESULTS SHOWN AFTER POLL ENDS */}
            {pollEnded && finalResults && (
              <div className="mt-6">
                <LiveResults results={finalResults} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default StudentView;
