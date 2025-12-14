// import { io } from 'socket.io-client';
// import { store } from '../store/store';
// import {
//   setActivePoll,
//   updatePollResults,
//   setTimer,
//   setSocketConnected,
//   addStudent,
//   removeStudent,
//   setStudents,
//   addChatMessage,
//   setCanStartPoll,
//   addPastPoll,
//   resetPollState
// } from '../store/pollSlice';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// class SocketService {
//   constructor() {
//     this.socket = null;
//     this.isConnected = false;
//   }

//   connect() {
//     if (this.socket?.connected) {
//       return this.socket;
//     }

//     this.socket = io(API_URL, {
//       transports: ['websocket', 'polling'],
//       reconnection: true,
//       reconnectionDelay: 1000,
//       reconnectionAttempts: 5
//     });

//     this.setupEventListeners();
//     return this.socket;
//   }

//   setupEventListeners() {
//     if (!this.socket) return;

//     this.socket.on('connect', () => {
//       console.log('Socket connected');
//       this.isConnected = true;
//       store.dispatch(setSocketConnected(true));
//     });

//     this.socket.on('disconnect', () => {
//       console.log('Socket disconnected');
//       this.isConnected = false;
//       store.dispatch(setSocketConnected(false));
//     });

//     this.socket.on('error', (error) => {
//       console.error('Socket error:', error);
//     });

//     // Poll events
//     this.socket.on('poll-created', (data) => {
//       store.dispatch(setActivePoll(data.poll));
//       store.dispatch(setCanStartPoll(true));
//     });

//     this.socket.on('poll-started', (data) => {
//       store.dispatch(setActivePoll(data.poll));
//       store.dispatch(setTimer(data.timer));
//       store.dispatch(setCanStartPoll(false));
//     });

//     this.socket.on('poll-updated', (data) => {
//       store.dispatch(updatePollResults({
//         results: data.results,
//         totalAnswers: data.totalAnswers
//       }));
//     });

//     this.socket.on('poll-ended', (data) => {
//       if (data.poll) {
//         store.dispatch(addPastPoll(data.poll));
//       }
//       store.dispatch(resetPollState());
//     });

//     this.socket.on('timer-update', (seconds) => {
//       store.dispatch(setTimer(seconds));
//     });

//     this.socket.on('all-students-answered', () => {
//       store.dispatch(setCanStartPoll(true));
//     });

//     // Student events
//     this.socket.on('student-joined', (data) => {
//       store.dispatch(addStudent(data.student));
//     });

//     this.socket.on('student-left', (data) => {
//       store.dispatch(removeStudent(data.student));
//     });

//     // Chat events
//     this.socket.on('chat-message-received', (message) => {
//       store.dispatch(addChatMessage(message));
//     });
//   }

//   joinRoom(name, role) {
//     if (!this.socket) {
//       this.connect();
//     }
//     this.socket.emit('join-room', { name, role });
//   }

//   createPoll(pollData) {
//     if (!this.socket) return;
//     this.socket.emit('create-poll', pollData);
//   }

//   startPoll() {
//     if (!this.socket) return;
//     this.socket.emit('start-poll');
//   }

//   submitAnswer(optionIndex) {
//     if (!this.socket) return;
//     this.socket.emit('submit-answer', { optionIndex });
//   }

//   endPoll() {
//     if (!this.socket) return;
//     this.socket.emit('end-poll');
//   }

//   sendChatMessage(message, role) {
//     if (!this.socket) return;
//     this.socket.emit('chat-message', { message, role });
//   }

//   disconnect() {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//       this.isConnected = false;
//       store.dispatch(setSocketConnected(false));
//     }
//   }

//   getSocket() {
//     return this.socket;
//   }
// }

// // Singleton instance
// const socketService = new SocketService();

// export default socketService;



import { io } from 'socket.io-client';
import { store } from '../store/store';
import {
  setActivePoll,
  updatePollResults,
  setTimer,
  setSocketConnected,
  addStudent,
  removeStudent,
  setStudents,
  addChatMessage,
  setCanStartPoll,
  addPastPoll,
  resetPollState
} from '../store/pollSlice';

// ✅ SAME DOMAIN IN PRODUCTION
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (this.socket?.connected) return this.socket;

    this.socket = io(API_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    this.setupEventListeners();
    return this.socket;
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      store.dispatch(setSocketConnected(true));
    });

    this.socket.on('disconnect', () => {
      store.dispatch(setSocketConnected(false));
    });

    this.socket.on('poll-created', (data) => {
      store.dispatch(setActivePoll(data.poll));
      store.dispatch(setCanStartPoll(true));
    });

    this.socket.on('poll-started', (data) => {
      store.dispatch(setActivePoll(data.poll));
      store.dispatch(setTimer(data.timer));
      store.dispatch(setCanStartPoll(false));
    });

    this.socket.on('poll-updated', (data) => {
      store.dispatch(updatePollResults({
        results: data.results,
        totalAnswers: data.totalAnswers
      }));
    });

    this.socket.on('poll-ended', (data) => {
      if (data.poll) {
        store.dispatch(addPastPoll(data.poll));
      }
      store.dispatch(resetPollState());
    });

    this.socket.on('timer-update', (seconds) => {
      store.dispatch(setTimer(seconds));
    });

    this.socket.on('student-joined', (data) => {
      store.dispatch(addStudent(data.student));
    });

    this.socket.on('student-left', (data) => {
      store.dispatch(removeStudent(data.student));
    });

    this.socket.on('chat-message-received', (message) => {
      store.dispatch(addChatMessage(message));
    });
  }

  joinRoom(name, role) {
    this.connect();
    this.socket.emit('join-room', { name, role });
  }

  createPoll(data) {
    this.socket.emit('create-poll', data);
  }

  startPoll() {
    this.socket.emit('start-poll');
  }

  submitAnswer(optionIndex) {
    this.socket.emit('submit-answer', { optionIndex });
  }

  endPoll() {
    this.socket.emit('end-poll');
  }

  sendChatMessage(message, role) {
    this.socket.emit('chat-message', { message, role });
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService();
