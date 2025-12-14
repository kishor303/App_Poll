// import express from 'express';
// import memoryStore from '../store/memoryStore.js';

// const router = express.Router();

// /**
//  * GET /api/polls/active
//  * Get the currently active poll
//  */
// router.get('/polls/active', (req, res) => {
//   try {
//     const activePoll = memoryStore.getActivePoll();
//     if (activePoll && activePoll.status === 'active') {
//       res.json({
//         success: true,
//         poll: activePoll,
//         timer: memoryStore.getTimer()
//       });
//     } else {
//       res.json({
//         success: true,
//         poll: null,
//         timer: 0
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// /**
//  * GET /api/polls/past
//  * Get all past/completed polls
//  */
// router.get('/polls/past', (req, res) => {
//   try {
//     const pastPolls = memoryStore.getPastPolls();
//     res.json({
//       success: true,
//       polls: pastPolls
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// /**
//  * POST /api/polls
//  * Create a new poll (teacher only)
//  */
// router.post('/polls', (req, res) => {
//   try {
//     const { question, options, timer, correctAnswer, baseMark } = req.body;

//     // Validation
//     if (!question || !options || !Array.isArray(options) || options.length < 2) {
//       return res.status(400).json({
//         success: false,
//         error: 'Question and at least 2 options are required'
//       });
//     }

//     if (options.length > 6) {
//       return res.status(400).json({
//         success: false,
//         error: 'Maximum 6 options allowed'
//       });
//     }

//     // Validate correct answer index
//     if (correctAnswer !== undefined && (correctAnswer < 0 || correctAnswer >= options.length)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid correct answer index'
//       });
//     }

//     // Validate base mark
//     if (baseMark !== undefined && (baseMark < 0 || baseMark > 100)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Base mark must be between 0 and 100'
//       });
//     }

//     // Check if there's an active poll
//     const activePoll = memoryStore.getActivePoll();
//     if (activePoll && activePoll.status === 'active') {
//       // Check if all students have answered
//       if (!memoryStore.haveAllStudentsAnswered()) {
//         return res.status(400).json({
//           success: false,
//           error: 'Cannot create new poll while active poll is running'
//         });
//       }
//       // End the previous poll
//       memoryStore.endPoll();
//     }

//     const poll = memoryStore.createPoll({
//       question,
//       options,
//       correctAnswer,
//       baseMark: baseMark || 50,
//       timer: timer || 60
//     });

//     res.json({
//       success: true,
//       poll
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// /**
//  * GET /api/polls/:pollId/analytics
//  * Get analytics for a specific poll
//  */
// router.get('/polls/:pollId/analytics', (req, res) => {
//   try {
//     const { pollId } = req.params;
//     const analytics = memoryStore.getPollAnalytics(pollId);

//     if (!analytics) {
//       return res.status(404).json({
//         success: false,
//         error: 'Poll not found'
//       });
//     }

//     res.json({
//       success: true,
//       analytics
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// /**
//  * PUT /api/polls/timer
//  * Update the timer for the active poll (before starting)
//  */
// router.put('/polls/timer', (req, res) => {
//   try {
//     const { timer } = req.body;

//     if (!timer || timer < 10 || timer > 300) {
//       return res.status(400).json({
//         success: false,
//         error: 'Timer must be between 10 and 300 seconds'
//       });
//     }

//     const updated = memoryStore.updatePollTimer(timer);
//     if (updated) {
//       res.json({
//         success: true,
//         poll: memoryStore.getActivePoll()
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         error: 'Cannot update timer for active poll'
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// /**
//  * GET /api/students
//  * Get all connected students
//  */
// router.get('/students', (req, res) => {
//   try {
//     const students = memoryStore.getAllStudents();
//     res.json({
//       success: true,
//       students
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// /**
//  * DELETE /api/students/:socketId
//  * Remove a student from the poll
//  */
// router.delete('/students/:socketId', (req, res) => {
//   try {
//     const { socketId } = req.params;
//     const student = memoryStore.removeStudent(socketId);

//     if (student) {
//       res.json({
//         success: true,
//         message: 'Student removed successfully',
//         student
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         error: 'Student not found'
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }

//   /**
//  * GET /api/polls/last-completed
//  * Get last completed poll with results
//  */
// router.get('/polls/last-completed', (req, res) => {
//   try {
//     const poll = memoryStore.lastCompletedPoll;

//     if (!poll) {
//       return res.json({
//         success: true,
//         poll: null
//       });
//     }

//     res.json({
//       success: true,
//       poll
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// });

// export default router;

router.get('/polls/last-completed', (req, res) => {
  try {
    res.json({
      success: true,
      poll: memoryStore.lastCompletedPoll
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
