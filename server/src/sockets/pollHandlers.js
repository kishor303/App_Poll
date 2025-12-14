import memoryStore from '../store/memoryStore.js';

/**
 * Initialize Socket.io handlers for poll-related events
 */
export function initializeSocketHandlers(socket, io) {
  // Student joins and registers name
  socket.on('join-room', (data) => {
    try {
      const { name, role } = data;

      if (!name || name.trim().length === 0) {
        socket.emit('error', { message: 'Name is required' });
        return;
      }

      if (role === 'student') {
        try {
          const student = memoryStore.addStudent(socket.id, {
            name: name.trim(),
            id: socket.id
          });

          socket.emit('joined-room', {
            success: true,
            student,
            activePoll: memoryStore.getActivePoll()
          });

          // Notify all clients about new student
          io.emit('student-joined', {
            student,
            totalStudents: memoryStore.getAllStudents().length
          });

          // Send current timer if poll is active
          if (memoryStore.getActivePoll() && memoryStore.getActivePoll().status === 'active') {
            socket.emit('timer-update', memoryStore.getTimer());
          }
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      } else if (role === 'teacher') {
        // Teacher joins
        socket.join('teachers');
        socket.emit('joined-room', {
          success: true,
          role: 'teacher',
          activePoll: memoryStore.getActivePoll(),
          students: memoryStore.getAllStudents()
        });

        // Send current timer if poll is active
        if (memoryStore.getActivePoll() && memoryStore.getActivePoll().status === 'active') {
          socket.emit('timer-update', memoryStore.getTimer());
        }
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Teacher creates a poll (via socket)
  socket.on('create-poll', (data) => {
    try {
      const { question, options, timer, correctAnswer, baseMark } = data;

      if (!question || !options || !Array.isArray(options) || options.length < 2) {
        socket.emit('error', { message: 'Question and at least 2 options are required' });
        return;
      }

      // Validate correct answer index
      if (correctAnswer !== undefined && (correctAnswer < 0 || correctAnswer >= options.length)) {
        socket.emit('error', { message: 'Invalid correct answer index' });
        return;
      }

      // Check if there's an active poll
      const activePoll = memoryStore.getActivePoll();
      if (activePoll && activePoll.status === 'active') {
        if (!memoryStore.haveAllStudentsAnswered()) {
          socket.emit('error', { message: 'Cannot create new poll while active poll is running' });
          return;
        }
        memoryStore.endPoll();
      }

      const poll = memoryStore.createPoll({
        question,
        options,
        correctAnswer,
        baseMark: baseMark || 50,
        timer: timer || 60
      });

      // Notify all clients
      io.emit('poll-created', { poll });

      socket.emit('poll-created-success', { poll });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Teacher starts a poll
  socket.on('start-poll', () => {
    try {
      const activePoll = memoryStore.getActivePoll();

      if (!activePoll) {
        socket.emit('error', { message: 'No poll to start. Create a poll first.' });
        return;
      }

      if (activePoll.status === 'active') {
        socket.emit('error', { message: 'Poll is already active' });
        return;
      }

      const poll = memoryStore.startPoll(io);

      // Broadcast to all clients
      io.emit('poll-started', {
        poll,
        timer: memoryStore.getTimer()
      });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Student submits an answer
  socket.on('submit-answer', (data) => {
    try {
      const { optionIndex } = data;

      if (typeof optionIndex !== 'number') {
        socket.emit('error', { message: 'Invalid option index' });
        return;
      }

      const student = memoryStore.getStudent(socket.id);
      if (!student) {
        socket.emit('error', { message: 'Student not registered' });
        return;
      }

      const activePoll = memoryStore.getActivePoll();
      if (!activePoll || activePoll.status !== 'active') {
        socket.emit('error', { message: 'No active poll' });
        return;
      }

      // Check if already answered
      if (memoryStore.hasStudentAnswered(socket.id)) {
        socket.emit('error', { message: 'You have already answered this poll' });
        return;
      }

      const result = memoryStore.submitAnswer(activePoll.id, student.id, optionIndex);

      // Confirm to student
      socket.emit('answer-submitted', {
        success: true,
        optionIndex,
        results: result.results
      });

      // Broadcast updated results to all clients
      io.emit('poll-updated', {
        pollId: activePoll.id,
        results: result.results,
        totalAnswers: memoryStore.getAnswerCount(activePoll.id),
        totalStudents: memoryStore.getAllStudents().length
      });

      // Check if all students have answered
      if (memoryStore.haveAllStudentsAnswered()) {
        io.emit('all-students-answered', {
          pollId: activePoll.id
        });
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Teacher ends poll manually
  socket.on('end-poll', () => {
    try {
      const activePoll = memoryStore.getActivePoll();
      if (!activePoll || activePoll.status !== 'active') {
        socket.emit('error', { message: 'No active poll to end' });
        return;
      }

      const completedPoll = memoryStore.endPoll();

      // Broadcast to all clients
      io.emit('poll-ended', {
       poll: completedPoll,
  results: completedPoll.results,
  totalAnswers: completedPoll.totalAnswers
      });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Handle disconnect - remove student
  socket.on('disconnect', () => {
    const student = memoryStore.removeStudent(socket.id);
    if (student) {
      io.emit('student-left', {
        student,
        totalStudents: memoryStore.getAllStudents().length
      });
    }
  });

}

