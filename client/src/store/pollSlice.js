import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userRole: null, // 'teacher' or 'student'
  studentName: null,
  activePoll: null,
  pastPolls: [],
  students: [],
  hasAnswered: false,
  timer: 0,
  socketConnected: false,
  chatMessages: [],
  canStartPoll: false
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    setStudentName: (state, action) => {
      state.studentName = action.payload;
    },
    setActivePoll: (state, action) => {
      state.activePoll = action.payload;
      if (action.payload === null) {
        state.hasAnswered = false;
      }
    },
    setPastPolls: (state, action) => {
      state.pastPolls = action.payload;
    },
    addPastPoll: (state, action) => {
      state.pastPolls.unshift(action.payload);
    },
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    addStudent: (state, action) => {
      const exists = state.students.find(s => s.id === action.payload.id);
      if (!exists) {
        state.students.push(action.payload);
      }
    },
    removeStudent: (state, action) => {
      state.students = state.students.filter(s => s.id !== action.payload.id);
    },
    setHasAnswered: (state, action) => {
      state.hasAnswered = action.payload;
    },
    updatePollResults: (state, action) => {
      if (state.activePoll) {
        state.activePoll.results = action.payload.results;
        state.activePoll.totalAnswers = action.payload.totalAnswers || 0;
      }
    },
    setTimer: (state, action) => {
      state.timer = action.payload;
    },
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },
    addChatMessage: (state, action) => {
      state.chatMessages.push(action.payload);
      // Keep only last 100 messages
      if (state.chatMessages.length > 100) {
        state.chatMessages = state.chatMessages.slice(-100);
      }
    },
    setCanStartPoll: (state, action) => {
      state.canStartPoll = action.payload;
    },
    resetPollState: (state) => {
      state.activePoll = null;
      state.hasAnswered = false;
      state.timer = 0;
    }
  }
});

export const {
  setUserRole,
  setStudentName,
  setActivePoll,
  setPastPolls,
  addPastPoll,
  setStudents,
  addStudent,
  removeStudent,
  setHasAnswered,
  updatePollResults,
  setTimer,
  setSocketConnected,
  addChatMessage,
  setCanStartPoll,
  resetPollState
} = pollSlice.actions;

export default pollSlice.reducer;



