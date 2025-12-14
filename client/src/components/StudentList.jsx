import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { pollAPI } from '../services/apiService';
import { setStudents } from '../store/pollSlice';

const StudentList = () => {
  const dispatch = useDispatch();
  const { students, activePoll } = useSelector((state) => state.poll);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await pollAPI.getStudents();
        if (response.success) {
          dispatch(setStudents(response.students));
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
    const interval = setInterval(fetchStudents, 3000); // Refresh every 3 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleRemoveStudent = async (socketId) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      try {
        await pollAPI.removeStudent(socketId);
        const response = await pollAPI.getStudents();
        if (response.success) {
          dispatch(setStudents(response.students));
        }
      } catch (error) {
        console.error('Error removing student:', error);
        alert('Failed to remove student');
      }
    }
  };

  // Get answer status for each student if poll is active
  const getStudentAnswerStatus = (student) => {
    if (!activePoll || activePoll.status !== 'active' || !activePoll.results) {
      return null;
    }

    // Check if student has answered by checking results
    // This is a simplified check - in a real app, you'd track this more precisely
    return 'answered'; // Placeholder
  };

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-slate-900">Connected Students</h2>
        <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">{students.length}</span>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>No students connected</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {students.map((student) => {
            const answerStatus = getStudentAnswerStatus(student);
            return (
              <li key={student.id || student.socketId} className="flex justify-between items-center p-2 px-4 bg-slate-100 rounded-xl transition-colors duration-200 hover:bg-slate-200">
                <div className="flex items-center gap-4 flex-1">
                  <span className="font-medium text-slate-900">{student.name}</span>
                  {answerStatus && (
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary text-white font-semibold">
                      ✓ Answered
                    </span>
                  )}
                </div>
                <button
                  className="btn btn-danger w-8 h-8 p-0 text-xl leading-none min-w-[32px] opacity-70 hover:opacity-100"
                  onClick={() => handleRemoveStudent(student.socketId)}
                  aria-label={`Remove ${student.name}`}
                  title="Remove student"
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {activePoll && activePoll.status === 'active' && (
        <div className="pt-4 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-600">
            <strong className="text-primary font-semibold">{Object.values(activePoll.results || {}).reduce((a, b) => a + b, 0)}</strong> of{' '}
            <strong className="text-primary font-semibold">{students.length}</strong> students answered
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentList;


