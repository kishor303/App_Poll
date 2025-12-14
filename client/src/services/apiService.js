// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// export const pollAPI = {
//   // Get active poll
//   getActivePoll: async () => {
//     const response = await api.get('/api/polls/active');
//     return response.data;
//   },

//   // Get past polls
//   getPastPolls: async () => {
//     const response = await api.get('/api/polls/past');
//     return response.data;
//   },

//   // Create poll
//   createPoll: async (pollData) => {
//     const response = await api.post('/api/polls', pollData);
//     return response.data;
//   },

//   // Update timer
//   updateTimer: async (timer) => {
//     const response = await api.put('/api/polls/timer', { timer });
//     return response.data;
//   },

//   // Get all students
//   getStudents: async () => {
//     const response = await api.get('/api/students');
//     return response.data;
//   },

//   // Remove student
//   removeStudent: async (socketId) => {
//     const response = await api.delete(`/api/students/${socketId}`);
//     return response.data;
//   },

//   // Get poll analytics
//   getPollAnalytics: async (pollId) => {
//     const response = await api.get(`/api/polls/${pollId}/analytics`);
//     return response.data;
//   }
// };

// export default api;


import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

export const pollAPI = {
  getActivePoll: () => api.get('/api/polls/active').then(res => res.data),
  getPastPolls: () => api.get('/api/polls/past').then(res => res.data),
  createPoll: (data) => api.post('/api/polls', data).then(res => res.data),
  updateTimer: (timer) => api.put('/api/polls/timer', { timer }).then(res => res.data),
  getStudents: () => api.get('/api/students').then(res => res.data),
  removeStudent: (id) => api.delete(`/api/students/${id}`).then(res => res.data),
  getPollAnalytics: (id) => api.get(`/api/polls/${id}/analytics`).then(res => res.data)
};

export default api;
