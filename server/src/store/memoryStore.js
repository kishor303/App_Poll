class MemoryStore {
  constructor() {
    this.activePoll = null;
    this.lastCompletedPoll = null;
    this.polls = [];
    this.students = new Map(); // socketId -> student
    this.answers = new Map();  // pollId -> Map(studentId, optionIndex)
    this.timerInterval = null;
    this.currentTimerSeconds = 0;
  }

  /* ================= POLL METHODS ================= */

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
            results: completedPoll.results,
            totalAnswers: completedPoll.totalAnswers
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
    this.lastCompletedPoll = completedPoll;

    this.activePoll = null;
    this.currentTimerSeconds = 0;

    return completedPoll;
  }

  getActivePoll() {
    return this.activePoll;
  }

  getPastPolls() {
    return [...this.polls].reverse();
  }

  getTimer() {
    return this.currentTimerSeconds;
  }

  /* ================= STUDENT METHODS ================= */

  addStudent(socketId, studentData) {
    if (this.students.has(socketId)) {
      throw new Error('Student already joined');
    }

    const student = {
      id: socketId,
      name: studentData.name,
      socketId
    };

    this.students.set(socketId, student);
    return student;
  }

  removeStudent(socketId) {
    const student = this.students.get(socketId);
    if (!student) return null;

    this.students.delete(socketId);

    // Remove student answers if poll active
    if (this.activePoll) {
      const pollAnswers = this.answers.get(this.activePoll.id);
      if (pollAnswers) {
        pollAnswers.delete(socketId);
      }
    }

    return student;
  }

  getStudent(socketId) {
    return this.students.get(socketId);
  }

  getAllStudents() {
    return Array.from(this.students.values());
  }

  /* ================= ANSWER METHODS ================= */

  submitAnswer(pollId, studentId, optionIndex) {
    const pollAnswers = this.answers.get(pollId);
    if (!pollAnswers) return null;

    pollAnswers.set(studentId, optionIndex);
    this.activePoll.results[optionIndex]++;

    return { results: this.activePoll.results };
  }

  hasStudentAnswered(studentId) {
    if (!this.activePoll) return false;

    const pollAnswers = this.answers.get(this.activePoll.id);
    return pollAnswers ? pollAnswers.has(studentId) : false;
  }

  haveAllStudentsAnswered() {
    if (!this.activePoll) return false;

    const pollAnswers = this.answers.get(this.activePoll.id);
    if (!pollAnswers) return false;

    return pollAnswers.size === this.students.size;
  }

  getAnswerCount(pollId) {
    return this.answers.get(pollId)?.size || 0;
  }
}

export default new MemoryStore();
