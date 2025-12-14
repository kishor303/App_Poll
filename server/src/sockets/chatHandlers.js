import memoryStore from '../store/memoryStore.js';

/**
 * Initialize Socket.io handlers for chat functionality (bonus feature)
 */
export function initializeChatHandlers(socket, io) {
  // Send chat message
  socket.on('chat-message', (data) => {
    try {
      const { message, role } = data;

      if (!message || message.trim().length === 0) {
        socket.emit('error', { message: 'Message cannot be empty' });
        return;
      }

      let senderName = 'Unknown';

      if (role === 'teacher') {
        senderName = 'Teacher';
      } else if (role === 'student') {
        const student = memoryStore.getStudent(socket.id);
        if (student) {
          senderName = student.name;
        } else {
          socket.emit('error', { message: 'Student not registered' });
          return;
        }
      }

      const chatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderName,
        role,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        socketId: socket.id
      };

      // Broadcast to all clients
      io.emit('chat-message-received', chatMessage);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });
}



