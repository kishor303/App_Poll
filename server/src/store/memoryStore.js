// /**
//  * In-memory data store for polls, students, and answers
//  * This will be replaced with MongoDB integration later
//  */

// class MemoryStore {
//   constructor() {
//     // Keep reference for result access
// this.lastCompletedPoll = completedPoll;

// // Clear active poll
// this.activePoll = null;
// this.currentTimerSeconds = 0;

//     // this.activePoll = null;
//     this.polls = []; // Array of completed polls
//     this.students = new Map(); // socketId -> { id, name, socketId, joinedAt }
//     this.answers = new Map(); // pollId -> Map of studentId -> { studentId, optionIndex, submittedAt }
//     this.pollTimer = null;
//     this.timerInterval = null;
//     // this.currentTimerSeconds = 0;
//     this.timerCallbacks = [];
//   }

//   /**
//    * Create a new poll (does not start it)
//    */
//   createPoll(pollData) {
//     const poll = {
//       id: `poll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       question: pollData.question,
//       options: pollData.options, // Array of option strings
//       correctAnswer: pollData.correctAnswer, // Index of correct answer
//       baseMark: pollData.baseMark || 50, // Base mark percentage for pass/fail
//       timer: pollData.timer || 60, // Default 60 seconds
//       createdAt: new Date().toISOString(),
//       status: 'created', // created, active, completed
//       results: {} // optionIndex -> count
//     };

//     // Initialize results
//     poll.options.forEach((_, index) => {
//       poll.results[index] = 0;
//     });

//     this.activePoll = poll;
//     return poll;
//   }

//   /**
//    * Start the active poll
//    */
//   startPoll(io) {
//     if (!this.activePoll) {
//       throw new Error('No active poll to start');
//     }

//     if (this.activePoll.status === 'active') {
//       throw new Error('Poll is already active');
//     }

//     this.activePoll.status = 'active';
//     this.activePoll.startedAt = new Date().toISOString();
//     this.currentTimerSeconds = this.activePoll.timer;

//     // Initialize answers map for this poll
//     this.answers.set(this.activePoll.id, new Map());

//     // Start timer with io for broadcasting
//     this.startTimer(io);

//     return this.activePoll;
//   }

//   /**
//    * Start countdown timer
//    */
//   startTimer(io) {
//     if (this.timerInterval) {
//       clearInterval(this.timerInterval);
//     }

//     this.timerInterval = setInterval(() => {
//       this.currentTimerSeconds--;

//       // Broadcast timer update to all clients
//       if (io) {
//         io.emit('timer-update', this.currentTimerSeconds);
//       }

//       // Notify all callbacks
//       this.timerCallbacks.forEach(callback => {
//         callback(this.currentTimerSeconds);
//       });

//       // Auto-end poll when timer reaches 0
//       if (this.currentTimerSeconds <= 0) {
//         const completedPoll = this.endPoll();
//         if (io && completedPoll) {
//           io.emit('poll-ended', {
//             poll: completedPoll
//           });
//         }
//       }
//     }, 1000);
//   }

//   /**
//    * Stop timer
//    */
//   stopTimer() {
//     if (this.timerInterval) {
//       clearInterval(this.timerInterval);
//       this.timerInterval = null;
//     }
//   }

//   /**
//    * Subscribe to timer updates
//    */
//   onTimerUpdate(callback) {
//     this.timerCallbacks.push(callback);
//     return () => {
//       this.timerCallbacks = this.timerCallbacks.filter(cb => cb !== callback);
//     };
//   }

//   /**
//    * Get current timer value
//    */
//   getTimer() {
//     return this.currentTimerSeconds;
//   }

//   /**
//    * Update poll timer (before starting)
//    */
//   updatePollTimer(seconds) {
//     if (this.activePoll && this.activePoll.status !== 'active') {
//       this.activePoll.timer = seconds;
//       return true;
//     }
//     return false;
//   }

//   /**
//    * End the active poll
//    */
//   endPoll() {
//     if (!this.activePoll || this.activePoll.status !== 'active') {
//       return null;
//     }

//     this.stopTimer();
//     this.activePoll.status = 'completed';
//     this.activePoll.completedAt = new Date().toISOString();
//     this.activePoll.totalAnswers = this.getAnswerCount(this.activePoll.id);

//     // Move to past polls
//     const completedPoll = { ...this.activePoll };
//     this.polls.push(completedPoll);

//     // Clear active poll
//     this.activePoll = null;
//     this.currentTimerSeconds = 0;

//     return completedPoll;
//   }

//   /**
//    * Submit an answer to the active poll
//    */
//   submitAnswer(pollId, studentId, optionIndex) {
//     if (!this.activePoll || this.activePoll.id !== pollId) {
//       throw new Error('No active poll');
//     }

//     if (this.activePoll.status !== 'active') {
//       throw new Error('Poll is not active');
//     }

//     const pollAnswers = this.answers.get(pollId);
//     if (!pollAnswers) {
//       throw new Error('Poll answers not initialized');
//     }

//     // Check if student already answered
//     if (pollAnswers.has(studentId)) {
//       throw new Error('Student already answered');
//     }

//     // Validate option index
//     if (optionIndex < 0 || optionIndex >= this.activePoll.options.length) {
//       throw new Error('Invalid option index');
//     }

//     // Store answer
//     pollAnswers.set(studentId, {
//       studentId,
//       optionIndex,
//       submittedAt: new Date().toISOString()
//     });

//     // Update results
//     this.activePoll.results[optionIndex] = (this.activePoll.results[optionIndex] || 0) + 1;

//     return {
//       pollId,
//       studentId,
//       optionIndex,
//       results: { ...this.activePoll.results }
//     };
//   }

//   /**
//    * Get answer count for a poll
//    */
//   getAnswerCount(pollId) {
//     const pollAnswers = this.answers.get(pollId);
//     return pollAnswers ? pollAnswers.size : 0;
//   }

//   /**
//    * Check if all students have answered
//    */
//   haveAllStudentsAnswered() {
//     if (!this.activePoll || this.activePoll.status !== 'active') {
//       return false;
//     }

//     const answerCount = this.getAnswerCount(this.activePoll.id);
//     const studentCount = this.students.size;
    
//     return studentCount > 0 && answerCount >= studentCount;
//   }

//   /**
//    * Get active poll
//    */
//   getActivePoll() {
//     return this.activePoll;
//   }

//   /**
//    * Get past polls
//    */
//   getPastPolls() {
//     return [...this.polls].reverse(); // Most recent first
//   }

//   /**
//    * Get a specific poll by ID
//    */
//   getPollById(pollId) {
//     if (this.activePoll && this.activePoll.id === pollId) {
//       return this.activePoll;
//     }
//     return this.polls.find(p => p.id === pollId);
//   }

//   /**
//    * Add a student
//    */
//   addStudent(socketId, studentData) {
//     // Check if name already exists
//     const existingStudent = Array.from(this.students.values()).find(
//       s => s.name.toLowerCase() === studentData.name.toLowerCase()
//     );

//     if (existingStudent && existingStudent.socketId !== socketId) {
//       throw new Error('Name already taken');
//     }

//     const student = {
//       id: studentData.id || `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       name: studentData.name,
//       socketId,
//       joinedAt: new Date().toISOString()
//     };

//     this.students.set(socketId, student);
//     return student;
//   }

//   /**
//    * Remove a student
//    */
//   removeStudent(socketId) {
//     const student = this.students.get(socketId);
//     if (student) {
//       this.students.delete(socketId);
//       return student;
//     }
//     return null;
//   }

//   /**
//    * Get student by socket ID
//    */
//   getStudent(socketId) {
//     return this.students.get(socketId);
//   }

//   /**
//    * Get all students
//    */
//   getAllStudents() {
//     return Array.from(this.students.values());
//   }

//   /**
//    * Check if student has answered the active poll
//    */
//   hasStudentAnswered(socketId) {
//     if (!this.activePoll || this.activePoll.status !== 'active') {
//       return false;
//     }

//     const pollAnswers = this.answers.get(this.activePoll.id);
//     if (!pollAnswers) {
//       return false;
//     }

//     const student = this.students.get(socketId);
//     if (!student) {
//       return false;
//     }

//     return pollAnswers.has(student.id);
//   }

//   /**
//    * Get analytics for a poll
//    */
//   getPollAnalytics(pollId) {
//     const poll = pollId === this.activePoll?.id ? this.activePoll : this.getPollById(pollId);
//     if (!poll) {
//       return null;
//     }

//     const pollAnswers = this.answers.get(poll.id);
//     if (!pollAnswers) {
//       return {
//         totalAnswers: 0,
//         correctAnswers: 0,
//         wrongAnswers: 0,
//         passed: 0,
//         failed: 0,
//         studentAnswers: []
//       };
//     }

//     let correctAnswers = 0;
//     let wrongAnswers = 0;
//     let passed = 0;
//     let failed = 0;
//     const studentAnswers = [];

//     pollAnswers.forEach((answer, studentId) => {
//       const student = Array.from(this.students.values()).find(s => s.id === studentId);
//       const isCorrect = poll.correctAnswer !== undefined && answer.optionIndex === poll.correctAnswer;
      
//       if (isCorrect) {
//         correctAnswers++;
//       } else {
//         wrongAnswers++;
//       }

//       // Calculate pass/fail based on base mark
//       // If correct, student gets 100%, if wrong, 0%
//       const studentScore = isCorrect ? 100 : 0;
//       const passedStudent = studentScore >= poll.baseMark;
      
//       if (passedStudent) {
//         passed++;
//       } else {
//         failed++;
//       }

//       studentAnswers.push({
//         studentId: student?.id || studentId,
//         studentName: student?.name || 'Unknown',
//         optionIndex: answer.optionIndex,
//         optionText: poll.options[answer.optionIndex] || 'Unknown',
//         isCorrect,
//         score: studentScore,
//         passed: passedStudent,
//         submittedAt: answer.submittedAt
//       });
//     });

//     return {
//       totalAnswers: pollAnswers.size,
//       correctAnswers,
//       wrongAnswers,
//       passed,
//       failed,
//       studentAnswers
//     };
//   }
// }

// // Singleton instance
// const memoryStore = new MemoryStore();

// export default memoryStore;

class MemoryStore {
  constructor() {
    this.activePoll = null;
    this.lastCompletedPoll = null; // ✅ FIXED
    this.polls = [];
    this.students = new Map();
    this.answers = new Map();
    this.timerInterval = null;
    this.currentTimerSeconds = 0;
    this.timerCallbacks = [];
  }

  createPoll(pollData) {
    const poll = {
      id: `poll_${Date.now()}`,
      question: pollData.question,
      options: pollData.options,
      correctAnswer: pollData.correctAnswer,
      baseMark: pollData.baseMark || 50,
      timer: pollData.timer || 60,
      createdAt: new Date().toISOString(),
      status: 'created',
      results: {}
    };

    poll.options.forEach((_, i) => (poll.results[i] = 0));
    this.activePoll = poll;
    return poll;
  }

  startPoll(io) {
    this.activePoll.status = 'active';
    this.currentTimerSeconds = this.activePoll.timer;
    this.answers.set(this.activePoll.id, new Map());
    this.startTimer(io);
    return this.activePoll;
  }

  startTimer(io) {
    this.timerInterval = setInterval(() => {
      this.currentTimerSeconds--;
      io.emit('timer-update', this.currentTimerSeconds);

      if (this.currentTimerSeconds <= 0) {
        const completedPoll = this.endPoll();
        if (completedPoll) {
          io.emit('poll-ended', {
            poll: completedPoll,
            results: completedPoll.results
          });
        }
      }
    }, 1000);
  }

  endPoll() {
    if (!this.activePoll) return null;

    clearInterval(this.timerInterval);
    this.activePoll.status = 'completed';
    this.activePoll.completedAt = new Date().toISOString();
    this.activePoll.totalAnswers = this.getAnswerCount(this.activePoll.id);

    const completedPoll = { ...this.activePoll };
    this.polls.push(completedPoll);
    this.lastCompletedPoll = completedPoll; // ✅ IMPORTANT

    this.activePoll = null;
    this.currentTimerSeconds = 0;

    return completedPoll;
  }

  submitAnswer(pollId, studentId, optionIndex) {
    const pollAnswers = this.answers.get(pollId);
    pollAnswers.set(studentId, optionIndex);
    this.activePoll.results[optionIndex]++;
    return { results: this.activePoll.results };
  }

  getAnswerCount(pollId) {
    return this.answers.get(pollId)?.size || 0;
  }

  getActivePoll() {
    return this.activePoll;
  }

  getPastPolls() {
    return [...this.polls].reverse();
  }
}

export default new MemoryStore();
